class RecordNotFound extends Error {
  constructor(record_name: string) {
    super(`${record_name} not found`);

    // assign the error class name in your custom error (as a shortcut)
    this.name = this.constructor.name;

    // capturing the stack trace keeps the reference to your error class
    Error.captureStackTrace(this, this.constructor);
  }
}

export default RecordNotFound;
