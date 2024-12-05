// errorHandler.test.ts
import { errorHandler } from "../middlewares/errorHandler";
import { Request, Response, NextFunction } from "express";
import { CustomError } from "../utils/errorUtil"; // Import CustomError

describe("Error Handler", () => {
  it("should handle errors and send response", () => {
    const mockRequest = {} as Request;
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    const mockNext = {} as NextFunction;

    // Create a custom error with status 400
    const error = new CustomError("Test error", 400);

    errorHandler(error, mockRequest, mockResponse, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: 400,
      errorMessage: "Test error",
    });
  });

  it("should default to 500 when no status is set on the error", () => {
    const mockRequest = {} as Request;
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    const mockNext = {} as NextFunction;

    // Create a custom error without a status (defaults to 500)
    const error = new CustomError("Test error without status", 0);

    errorHandler(error, mockRequest, mockResponse, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(500); // Default status
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: 500,
      errorMessage: "Test error without status",
    });
  });
});
