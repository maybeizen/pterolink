class PteroError extends Error {
  constructor(message, code = "PTERODACTYL_ERROR") {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
  }
}

export default PteroError;
