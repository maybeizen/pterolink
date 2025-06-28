import { PteroError } from "./PteroError.js";

export class UnauthorizedError extends PteroError {
  constructor(message: string = "Unauthorized access") {
    super(message, "UNAUTHORIZED", 401);
  }
}
