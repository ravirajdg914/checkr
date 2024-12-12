import Joi from "joi";
import {
  REPORT_VALIDATION_MESSAGES,
  REPORT_VALIDATION_STATUS_CODES,
} from "../utils/reportValidationConstants";

export const createReportValidator = (req: any, res: any, next: any) => {
  const schema = Joi.object({
    status: Joi.string().valid("clear", "consider").required().messages({
      "any.only": REPORT_VALIDATION_MESSAGES.STATUS.INVALID,
      "any.required": REPORT_VALIDATION_MESSAGES.STATUS.REQUIRED,
    }),
    package: Joi.string().required().messages({
      "any.required": REPORT_VALIDATION_MESSAGES.PACKAGE.REQUIRED,
    }),
    adjudication: Joi.string().allow(null).messages({
      "string.base": REPORT_VALIDATION_MESSAGES.ADJUDICATION.STRING,
    }),
    turnaround_time: Joi.number().required().messages({
      "any.required": REPORT_VALIDATION_MESSAGES.TURNAROUND_TIME.REQUIRED,
      "number.base": REPORT_VALIDATION_MESSAGES.TURNAROUND_TIME.INVALID,
    }),
    completed_at: Joi.date().allow(null).messages({
      "date.base": REPORT_VALIDATION_MESSAGES.COMPLETED_AT.INVALID,
    }),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(REPORT_VALIDATION_STATUS_CODES.BAD_REQUEST).json({
      errors: error.details.map((err: any) => err.message),
    });
  }

  next();
};
