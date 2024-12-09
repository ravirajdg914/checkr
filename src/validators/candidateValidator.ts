import Joi from "joi";
import { CANDIDATE_VALIDATION_MESSAGES, CANDIDATE_VALIDATION_STATUS_CODES } from "../utils/candidateValidationConstants";

export const createCandidateValidator = (req: any, res: any, next: any) => {
  const schema = Joi.object({
    name: Joi.string().required().messages({
      "any.required": CANDIDATE_VALIDATION_MESSAGES.NAME.REQUIRED,
    }),
    email: Joi.string().email().required().messages({
      "string.email": CANDIDATE_VALIDATION_MESSAGES.EMAIL.INVALID,
      "any.required": CANDIDATE_VALIDATION_MESSAGES.EMAIL.REQUIRED,
    }),
    dob: Joi.date().required().messages({
      "any.required": CANDIDATE_VALIDATION_MESSAGES.DOB.REQUIRED,
    }),
    phone: Joi.string().required().messages({
      "any.required": CANDIDATE_VALIDATION_MESSAGES.PHONE.REQUIRED,
    }),
    zipcode: Joi.string().required().messages({
      "any.required": CANDIDATE_VALIDATION_MESSAGES.ZIPCODE.REQUIRED,
    }),
    social_security: Joi.string().required().messages({
      "any.required": CANDIDATE_VALIDATION_MESSAGES.SOCIAL_SECURITY.REQUIRED,
    }),
    drivers_license: Joi.string().required().messages({
      "any.required": CANDIDATE_VALIDATION_MESSAGES.DRIVERS_LICENSE.REQUIRED,
    }),
    adjudication: Joi.string().allow(null).messages({
      "string.base": CANDIDATE_VALIDATION_MESSAGES.ADJUDICATION.STRING,
    }),
    status: Joi.string().valid("clear", "consider").required().messages({
      "any.only": CANDIDATE_VALIDATION_MESSAGES.STATUS.INVALID,
      "any.required": CANDIDATE_VALIDATION_MESSAGES.STATUS.REQUIRED,
    }),
    location: Joi.string().required().messages({
      "any.required": CANDIDATE_VALIDATION_MESSAGES.LOCATION.REQUIRED,
    }),
    date: Joi.date().required().messages({
      "any.required": CANDIDATE_VALIDATION_MESSAGES.DATE.REQUIRED,
    }),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(CANDIDATE_VALIDATION_STATUS_CODES.BAD_REQUEST).json({
      error: error.details.map((err: any) => err.message),
    });
  }

  next();
};
