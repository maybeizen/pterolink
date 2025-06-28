declare global {
  interface ErrorConstructor {
    captureStackTrace(targetObject: object, constructorOpt?: Function): void;
  }
}

export class PteroError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number,
    public errors?: Array<{ code: string; detail: string }>,
    public response?: any
  ) {
    super(message);
    this.name = this.constructor.name;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }

    Object.defineProperty(this, "message", { enumerable: true });
    Object.defineProperty(this, "code", { enumerable: true });
    Object.defineProperty(this, "statusCode", { enumerable: true });
    Object.defineProperty(this, "errors", { enumerable: true });
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      errors: this.errors,
    };
  }
}
