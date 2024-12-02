import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel";

class AuthService {
  async signup(email: string, password: string) {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw { status: 400, message: "Email is already taken" };
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
    if (!user) throw { status: 401, message: "Invalid credentials" };

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw { status: 401, message: "Invalid credentials" };

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET ?? "secret",
      { expiresIn: "1h" }
    );
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
