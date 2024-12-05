import { verifyToken } from "../middlewares/authMiddleware";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { MESSAGES, STATUS_CODES } from "../utils/constants";

// Mock JWT verification
jest.mock("jsonwebtoken");

jest.spyOn(console, "error").mockImplementation(() => {});
jest.spyOn(console, "log").mockImplementation(() => {});

describe("Auth Middleware", () => {
  it("should allow request when token is valid", () => {
    const token = "validToken";
    const mockRequest = {
      headers: { authorization: `Bearer ${token}` },
    } as Request;
    const mockResponse = {} as Response;
    const mockNext = jest.fn() as NextFunction;

    jwt.verify = jest
      .fn()
      .mockReturnValue({ id: 1, email: "test@example.com" });

    verifyToken(mockRequest, mockResponse, mockNext);

    expect(jwt.verify).toHaveBeenCalledWith(token, expect.anything());
    expect(mockNext).toHaveBeenCalled();
  });

  it("should return 401 when no token is provided", () => {
    const mockRequest = { headers: {} } as Request;
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    const mockNext = jest.fn() as NextFunction;

    verifyToken(mockRequest, mockResponse, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(STATUS_CODES.UNAUTHORIZED);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: MESSAGES.ERROR.NO_TOKEN_PROVIDED,
    });
  });

  it("should return 403 when token is invalid", () => {
    const token = "invalidToken";
    const mockRequest = {
      headers: { authorization: `Bearer ${token}` },
    } as Request;
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    const mockNext = jest.fn() as NextFunction;

    jwt.verify = jest.fn().mockImplementation(() => {
      throw new Error("Invalid token");
    });

    verifyToken(mockRequest, mockResponse, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(STATUS_CODES.FORBIDDEN);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: MESSAGES.ERROR.INVALID_OR_EXPIRED_TOKEN,
    });
  });
});
