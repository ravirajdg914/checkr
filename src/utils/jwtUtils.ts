import jwt from "jsonwebtoken";
import { MESSAGES } from "./constants";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error(MESSAGES.ERROR.JWT_SECRET_UNDEFINED);
}

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

export const generateToken = (user: { id: number; email: string }): string => {
  if (!user?.id || !user?.email) {
    throw new Error(MESSAGES.ERROR.INVALID_CREDENTIALS);
  }

  const payload = {
    id: user.id,
    email: user.email,
  };

  try {
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    return token;
  } catch (error: any) {
    console.log("error", error.message);
    throw new Error(MESSAGES.ERROR.INTERNAL_SERVER_ERROR);
  }
};

export const verifyToken = (
  token: string
): { id: number; email: string } | null => {
  if (!token) {
    console.error(MESSAGES.ERROR.NO_TOKEN_PROVIDED);
    return null;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: number;
      email: string;
    };

    // if (!decoded || typeof decoded !== "object" || !("id" in decoded)) {
    //   //instance of
    //   throw new Error(MESSAGES.ERROR.INVALID_TOKEN_PAYLOAD);
    // }

    return decoded;
  } catch (error) {
    console.error(MESSAGES.ERROR.TOKEN_VERIFICATION_FAILED);
    return null;
  }
};
