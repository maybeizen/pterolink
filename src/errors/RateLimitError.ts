import { PteroError } from "./PteroError.js";

export class RateLimitError extends PteroError {
  constructor(public retryAfter: number) {
    super(
      `Rate limit exceeded. Try again in ${retryAfter} seconds`,
      "RATE_LIMIT",
      429
    );
  }
}
