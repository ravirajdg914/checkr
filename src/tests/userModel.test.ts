import { DataTypes } from "sequelize";
import User from "../models/userModel";
import sequelize from "../config/database";

// Mock sequelize instance
jest.mock("../config/database", () => ({
  define: jest.fn(),
  authenticate: jest.fn(() => Promise.resolve()),
  sync: jest.fn(() => Promise.resolve()),
}));

describe("User Model", () => {
  test("should create a valid user", async () => {
    const mockUser = {
      id: 1,
      email: "test@example.com",
      password: "hashedPassword",
    };

    // Mock sequelize.define to return a mock model
    const mockDefine = jest.fn().mockReturnValue({
      build: jest.fn().mockReturnValue(mockUser),
    });
    sequelize.define = mockDefine;

    const user = User.build(mockUser);

    expect(user.email).toBe(mockUser.email);
    expect(user.password).toBe(mockUser.password);
    expect(user.id).toBe(mockUser.id);
  });

  test("should throw error if email is invalid", async () => {
    const invalidUser = { email: "invalidEmail", password: "password" };

    try {
      await User.create(invalidUser);
    } catch (error: any) {
      expect(error).toBeDefined();
      expect(error.name).toBe("SequelizeValidationError");
    }
  });
});
