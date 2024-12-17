export const MESSAGES = {
  SUCCESS: {
    USER_SIGNED_UP: "User signed up successfully.",
    USER_SIGNED_IN: "User signed in successfully.",
    LOGOUT_SUCCESS: "Successfully logged out.",
    TOKEN_GENERATED: "Token generated successfully.",
    TOKEN_VALIDATED: "Token validated successfully.",
    DATABASE_CONNECTED: "Database connected successfully.",
    SERVER_RUNNING: (port: any) => `Server running on http://localhost:${port}`,
    CANDIDATE_UPDATED: "Candidate updated successfully.",
    CANDIDATE_DELETED: "Candidate deleted successfully.",
    PRE_ADVERSE_ACTION_UPDATED: "Adjudication updated successfully",
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
    CANDIDATE_NOT_FOUND: "Candidate not found.",
    UPDATE_CANDIDATE_FAILED: "Error updating candidate.",
    DELETE_CANDIDATE_FAILED: "Error deleting candidate.",
    FETCH_CANDIDATES_FAILED: "Error fetching candidates.",
    REPORT_NOT_FOUND: "Report not found.",
    REPORT_ALREADY_EXISTS: "Report already exists for this candidate.",
    COURT_SEARCH_NOT_FOUND: "Court search not found.",
    NAME_NOT_FOUND: "Candidate name not found",
    PRE_ADVERSE_ACTION_NOT_FOUND: "Pre adverse action not found",
    INVALID_CHARGES: "Invalid charges provided",
    PAGE_OUT_OF_RANGE: (page: number, totalPages: number) =>
      `Page ${page} is out of range. Total pages: ${totalPages}`,
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
  NOT_FOUND: 404,
};

export const CANDIDATE_ATTRIBUTES = [
  "name",
  "adjudication",
  "status",
  "location",
  "date",
];

export const REPORT_ATTRIBUTES = [
  "status",
  "package",
  "adjudication",
  "turnaround_time",
  "completed_at",
];

export const COURT_SEARCH_ATTRIBUTES = ["status", "search_type", "date"];
