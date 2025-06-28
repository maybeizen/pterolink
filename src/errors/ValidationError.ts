import { PteroError } from "./PteroError.js";

export class ValidationError extends PteroError {
  constructor(
    message: string,
    errors?: Array<{ field: string; detail: string }>
  ) {
    super(
      message,
      "VALIDATION_ERROR",
      400,
      errors?.map((err) => ({
        code: "VALIDATION_ERROR",
        detail: `${err.field}: ${err.detail}`,
      }))
    );
  }
}
