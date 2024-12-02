export class CustomError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const createCustomError = (
  message: string,
  status: number
): CustomError => {
  return new CustomError(message, status);
};
