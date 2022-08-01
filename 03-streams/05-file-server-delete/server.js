const http = require('http');
const path = require('path');
const fs = require('fs');

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
    case 'DELETE':
      if (pathname.includes('/')) {
        res.statusCode = 400;
        res.end('Not found');
      } else if (!fs.existsSync(filepath)) {
        res.statusCode = 404;
        res.end(`File doesn't exist`);
      } else {
        deleteFile(filepath);
        res.statusCode = 200;
        res.end('Success');
      }
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
