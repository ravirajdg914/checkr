import { Request, Response } from "express";
import authService from "../services/authService";
import { sendResponse } from "../utils/responseHandler";
import { MESSAGES, STATUS_CODES } from "../utils/constants";
import asyncHandler from "../utils/asyncHandler";

export const signup = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await authService.signup(email, password);
  sendResponse(
    res,
    STATUS_CODES.CREATED,
    MESSAGES.SUCCESS.USER_SIGNED_UP,
    user
  );
});

export const signin = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const token = await authService.signin(email, password);
  sendResponse(
    res,
    STATUS_CODES.SUCCESS,
    MESSAGES.SUCCESS.USER_SIGNED_IN,
    token
  );
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  sendResponse(res, STATUS_CODES.SUCCESS, MESSAGES.SUCCESS.LOGOUT_SUCCESS);
});
