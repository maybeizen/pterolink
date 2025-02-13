import PteroError from "./PteroError.js";

class ValidationError extends PteroError {
  constructor(message, errors = []) {
    super(message, "VALIDATION_ERROR");
    this.errors = errors;
  }
}

export default ValidationError;
