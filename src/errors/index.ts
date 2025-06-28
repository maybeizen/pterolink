import { AxiosError } from "axios";
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

export const handleApiError = (
  error: unknown,
  context?: {
    resource?: string;
    identifier?: string | number;
    context?: string;
  }
): never => {
  if (!(error instanceof AxiosError)) {
    throw new PteroError(
      `A network error occurred while ${context?.context || "making request"}`,
      "NETWORK_ERROR",
      500
    );
  }

  if (!error.response) {
    throw new PteroError(
      `No response received from server while ${
        context?.context || "making request"
      }`,
      "NO_RESPONSE",
      500
    );
  }

  const { status, data } = error.response;

  switch (status) {
    case 400:
      throw new ValidationError(
        data.message || "Invalid request",
        data.errors?.map((err: any) => ({
          field: err.field || "unknown",
          detail: err.detail || err.message || "Validation failed",
        }))
      );

    case 401:
      throw new UnauthorizedError(data.message || "Authentication failed");

    case 403:
      throw new UnauthorizedError(
        data.message || "You do not have permission to perform this action"
      );

    case 404:
      throw new NotFoundError(
        context?.resource || "Resource",
        context?.identifier || "unknown",
        `${context?.resource || "Resource"} with ID ${
          context?.identifier
        } not found${context?.context ? ` while ${context.context}` : ""}`
      );

    case 422:
      throw new ValidationError(
        data.message || "Validation failed",
        data.errors?.map((err: any) => ({
          field: err.field || "unknown",
          detail: err.detail || err.message || "Invalid data provided",
        }))
      );

    case 429:
      throw new RateLimitError(
        parseInt(error.response.headers["retry-after"]) || 60
      );

    case 500:
      throw new PteroError(
        data.message || "Internal server error",
        "SERVER_ERROR",
        500
      );

    default:
      throw new PteroError(
        data.message || `Unknown error occurred (${status})`,
        "UNKNOWN_ERROR",
        status,
        undefined,
        error.response
      );
  }
};
