class Error extends Error {
  constructor(message) {
    super(message);
    this.name = "Error";
  }
}

export default Error;
