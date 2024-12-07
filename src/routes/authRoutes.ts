import express from "express";
import { signup, signin, logout } from "../controllers/authController";
import { signupValidator, signinValidator } from "../validators/authValidator";
import { tokenMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/signup", signupValidator, signup);
router.post("/signin", signinValidator, signin);
router.post("/logout", tokenMiddleware, logout);

export default router;
