import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET ?? "checkrsecretjwt";
const JWT_EXPIRES_IN = "1d";

export const generateToken = (user: { id: number; email: string }): string => {
  if (!user?.id || !user?.email) {
    throw new Error("User object must have `id` and `email` properties.");
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
    res.status(401).json({ message: "Access Denied: No token provided" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET ?? "checkrsecretjwt"
    );

    if (!decoded || typeof decoded !== "object" || !("id" in decoded)) {
      throw new Error("Invalid token payload");
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(403).json({ message: "Invalid or expired token" });
  }
};
