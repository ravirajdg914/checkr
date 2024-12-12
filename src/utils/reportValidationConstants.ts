export const REPORT_VALIDATION_MESSAGES = {
  STATUS: {
    INVALID: "Status must be either 'clear' or 'consider'.",
    REQUIRED: "Status is required.",
  },
  PACKAGE: {
    REQUIRED: "Package is required.",
  },
  ADJUDICATION: {
    STRING: "Adjudication must be a string.",
    REQUIRED: "Adjudication is required.",
  },
  TURNAROUND_TIME: {
    REQUIRED: "Turnaround time is required.",
    INVALID: "Turnaround time must be a positive number.",
  },
  COMPLETED_AT: {
    REQUIRED: "Completion date is required.",
    INVALID: "Completion date must be a valid date.",
  },
  CANDIDATE_ID: {
    REQUIRED: "Candidate ID is required.",
    INVALID: "Candidate ID must be a valid number.",
  },
  REPORT: {
    NOT_FOUND: "Report not found.",
    DELETED_SUCCESS: "Report deleted successfully.",
  },
};

export const REPORT_VALIDATION_STATUS_CODES = {
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  CREATED: 201,
  SUCCESS: 200,
  INTERNAL_SERVER_ERROR: 500,
};
