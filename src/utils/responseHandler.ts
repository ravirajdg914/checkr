import { Response } from "express";

export const sendResponse = (
  res: Response,
  statusCode: number,
  message: string,
  data: any = null
) => {
  res.status(statusCode).json({
    status: "success",
    statusCode,
    message,
    data,
  });
};
