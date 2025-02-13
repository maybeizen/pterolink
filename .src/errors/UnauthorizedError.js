import PteroError from "./PteroError.js";

class UnauthorizedError extends PteroError {
  constructor(message = "Unauthorized access") {
    super(message, "UNAUTHORIZED");
  }
}

export default UnauthorizedError;
