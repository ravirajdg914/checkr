import bcrypt from "bcryptjs";
import User from "../models/userModel";
import { generateToken } from "../utils/jwtUtils";
import { MESSAGES } from "../utils/constants";

class AuthService {
  async signup(email: string, password: string) {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw { status: 400, message: MESSAGES.ERROR.EMAIL_TAKEN };
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
    if (!user)
      throw { status: 401, message: MESSAGES.ERROR.INVALID_CREDENTIALS };

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      throw { status: 401, message: MESSAGES.ERROR.INVALID_CREDENTIALS };

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
