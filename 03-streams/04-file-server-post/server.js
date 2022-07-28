const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream.js');

const server = new http.Server();

/**
 * For deleting file by path
 * @param {string | Buffer | URL} path
 */
function deleteFile(path) {
  fs.unlink(path, () => {});
}

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST':
      if (pathname.includes('/')) {
        res.statusCode = 400;
        res.end('Not found');
      } else if (fs.existsSync(filepath)) {
        res.statusCode = 409;
        res.end('File existed');
      } else {
        const limitedStream = new LimitSizeStream({limit: 1000000, objectMode: true});
        const writeStream = fs.createWriteStream(filepath);

        req.pipe(limitedStream).pipe(writeStream);

        writeStream.on('finish', () => {
          res.statusCode = 201;
          res.end('Succeed');
        });

        limitedStream.on('error', (err) => {
          deleteFile(filepath);
          if (err.code === 'LIMIT_EXCEEDED') {
            res.statusCode = 413;
            res.end(err.message);
          } else {
            res.statusCode = err.code;
            res.end(err.message);
          }
        });

        req.on('aborted', () => {
          deleteFile(filepath);
          writeStream.destroy();
        });
      }

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
