import PteroError from "./PteroError.js";

class RateLimitError extends PteroError {
  constructor(retryAfter) {
    super("Rate limit exceeded", "RATE_LIMIT");
    this.retryAfter = retryAfter;
  }
}

export default RateLimitError;
