export abstract class BaseException extends Error {
    status?: number;
    reason?: string;
  
    constructor(message: string) {
      super(message);
      this.name = this.constructor.name;
      Error.captureStackTrace(this, this.constructor);
    }
  }