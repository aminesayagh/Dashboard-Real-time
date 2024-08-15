import { CustomError, Context, UsedCodesError } from './CustomError';

type Param = {
  code?: UsedCodesError;
  message?: string;
  logging?: boolean;
  context?: Context;
};

class BadRequestError extends CustomError {
  private static readonly _statusCode = 400;
  private readonly _code: UsedCodesError;
  private readonly _logging: boolean;
  private readonly _context: Context;

  constructor(params?: Param) {
    const { code, message, logging, context } = params || {};
    super(message || 'Bad Request');
    this._code = code || BadRequestError._statusCode;
    this._logging = logging || false;
    this._context = context || {};

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
  get errors() {
    return [{ message: this.message, context: this._context }];
  }
  get statusCode() {
    return this._code;
  }
  get logging() {
    return this._logging;
  }
}

export function badRequestError(params: Param) {
  return new BadRequestError(params);
}
