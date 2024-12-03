import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { MESSAGES, STATUS_CODES } from "../utils/constants";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error(MESSAGES.ERROR.JWT_SECRET_UNDEFINED);
}

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

export const generateToken = (user: { id: number; email: string }): string => {
  if (!user?.id || !user?.email) {
    throw new Error(MESSAGES.ERROR.INVALID_TOKEN_PAYLOAD);
  }

  const payload = {
    id: user.id,
    email: user.email,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

  return token;
};

export const verifyToken = (
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
    const decoded = jwt.verify(token, JWT_SECRET);

    if (!decoded || typeof decoded !== "object" || !("id" in decoded)) {
      throw new Error(MESSAGES.ERROR.INVALID_TOKEN_PAYLOAD);
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    res
      .status(STATUS_CODES.FORBIDDEN)
      .json({ message: MESSAGES.ERROR.INVALID_OR_EXPIRED_TOKEN });
  }
};
