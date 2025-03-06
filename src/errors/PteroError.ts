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
    public errors?: Array<{ code: string; detail: string }>
  ) {
    super(message);
    this.name = this.constructor.name;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
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
