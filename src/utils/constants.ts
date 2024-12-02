export const MESSAGES = {
  SUCCESS: {
    USER_SIGNED_UP: "User signed up successfully.",
    USER_SIGNED_IN: "User signed in successfully.",
    LOGOUT_SUCCESS: "Successfully logged out.",
  },
  ERROR: {
    EMAIL_TAKEN: "Email is already taken.",
    INVALID_CREDENTIALS: "Invalid credentials.",
    NO_TOKEN_PROVIDED: "Access Denied: No token provided.",
    INVALID_OR_EXPIRED_TOKEN: "Invalid or expired token.",
    INTERNAL_SERVER_ERROR: "Internal Server Error.",
  },
};

export const STATUS_CODES = {
  SUCCESS: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  INTERNAL_SERVER_ERROR: 500,
};
