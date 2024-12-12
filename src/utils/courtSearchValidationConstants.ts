export const COURT_SEARCH_VALIDATION_MESSAGES = {
  STATUS: {
    INVALID: "Status must be either 'clear' or 'consider'.",
    REQUIRED: "Status is required.",
  },
  SEARCH_TYPE: {
    REQUIRED: "Search type is required.",
  },
  DATE: {
    REQUIRED: "Date is required.",
    INVALID: "Date must be a valid date.",
  },
};

export const COURT_SEARCH_VALIDATION_STATUS_CODES = {
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  CREATED: 201,
  SUCCESS: 200,
  INTERNAL_SERVER_ERROR: 500,
}; 