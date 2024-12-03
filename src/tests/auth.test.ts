import jwt from "jsonwebtoken";
import {
  generateToken,
  verifyToken,
} from "../../src/middlewares/authMiddleware";
import { Request, Response, NextFunction } from "express";

describe("Auth Utility Functions", () => {
  const mockUser = { id: 1, email: "testuser@example.com" };

  // Mock JWT_SECRET before running tests
  beforeAll(() => {
    process.env.JWT_SECRET = "checkrsecretjwt"; // Mock the environment variable
  });

  afterAll(() => {
    delete process.env.JWT_SECRET; // Clean up after tests
  });

  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("generateToken", () => {
    it("should generate a valid JWT token for a user", () => {
      const token = generateToken(mockUser);

      const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

      expect(decoded).toHaveProperty("id", mockUser.id);
      expect(decoded).toHaveProperty("email", mockUser.email);
    });
  });

  describe("verifyToken Middleware", () => {
    const mockRequest = (): Partial<Request> => ({
      headers: {},
    });

    const mockResponse = (): Partial<Response> => {
      const res: any = {};
      res.status = jest.fn().mockReturnValue(res);
      res.json = jest.fn().mockReturnValue(res);
      res.send = jest.fn().mockReturnValue(res);
      return res;
    };

    const mockNext: NextFunction = jest.fn();

    it("should call next() when a valid token is provided", () => {
      const token = generateToken(mockUser);
      const req = mockRequest() as Request;
      const res = mockResponse() as Response;

      req.headers.authorization = `Bearer ${token}`;

      verifyToken(req, res, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(req.user).toHaveProperty("id", mockUser.id);
    });

    it("should return 401 if no token is provided", () => {
      const req = mockRequest() as Request;
      const res = mockResponse() as Response;

      verifyToken(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: "Access Denied: No token provided",
      });
    });

    it("should return 403 if token is invalid", () => {
      const req = mockRequest() as Request;
      const res = mockResponse() as Response;

      req.headers.authorization = "Bearer invalidtoken";

      verifyToken(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: "Invalid or expired token",
      });
    });

    it("should return 403 if token payload is invalid", () => {
      const invalidToken = jwt.sign({}, process.env.JWT_SECRET as string, {
        expiresIn: "1h",
      });
      const req = mockRequest() as Request;
      const res = mockResponse() as Response;

      req.headers.authorization = `Bearer ${invalidToken}`;

      verifyToken(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: "Invalid or expired token",
      });
    });
  });
});
