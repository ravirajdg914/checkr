import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { MESSAGES, STATUS_CODES } from "../utils/constants";
import { verifyToken as jwtVerifyToken } from "../utils/jwtUtils";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error(MESSAGES.ERROR.JWT_SECRET_UNDEFINED);
}

export const tokenMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    res
      .status(STATUS_CODES.UNAUTHORIZED)
      .json({ message: MESSAGES.ERROR.NO_TOKEN_PROVIDED });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwtVerifyToken(token);

    if (!decoded) {
      throw new Error(MESSAGES.ERROR.INVALID_TOKEN_PAYLOAD);
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error(MESSAGES.ERROR.TOKEN_VERIFICATION_FAILED, error);
    res
      .status(STATUS_CODES.FORBIDDEN)
      .json({ message: MESSAGES.ERROR.INVALID_OR_EXPIRED_TOKEN });
  }
};
