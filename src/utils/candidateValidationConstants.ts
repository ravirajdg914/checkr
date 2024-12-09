export const CANDIDATE_VALIDATION_MESSAGES = {
  NAME: {
    REQUIRED: "Name is required.",
  },
  EMAIL: {
    INVALID: "Please provide a valid email address.",
    REQUIRED: "Email is required.",
  },
  DOB: {
    REQUIRED: "Date of birth is required.",
  },
  PHONE: {
    REQUIRED: "Phone number is required.",
  },
  ZIPCODE: {
    REQUIRED: "Zip code is required.",
  },
  SOCIAL_SECURITY: {
    REQUIRED: "Social security number is required.",
  },
  DRIVERS_LICENSE: {
    REQUIRED: "Driver's license is required.",
  },
  ADJUDICATION: {
    STRING: "Adjudication must be a string.",
  },
  STATUS: {
    INVALID: "Status must be either 'clear' or 'consider'.",
    REQUIRED: "Status is required.",
  },
  LOCATION: {
    REQUIRED: "Location is required.",
  },
  DATE: {
    REQUIRED: "Date is required.",
  },
};

export const CANDIDATE_VALIDATION_STATUS_CODES = {
  BAD_REQUEST: 400,
}; 