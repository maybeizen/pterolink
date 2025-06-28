import { PteroError } from "./PteroError.js";

export class NotFoundError extends PteroError {
  constructor(
    public resource: string,
    public resourceId: string | number,
    message?: string
  ) {
    super(
      message || `${resource} with ID ${resourceId} not found`,
      "NOT_FOUND",
      404
    );
  }
}
