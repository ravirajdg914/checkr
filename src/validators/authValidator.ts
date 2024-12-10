import Joi from "joi";
import { VALIDATION_MESSAGES, VALIDATION_STATUS_CODES } from "../utils/validationConstants";

export const signupValidator = (req: any, res: any, next: any) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      "string.email": VALIDATION_MESSAGES.EMAIL.INVALID,
      "any.required": VALIDATION_MESSAGES.EMAIL.REQUIRED,
    }),
    password: Joi.string().min(8).required().messages({
      "string.min": VALIDATION_MESSAGES.PASSWORD.MIN_LENGTH,
      "any.required": VALIDATION_MESSAGES.PASSWORD.REQUIRED,
    }),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(VALIDATION_STATUS_CODES.BAD_REQUEST).json({
      error: error.details.map((err: any) => err.message),
    });
  }

  next();
};

export const signinValidator = (req: any, res: any, next: any) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      "string.email": VALIDATION_MESSAGES.EMAIL.INVALID,
      "any.required": VALIDATION_MESSAGES.EMAIL.REQUIRED,
    }),
    password: Joi.string().required().messages({
      "any.required": VALIDATION_MESSAGES.PASSWORD.REQUIRED,
    }),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(VALIDATION_STATUS_CODES.BAD_REQUEST).json({
      error: error.details.map((err: any) => err.message),
    });
  }

  next();
};
