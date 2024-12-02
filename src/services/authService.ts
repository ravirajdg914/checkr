import bcrypt from "bcryptjs";
import User from "../models/userModel";
import { generateToken } from "../utils/jwtUtils";
import { MESSAGES } from "../utils/constants";
import { createCustomError } from "../utils/errorUtil";

class AuthService {
  async signup(email: string, password: string) {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      // Use the createCustomError function to throw the error
      throw createCustomError(MESSAGES.ERROR.EMAIL_TAKEN, 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword });
    return {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async signin(email: string, password: string) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw createCustomError(MESSAGES.ERROR.INVALID_CREDENTIALS, 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw createCustomError(MESSAGES.ERROR.INVALID_CREDENTIALS, 401);
    }

    const token = generateToken({ id: user.id, email: user.email });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }
}

export default new AuthService();
