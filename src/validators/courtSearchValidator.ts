import Joi from "joi";
import { COURT_SEARCH_VALIDATION_MESSAGES, COURT_SEARCH_VALIDATION_STATUS_CODES } from "../utils/courtSearchValidationConstants";

export const createCourtSearchValidator = (req: any, res: any, next: any) => {
  const schema = Joi.object({
    status: Joi.string().valid("clear", "consider").required().messages({
      "any.only": COURT_SEARCH_VALIDATION_MESSAGES.STATUS.INVALID,
      "any.required": COURT_SEARCH_VALIDATION_MESSAGES.STATUS.REQUIRED,
    }),
    search_type: Joi.string().required().messages({
      "any.required": COURT_SEARCH_VALIDATION_MESSAGES.SEARCH_TYPE.REQUIRED,
    }),
    date: Joi.date().required().messages({
      "any.required": COURT_SEARCH_VALIDATION_MESSAGES.DATE.REQUIRED,
      "date.base": COURT_SEARCH_VALIDATION_MESSAGES.DATE.INVALID,
    }),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(COURT_SEARCH_VALIDATION_STATUS_CODES.BAD_REQUEST).json({
      error: error.details.map((err: any) => err.message),
    });
  }

  next();
}; 