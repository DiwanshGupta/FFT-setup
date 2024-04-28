export class Errorhandler extends Error {
  statuscode: Number;
  constructor(message: any, statusCode: Number) {
    super(message);
    this.statuscode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}
