import express from "express";
import { signup, signin, logout } from "../controllers/authController";
import { signupValidator, signinValidator } from "../validators/authValidator";
import { verifyToken } from "../middlewares/authMiddleware";
import asyncHandler from "../utils/asyncHandler";

const router = express.Router();

router.post("/signup", signupValidator, asyncHandler(signup));
router.post("/signin", signinValidator, asyncHandler(signin));
router.post("/logout", verifyToken, logout);

export default router;
