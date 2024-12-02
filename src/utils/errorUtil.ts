export class CustomError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message); // Call the Error constructor with the message
    this.status = status; // Add the status property
    this.name = this.constructor.name; // Set the name of the error to be the class name
    Error.captureStackTrace(this, this.constructor); // Capture the stack trace
  }
}

// Utility function to generate a CustomError
export const createCustomError = (
  message: string,
  status: number
): CustomError => {
  return new CustomError(message, status);
};
