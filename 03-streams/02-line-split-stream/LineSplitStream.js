const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.encoding = options.encoding;
    this.word = '';
  }

  _transform(chunk, _, callback) {
    const str = chunk.toString(this.encoding);

    for (let i = 0; i < str.length; i++) {
      if (str[i] === os.EOL) {
        this.push(this.word);
        this.word = '';
      } else this.word += str[i];
    }

    callback(null);
  }

  _flush(callback) {
    callback(null, this.word);
  }
}

module.exports = LineSplitStream;
