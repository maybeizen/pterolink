import PteroError from "./PteroError.js";

class NotFoundError extends PteroError {
  constructor(resource, id) {
    super(`${resource} with ID ${id} not found`, "NOT_FOUND");
    this.resource = resource;
    this.resourceId = id;
  }
}

export default NotFoundError;
