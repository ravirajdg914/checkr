import { signupValidator, signinValidator } from "../validators/authValidator";
import { VALIDATION_MESSAGES, VALIDATION_STATUS_CODES } from "../utils/validationConstants";

describe("Auth Validators", () => {
  let mockRequest: any;
  let mockResponse: any;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockNext = jest.fn();
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe("signupValidator", () => {
    it("should call next if validation passes", () => {
      mockRequest = {
        body: {
          email: "valid@example.com",
          password: "validPassword123",
        },
      };

      signupValidator(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it("should return 400 if email is invalid", () => {
      mockRequest = {
        body: {
          email: "invalid-email",
          password: "validPassword123",
        },
      };

      signupValidator(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(VALIDATION_STATUS_CODES.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: [VALIDATION_MESSAGES.EMAIL.INVALID],
      });
    });

    it("should return 400 if password is too short", () => {
      mockRequest = {
        body: {
          email: "valid@example.com",
          password: "short",
        },
      };

      signupValidator(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(VALIDATION_STATUS_CODES.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: [VALIDATION_MESSAGES.PASSWORD.MIN_LENGTH],
      });
    });

    it("should return 400 if email is missing", () => {
      mockRequest = {
        body: {
          password: "validPassword123",
        },
      };

      signupValidator(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(VALIDATION_STATUS_CODES.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: [VALIDATION_MESSAGES.EMAIL.REQUIRED],
      });
    });

    it("should return 400 if password is missing", () => {
      mockRequest = {
        body: {
          email: "valid@example.com",
        },
      };

      signupValidator(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(VALIDATION_STATUS_CODES.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: [VALIDATION_MESSAGES.PASSWORD.REQUIRED],
      });
    });
  });

  describe("signinValidator", () => {
    it("should call next if validation passes", () => {
      mockRequest = {
        body: {
          email: "valid@example.com",
          password: "validPassword123",
        },
      };

      signinValidator(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it("should return 400 if email is invalid", () => {
      mockRequest = {
        body: {
          email: "invalid-email",
          password: "validPassword123",
        },
      };

      signinValidator(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(VALIDATION_STATUS_CODES.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: [VALIDATION_MESSAGES.EMAIL.INVALID],
      });
    });

    it("should return 400 if email is missing", () => {
      mockRequest = {
        body: {
          password: "validPassword123",
        },
      };

      signinValidator(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(VALIDATION_STATUS_CODES.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: [VALIDATION_MESSAGES.EMAIL.REQUIRED],
      });
    });

    it("should return 400 if password is missing", () => {
      mockRequest = {
        body: {
          email: "valid@example.com",
        },
      };

      signinValidator(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(VALIDATION_STATUS_CODES.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: [VALIDATION_MESSAGES.PASSWORD.REQUIRED],
      });
    });
  });
}); 