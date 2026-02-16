import express from "express";
import isAuthenticated from "../Middleware/isAuthenticated.js";
import { validate } from "../Middleware/validate.js";
import {
  csrfHandler,
  forgotPassword,
  getMe,
  loginUser,
  logoutUser,
  refreshTokenHandler,
  registerUser,
  resetPassword,
  verifyOTP,
  verifyUser,
} from "../Controllers/authController.js";
import { csrfProtection } from "../Middleware/csrfProtection.js";
import {loginSchema, registerSchema} from '../Validators/authValidation.js'
import { forgotPasswordLimiter, resetPasswordLimiter, verifyOtpLimiter } from "../Middleware/rateLimiter.js";

const router = express.Router();

router.post("/register", validate(registerSchema), registerUser);
router.post("/login", validate(loginSchema), loginUser);
router.post("/verify", verifyUser);
router.post("/logout", csrfProtection, isAuthenticated, logoutUser);
router.post("/forget-password", forgotPasswordLimiter, forgotPassword);
router.post("/verify-otp/", verifyOtpLimiter, verifyOTP);
router.post("/reset-password", resetPasswordLimiter, resetPassword);
router.post("/refresh-token", csrfProtection, refreshTokenHandler);
router.get("/csrf-token", csrfProtection, csrfHandler);
router.get("/me", isAuthenticated, getMe);

export default router;
