const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.limit = options.limit;
    this.encoding = options.encoding;
    this.size = 0;
  }

  _transform(chunk, _, callback) {
    this.size += Buffer.byteLength(chunk, this.encoding);
    if (this.size > this.limit) callback(new LimitExceededError())
    else callback(null, chunk);
  }
}

module.exports = LimitSizeStream;
