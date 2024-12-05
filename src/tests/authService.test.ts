import authService from "../services/authService";
import User from "../models/userModel";
import bcrypt from "bcryptjs";
import { createCustomError } from "../utils/errorUtil";
import { MESSAGES } from "../utils/constants";
import jwt from "jsonwebtoken";

jest.mock("jsonwebtoken", () => ({
  ...jest.requireActual("jsonwebtoken"), // import and retain the original functionalities
  verify: jest.fn().mockReturnValue({ foo: "bar" }), // overwrite verify
}));

const verify = jest.spyOn(jwt, "verify");
verify.mockImplementation(() => () => ({ verified: "true" }));

// Mocking Sequelize Model Methods
jest.mock("../models/userModel", () => ({
  findOne: jest.fn(),
  create: jest.fn(),
}));

jest.mock("bcryptjs", () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe("AuthService", () => {
  const mockUser = {
    id: 1,
    email: "testuser@example.com",
    password: "hashedPassword",
  };

  describe("signup", () => {
    it("should throw error if email is already taken", async () => {
      // Mock `findOne` to simulate an existing user
      (User.findOne as jest.Mock).mockResolvedValueOnce(mockUser); // Casting to `jest.Mock` for TypeScript

      try {
        await authService.signup(mockUser.email, "password123");
      } catch (error) {
        expect(error).toEqual(
          createCustomError(MESSAGES.ERROR.EMAIL_TAKEN, 400)
        );
      }
    });

    it("should successfully sign up a new user", async () => {
      // Mock `findOne` to simulate no existing user
      (User.findOne as jest.Mock).mockResolvedValueOnce(null); // No existing user
      (User.create as jest.Mock).mockResolvedValueOnce(mockUser); // Mock `create` to return a new user

      (bcrypt.hash as jest.Mock).mockResolvedValueOnce("hashedPassword"); // Mock password hashing

      const result = await authService.signup(mockUser.email, "password123");

      expect(result.email).toBe(mockUser.email);
      expect(result.id).toBe(mockUser.id);
    });

    it("should throw error if findOne fails", async () => {
      (User.findOne as jest.Mock).mockRejectedValueOnce(new Error("DB error")); // Simulate DB error

      try {
        await authService.signup(mockUser.email, "password123");
      } catch (error: any) {
        expect(error.message).toBe("DB error"); // Ensure the error message matches
      }
    });
  });

  describe("signin", () => {
    it("should throw error if credentials are invalid", async () => {
      // Mock `findOne` to simulate user not found
      (User.findOne as jest.Mock).mockResolvedValueOnce(null); // No user found with email

      try {
        await authService.signin(mockUser.email, "password123");
      } catch (error) {
        expect(error).toEqual(
          createCustomError(MESSAGES.ERROR.INVALID_CREDENTIALS, 401)
        );
      }
    });

    it("should successfully sign in a user", async () => {
      // Mock `findOne` to simulate user found
      (User.findOne as jest.Mock).mockResolvedValueOnce(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true); // Mock correct password comparison

      const result = await authService.signin(mockUser.email, "password123");

      expect(result.token).toBeDefined(); // Token should be defined
      expect(result.user.email).toBe(mockUser.email); // User email should match
    });
  });
});
