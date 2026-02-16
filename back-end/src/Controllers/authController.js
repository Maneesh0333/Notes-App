import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import verifyMail from "../EmailVerify/verifyMail.js";
import Session from "../models/sessionModel.js";
import sendOTP from "../EmailVerify/sendOTP.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import crypto from "crypto";

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError("Email already registered", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  // Create verification token
  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  await User.create({
    username,
    email,
    password: hashedPassword,
    emailVerifyToken: hashedToken,
    emailVerifyExpires: Date.now() + 10 * 60 * 1000,
  });

  const verifyUrl = `${process.env.FRONTEND_URL}/verify/${rawToken}`;

  await verifyMail(email, verifyUrl);

  res.status(201).json({
    success: true,
    message: "Registration successful. Please verify your email.",
  });
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check if user exists
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  // Check if email verified
  if (!user.isVerified) {
    // Create verification token
    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    user.emailVerifyToken = hashedToken;
    user.emailVerifyExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    const verifyUrl = `${process.env.FRONTEND_URL}/verify/${rawToken}`;
    await verifyMail(email, verifyUrl);
    throw new AppError("Please verify your email first", 403);
  }

  // Check if account is locked
  if (user.lockUntil && user.lockUntil > Date.now()) {
    throw new AppError(
      "Account locked due to too many failed login attempts. Try again later.",
      423,
    );
  }

  // Compare password
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    user.loginAttempts += 1;

    if (user.loginAttempts >= process.env.MAX_LOGIN_ATTEMPTS) {
      user.lockUntil = new Date(Date.now() + process.env.LOCK_TIME);
      user.loginAttempts = 0;
    }

    await user.save();
    throw new AppError("Invalid email or password", 401);
  }

  // Correct password → reset counters
  user.loginAttempts = 0;
  user.lockUntil = undefined;
  await user.save();

  // Create tokens
  const accessToken = jwt.sign(
    { id: user._id },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" },
  );

  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" },
  );

  const hashedRefreshToken = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  // Store refresh token in DB (one session per login)
  await Session.create({
    userId: user._id,
    refreshToken: hashedRefreshToken,
  });

  // Send refresh token as HTTP-only cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  // Send access token in response body
  res.status(200).json({
    success: true,
    message: `Welcome back ${user.username}`,
    data: {
      accessToken,
    },
  });
});

const logoutUser = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (refreshToken) {
    await Session.deleteOne({ refreshToken });
  }

  res.clearCookie("refreshToken", {
    httpOnly: true,
    sameSite: "Lax",
    secure: process.env.NODE_ENV === "production",
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

const verifyUser = asyncHandler(async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError("Invalid verification request", 400);
  }

  const rawToken = authHeader.split(" ")[1];

  const hashedToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  const user = await User.findOne({
    emailVerifyToken: hashedToken,
    emailVerifyExpires: { $gt: Date.now() },
  });

  if (!user) throw new AppError("Invalid or expired verification link", 400);

  user.isVerified = true;
  user.emailVerifyToken = undefined;
  user.emailVerifyExpires = undefined;
  await user.save();

  res.status(200).json({ success: true, message: "Email verified" });
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) throw new AppError("Email is required", 400);

  const user = await User.findOne({ email });

  // Prevent enumeration
  if (!user) {
    return res.status(200).json({
      success: true,
      message: "If this email exists, an OTP has been sent",
    });
  }

  // Cooldown
  if (user.otpExpiry && user.otpExpiry > Date.now()) {
    return res.status(429).json({
      success: false,
      message: "Please wait before requesting another OTP",
    });
  }

  const otp = crypto.randomInt(100000, 999999).toString(); // 8 digits
  const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

  user.otp = otpHash;
  user.otpExpiry = Date.now() + 10 * 60 * 1000;
  user.otpAttempts = 0;

  await user.save();

  try {
    await sendOTP(email, otp);
  } catch {
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();
    throw new AppError("Failed to send OTP", 500);
  }

  res.status(200).json({
    success: true,
    message: "If this email exists, an OTP has been sent",
  });
});

const verifyOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) throw new AppError("Invalid or expired OTP", 400);

  const user = await User.findOne({ email });
  if (!user || !user.otp || user.otpExpiry < Date.now()) {
    throw new AppError("Invalid or expired OTP", 400);
  }

  if (user.otpAttempts >= 5) {
    throw new AppError("Too many attempts. Request a new OTP.", 429);
  }

  const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

  const isMatch = crypto.timingSafeEqual(
    Buffer.from(user.otp, "hex"),
    Buffer.from(hashedOtp, "hex"),
  );

  if (!isMatch) {
    user.otpAttempts += 1;
    await user.save();
    throw new AppError("Invalid or expired OTP", 400);
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetTokenHash = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.passwordResetToken = resetTokenHash;
  user.passwordResetExpiry = Date.now() + 15 * 60 * 1000;

  // Cleanup OTP
  user.otp = undefined;
  user.otpExpiry = undefined;
  user.otpAttempts = 0;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Otp verified",
    resetToken, 
  });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword, confirmPassword } = req.body;

  console.log("token", token)
  console.log("newPassword", newPassword)
  console.log("confirmPassword", confirmPassword)
  
  if (!token || !newPassword || !confirmPassword) {
    throw new AppError("All fields are required", 400);
  }

  if (newPassword !== confirmPassword) {
    throw new AppError("Passwords do not match", 400);
  }

  if (newPassword.length < 6) {
    throw new AppError("Password must be at least 6 characters", 400);
  }

  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    passwordResetToken: tokenHash,
    passwordResetExpiry: { $gt: Date.now() },
  });

  if (!user) {
    throw new AppError("Invalid or expired reset token", 400);
  }

  user.password = await bcrypt.hash(newPassword, 12);
  user.passwordResetToken = undefined;
  user.passwordResetExpiry = undefined;

  await user.save();

  // Invalidate all sessions
  await Session.deleteMany({ userId: user._id });

  res.status(200).json({
    success: true,
    message: "Password reset successful",
  });
});

const refreshTokenHandler = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) throw new AppError("Unauthorized", 401);

  let decoded;

  // 1️⃣ Verify token signature & expiry
  try {
    decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  } catch (err) {
    throw new AppError("Invalid or expired refresh token", 401);
  }

  // 2️⃣ Check if token exists in DB
  const hashedToken = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  const session = await Session.findOne({ refreshToken: hashedToken });

  // 🚨 Token reuse detection
  if (!session) {
    // Delete all sessions for that user
    await Session.deleteMany({ userId: decoded.id });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "Strict",
      secure: process.env.NODE_ENV === "production",
    });

    throw new AppError("Session reuse detected. Please login again.", 401);
  }

  await Session.deleteOne({ refreshToken: hashedToken });

  // 3️⃣ Generate new tokens
  const newAccessToken = jwt.sign(
    { id: decoded.id },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" },
  );

  const newRefreshToken = jwt.sign(
    { id: decoded.id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" },
  );

  const hashedRefreshToken = crypto
    .createHash("sha256")
    .update(newRefreshToken)
    .digest("hex");

  // create a new session
  await Session.create({
    userId: decoded.id,
    refreshToken: hashedRefreshToken,
  });

  // 5️⃣ Send new refresh token cookie
  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  // 6️⃣ Send new access token
  res.status(200).json({
    success: true,
    accessToken: newAccessToken,
  });
});

const csrfHandler = (req, res) => {
  res.status(200).json({
    csrfToken: req.csrfToken(),
  });
};

const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.userId).select(
    "_id username email role isVerified",
  );

  if (!user) {
    throw new AppError("User not found", 404);
  }

  res.status(200).json({
    success: true,
    user,
  });
});

export {
  registerUser,
  verifyUser,
  loginUser,
  logoutUser,
  forgotPassword,
  verifyOTP,
  resetPassword,
  refreshTokenHandler,
  csrfHandler,
  getMe,
};
