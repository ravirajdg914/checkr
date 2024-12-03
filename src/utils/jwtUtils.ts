import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";

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
  token: string,
  p0: any,
  p1: jest.Mock<any, any, any>
): { id: number; email: string } | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: number;
      email: string;
    };
    if (!decoded || typeof decoded !== "object" || !("id" in decoded)) {
      throw new Error("Invalid token payload");
    }
    return decoded;
  } catch (error) {
    console.error("Token verification error:", error);
    return null;
  }
};
