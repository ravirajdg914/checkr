import { generateToken, verifyToken } from "../utils/jwtUtils";
import jwt from "jsonwebtoken";
import { MESSAGES } from "../utils/constants";

// Mock the constants file to return custom mock values
jest.mock("../utils/constants", () => ({
  MESSAGES: {
    SUCCESS: { TOKEN_GENERATED: "Token generated successfully." },
    ERROR: {
      INVALID_CREDENTIALS: "Invalid credentials.",
      NO_TOKEN_PROVIDED: "No token provided.",
      INTERNAL_SERVER_ERROR: "Internal server error.",
      TOKEN_VERIFICATION_FAILED: "Token verification failed.",
    },
  },
}));

jest.spyOn(console, "error").mockImplementation(() => {});
jest.spyOn(console, "log").mockImplementation(() => {});

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
  verify: jest.fn(),
}));

describe("Auth Service", () => {
  const mockUser = { id: 1, email: "user@example.com" };
  const mockToken = "mockedToken";

  beforeEach(() => {
    (jwt.sign as jest.Mock).mockReturnValue(mockToken);
    (jwt.verify as jest.Mock).mockReturnValue({
      id: 1,
      email: "user@example.com",
    });
  });

  it("should generate token for valid user", () => {
    const token = generateToken(mockUser);
    expect(token).toBe(mockToken);
  });

  it("should throw error for invalid user object", () => {
    expect(() => generateToken({ id: 1 } as any)).toThrow(
      MESSAGES.ERROR.INVALID_CREDENTIALS
    );
  });

  it("should throw internal error on token generation failure", () => {
    (jwt.sign as jest.Mock).mockImplementationOnce(() => {
      throw new Error();
    });
    expect(() => generateToken(mockUser)).toThrow(
      MESSAGES.ERROR.INTERNAL_SERVER_ERROR
    );
  });

  it("should validate token", () => {
    const decoded = verifyToken(mockToken);
    expect(decoded).toEqual({ id: 1, email: "user@example.com" });
    expect(jwt.verify).toHaveBeenCalledWith(mockToken, process.env.JWT_SECRET);
  });

  it("should return null for invalid token", () => {
    (jwt.verify as jest.Mock).mockImplementationOnce(() => {
      throw new Error();
    });
    expect(verifyToken("invalidToken")).toBeNull();
  });

  it("should handle missing token", () => {
    expect(verifyToken("")).toBeNull();
  });

  it("should return null for invalid token during verification", () => {
    const invalidToken = "invalidToken";
    jest.spyOn(jwt, "verify").mockImplementation(() => {
      throw new Error("Invalid token");
    });

    const result = verifyToken(invalidToken);

    expect(result).toBeNull();
  });

  it("should fail if JWT_SECRET is not defined", () => {
    process.env.JWT_SECRET = ""; // Simulate missing secret
    try {
      generateToken(mockUser);
    } catch (error: any) {
      expect(error.message).toBe(MESSAGES.ERROR.INTERNAL_SERVER_ERROR);
    }
  });

  it("should handle errors in token verification", () => {
    jwt.verify = jest.fn().mockImplementation(() => {
      throw new Error("Token verification failed");
    });

    const result = verifyToken(mockToken);
    expect(result).toBeNull();
  });
});
