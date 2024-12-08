import Joi from "joi";
import { STATUS_CODES } from "../utils/constants";

export const signupValidator = (req: any, res: any, next: any) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      "string.email": "Please provide a valid email address.",
      "any.required": "Email is required.",
    }),
    password: Joi.string().min(8).required().messages({
      "string.min": "Password must be at least 8 characters long.",
      "any.required": "Password is required.",
    }),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(STATUS_CODES.BAD_REQUEST).json({
      error: error.details.map((err: any) => err.message),
    });
  }

  next();
};

export const signinValidator = (req: any, res: any, next: any) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      "string.email": "Please provide a valid email address.",
      "any.required": "Email is required.",
    }),
    password: Joi.string().required().messages({
      "any.required": "Password is required.",
    }),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({
      error: error.details.map((err: any) => err.message),
    });
  }

  next();
};
