class ResultError extends Error {
  errors: Array<object>;

  constructor(message: string, errors: Array<object>) {
    super(message);

    // assign given errors to class variable.
    this.errors = errors;

    // assign the error class name in your custom error (as a shortcut)
    this.name = this.constructor.name;

    // capturing the stack trace keeps the reference to your error class
    Error.captureStackTrace(this, this.constructor);
  }
}

export default ResultError;
