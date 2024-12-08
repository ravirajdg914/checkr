import Joi from "joi";
import { STATUS_CODES } from "../utils/constants";

export const createCandidateValidator = (req: any, res: any, next: any) => {
  const schema = Joi.object({
    name: Joi.string().required().messages({
      "any.required": "Name is required.",
    }),
    email: Joi.string().email().required().messages({
      "string.email": "Please provide a valid email address.",
      "any.required": "Email is required.",
    }),
    dob: Joi.date().required().messages({
      "any.required": "Date of birth is required.",
    }),
    phone: Joi.string().required().messages({
      "any.required": "Phone number is required.",
    }),
    zipcode: Joi.string().required().messages({
      "any.required": "Zip code is required.",
    }),
    social_security: Joi.string().required().messages({
      "any.required": "Social security number is required.",
    }),
    drivers_license: Joi.string().required().messages({
      "any.required": "Driver's license is required.",
    }),
    adjudication: Joi.string().allow(null).messages({
      "string.base": "Adjudication must be a string.",
    }),
    status: Joi.string().valid("clear", "consider").required().messages({
      "any.only": "Status must be either 'clear' or 'consider'.",
      "any.required": "Status is required.",
    }),
    location: Joi.string().required().messages({
      "any.required": "Location is required.",
    }),
    date: Joi.date().required().messages({
      "any.required": "Date is required.",
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
