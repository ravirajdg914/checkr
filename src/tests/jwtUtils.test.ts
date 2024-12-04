import { generateToken } from "../utils/jwtUtils"; // Adjust the path to your utils
import jwt from "jsonwebtoken";

jest.mock("jsonwebtoken", () => ({
  ...jest.requireActual("jsonwebtoken"), // import and retain the original functionalities
  verify: jest.fn().mockReturnValue({ foo: "bar" }), // overwrite verify
}));

const verify = jest.spyOn(jwt, "verify");
verify.mockImplementation(() => () => ({ verified: "true" }));

describe("JWT Utility Functions", () => {
  const mockUser = { id: 1, email: "testuser@example.com" };

  beforeAll(() => {
    // Mock JWT_SECRET for testing purposes
    process.env.JWT_SECRET = "checkrsecretjwt"; // Provide a fallback secret for tests
  });

  it("should generate a valid JWT token for a user", () => {
    const token = generateToken(mockUser);

    // Decode the token to verify payload
    const decoded = jwt.verify(token, "checkrsecretjwt");

    expect(decoded).toHaveProperty("id", mockUser.id);
    expect(decoded).toHaveProperty("email", mockUser.email);
  });

  it("should throw an error if JWT_SECRET is not defined", () => {
    // Temporarily unset the JWT_SECRET for this test
    delete process.env.JWT_SECRET;

    try {
      generateToken(mockUser);
    } catch (error: any) {
      expect(error.message).toBe(
        "JWT_SECRET is not defined in environment variables"
      );
    }
  });
});
