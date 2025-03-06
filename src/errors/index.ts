import { ValidationError } from "./ValidationError.js";
import { PteroError } from "./PteroError.js";
import { NotFoundError } from "./NotFoundError.js";
import { UnauthorizedError } from "./UnauthorizedError.js";
import { RateLimitError } from "./RateLimitError.js";

export * from "./PteroError.js";
export * from "./ValidationError.js";
export * from "./NotFoundError.js";
export * from "./UnauthorizedError.js";
export * from "./RateLimitError.js";

export const handleApiError = (error: any): never => {
  if (!error.response) {
    throw error;
  }

  const { status, data } = error.response;

  switch (status) {
    case 400:
      throw new ValidationError(
        data.message || "Validation failed",
        data.errors?.map((err: any) => ({
          field: err.field || "unknown",
          detail: err.detail || err.message,
        }))
      );
    case 401:
      throw new UnauthorizedError(data.message);
    case 404:
      throw new NotFoundError(
        data.resource || "Resource",
        data.identifier || "unknown"
      );
    case 422:
      throw new ValidationError(
        data.message || "Validation failed",
        data.errors?.map((err: any) => ({
          field: err.field || "unknown",
          detail: err.detail || err.message,
        }))
      );
    case 429:
      throw new RateLimitError(
        parseInt(error.response.headers["retry-after"]) || 60
      );
    default:
      throw new PteroError(
        data.message || "Unknown error occurred",
        "PTERODACTYL_ERROR",
        status
      );
  }
};
