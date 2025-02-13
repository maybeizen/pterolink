export { default as PteroError } from "./PteroError.js";
export { default as ValidationError } from "./ValidationError.js";
export { default as UnauthorizedError } from "./UnauthorizedError.js";
export { default as NotFoundError } from "./NotFoundError.js";
export { default as RateLimitError } from "./RateLimitError.js";

export const handleApiError = (error) => {
  if (!error.response) {
    throw error;
  }

  const { status, data } = error.response;

  switch (status) {
    case 401:
      throw new UnauthorizedError(data.message);
    case 404:
      throw new NotFoundError(
        data.resource || "Resource",
        data.identifier || "unknown"
      );
    case 422:
      throw new ValidationError(data.message, data.errors || []);
    case 429:
      throw new RateLimitError(error.response.headers["retry-after"]);
    default:
      throw new PteroError(data.message || "Unknown error occurred");
  }
};
