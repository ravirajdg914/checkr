import { Request, Response, NextFunction } from "express";
import { MESSAGES, STATUS_CODES } from "../utils/constants";

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const statusCode = err.status || STATUS_CODES.INTERNAL_SERVER_ERROR;
  const message = err.message || MESSAGES.ERROR.INTERNAL_SERVER_ERROR;
  res.status(statusCode).json({ statusCode, errorMessage: message });
};
