import { Router } from "express";
import {
  register,
  login,
  getMe,
  logout,
  verifyEmail,
  resendVerificationEmail,
} from "../controllers/auth.controller.js";
import {
  loginValidation,
  registerValidation,
  resendVerificationValidation,
} from "../validators/auth.validator.js";
import { identifyUser } from "../middlewares/auth.middleware.js";

const authRouter = Router();

/**
 * @route   POST /api/auth/register
 * @desc    Registers a user in the database
 * @access  Public
 */

authRouter.post("/register", registerValidation, register);

/**
 * @route   POST /api/auth/login
 * @desc    Login user and return JWT token
 * @access  Public
 */

authRouter.post("/login", loginValidation, login);

/**
 * @route   GET /api/auth/get-me
 * @desc    get current logged in user's details
 * @access  Private
 */

authRouter.get("/get-me", identifyUser, getMe);

/**
 * @route   GET /api/auth/logut
 * @desc    Logouts current user
 * @access  Private
 */
authRouter.get("/logout", identifyUser, logout);

/**
 * @route   GET /api/auth/verify-email
 * @desc    Verify's User Email
 * @access  Public
 * @query   {token}
 */
authRouter.get("/verify-email", verifyEmail);

/**
 * @route   POST /api/auth/resend-verification
 * @desc    Resends an email verification link
 * @access  Public
 */
authRouter.post(
  "/resend-verification",
  resendVerificationValidation,
  resendVerificationEmail,
);

export default authRouter;
