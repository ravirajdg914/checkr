import { Request, Response } from "express";
import authService from "../services/authService";

export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await authService.signup(email, password);
    res.status(201).json(user);
  } catch (error: any) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

export const signin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const token = await authService.signin(email, password);
    res.status(200).json(token);
  } catch (error: any) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

export const logout = (req: Request, res: Response) => {
  res.status(200).json({ message: "Successfully logged out" });
};
