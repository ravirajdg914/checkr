import { Request, Response } from "express";
import authService from "../services/authService";
import { sendResponse } from "../utils/responseHandler";
import { MESSAGES, STATUS_CODES } from "../utils/constants";

export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await authService.signup(email, password);
    sendResponse(
      res,
      STATUS_CODES.CREATED,
      MESSAGES.SUCCESS.USER_SIGNED_UP,
      user
    );
  } catch (error: any) {
    res
      .status(error.status || STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

export const signin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const token = await authService.signin(email, password);
    sendResponse(
      res,
      STATUS_CODES.SUCCESS,
      MESSAGES.SUCCESS.USER_SIGNED_IN,
      token
    );
  } catch (error: any) {
    res
      .status(error.status || STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

export const logout = (req: Request, res: Response) => {
  sendResponse(res, STATUS_CODES.SUCCESS, MESSAGES.SUCCESS.LOGOUT_SUCCESS);
};
