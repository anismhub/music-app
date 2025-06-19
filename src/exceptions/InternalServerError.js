const ServerError = require('./ServerError');

class InternalServerError extends ServerError {
  constructor(message) {
    super(message, 500);
    this.name = 'InternalServerError';
  }
}

module.exports = InternalServerError;
