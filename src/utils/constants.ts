export const MESSAGES = {
  SUCCESS: {
    USER_SIGNED_UP: "User signed up successfully.",
    USER_SIGNED_IN: "User signed in successfully.",
    LOGOUT_SUCCESS: "Successfully logged out.",
    TOKEN_GENERATED: "Token generated successfully.",
    TOKEN_VALIDATED: "Token validated successfully.",
    DATABASE_CONNECTED: "Database connected successfully.",
    SERVER_RUNNING: (port: any) => `Server running on http://localhost:${port}`,
  },
  ERROR: {
    EMAIL_TAKEN: "Email is already taken.",
    INVALID_CREDENTIALS: "Invalid credentials.",
    NO_TOKEN_PROVIDED: "Access Denied: No token provided.",
    INVALID_OR_EXPIRED_TOKEN: "Invalid or expired token.",
    INTERNAL_SERVER_ERROR: "Internal Server Error.",
    JWT_SECRET_UNDEFINED: "JWT_SECRET is not defined in environment variables.",
    JWT_EXPIRES_IN_UNDEFINED:
      "JWT_EXPIRES_IN is not defined in environment variables.",
    INVALID_TOKEN_PAYLOAD: "Invalid token payload",
    TOKEN_VERIFICATION_FAILED: "Token verification failed.",
    DATABASE_CONNECTION_FAILED: "Unable to connect to the database.",
  },
};

export const STATUS_CODES = {
  SUCCESS: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  INTERNAL_SERVER_ERROR: 500,
  UNPROCESSABLE_ENTITY: 422,
};
