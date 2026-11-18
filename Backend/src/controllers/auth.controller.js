import userModel from "./../models/user.model.js";
import jwt from "jsonwebtoken";
import redis from "../config/cache.js";
import { sendEmail } from "../services/mail.service.js";
import {
  createVerificationEmail,
  createWelcomeEmail,
} from "../templates/welcome-email.template.js";

const isProduction = process.env.NODE_ENV === "production";
const authCookieOptions = {
  httpOnly: true,
  sameSite: isProduction ? "none" : "lax",
  secure: isProduction,
};

function createEmailVerificationUrl(email) {
  const token = jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  const verificationUrl = new URL(
    "/api/auth/verify-email",
    process.env.BACKEND_URL,
  );
  verificationUrl.searchParams.set("token", token);
  return verificationUrl.href;
}

/**
 * @desc    Registers a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export async function register(req, res) {
  const { fullName, email, password } = req.body;

  const isUserAlreadyExists = await userModel.findOne({ email });

  if (isUserAlreadyExists) {
    return res.status(400).json({
      message: "User already exists with this email",
      success: false,
      err: "User already exists",
    });
  }

  const user = await userModel.create({ fullName, email, password });

  const welcomeEmail = createWelcomeEmail(
    fullName,
    createEmailVerificationUrl(user.email),
  );

  let emailSent = true;
  try {
    await sendEmail({
      to: email,
      ...welcomeEmail,
    });
  } catch (error) {
    emailSent = false;
    console.error("Verification email could not be sent", error);
  }

  return res.status(201).json({
    message: emailSent
      ? "User created successfully"
      : "Your account was created, but the verification email could not be sent. Please try resending it.",
    success: true,
    emailSent,
    user: {
      email: user.email,
      fullname: user.fullName,
      id: user._id,
      verified: user.verified,
      createdAt: user.createdAt,
    },
  });
}

/**
 * @desc    Login a existing user
 * @route   Post /api/auth/login
 * @access  Public
 */
export async function login(req, res) {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email }).select("+password");

  if (!user) {
    return res.status(400).json({
      message: "User doesn't exist",
      succcess: false,
      err: "Cannot find user with this email",
    });
  }

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    return res.status(400).json({
      message: "Invalid email or password",
      success: false,
      err: "Incorrect Password",
    });
  }

  if (!user.verified) {
    return res.status(401).json({
      message: "Please verify your email before logging in",
      success: false,
      err: "Email is not verified",
    });
  }

  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );

  res.cookie("token", token, {
    ...authCookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    message: "User logged in successfully",
    success: true,
    user: {
      id: user._id,
      fullname: user.fullName,
      email: user.email,
    },
  });
}

/**
 * @desc    Gets the details of current logged in user
 * @route   GET /api/auth/get-me
 * @access  Private
 */

export async function getMe(req, res) {
  const userId = req.user.id;

  const user = await userModel.findById(userId);

  if (!user) {
    return res.status(404).json({
      message: "User not found",
      success: false,
      err: "User not found",
    });
  }

  res.status(200).json({
    message: "User details found successfully",
    success: true,
    user,
  });
}

/**
 * @desc    Logouts the current user and balcklists token
 * @route   GET /api/auth/logout
 * @access  Private
 */
export async function logout(req, res) {
  const token = req.cookies.token;
  await redis.set(token, Date.now().toString(), "EX", 60 * 60 * 24 * 7);
  res.clearCookie("token", authCookieOptions);

  res.status(200).json({
    message: "Logged out successfully",
  });
}

/**
 * @desc    Verifies user's email
 * @route   GET /api/auth/verify-email
 * @access  Public
 */
export async function verifyEmail(req, res) {
  const { token } = req.query;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findOne({ email: decoded.email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid Token!",
        success: false,
        err: "user not found",
      });
    }

    user.verified = true;

    await user.save();

    const confirmationUrl = new URL(
      "/email-verified",
      process.env.FRONTEND_URL,
    );
    return res.redirect(303, confirmationUrl.href);
  } catch (err) {
    return res.status(400).json({
      message: "Invalid or expired token",
      success: false,
      err: err.message,
    });
  }
}

/**
 * @desc    Sends a fresh email verification link when appropriate
 * @route   POST /api/auth/resend-verification
 * @access  Public
 */
export async function resendVerificationEmail(req, res) {
  const email = req.body.email.trim().toLowerCase();
  const user = await userModel.findOne({ email });

  if (user && !user.verified) {
    const verificationEmail = createVerificationEmail(
      user.fullName,
      createEmailVerificationUrl(user.email),
    );

    await sendEmail({
      to: user.email,
      ...verificationEmail,
    });
  }

  return res.status(200).json({
    success: true,
    message:
      "If that address has an unverified account, a fresh verification link is on its way.",
  });
}
