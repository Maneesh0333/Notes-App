import rateLimit from "express-rate-limit";

export const globalLimiter  = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP
  message: {
    success: false,
    message: "Too many requests, please try again later."
  },
});

export const forgotPasswordLimiter   = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP
  message: {
    success: false,
    message: "Too many requests, please try again later."
  },
});

export const verifyOtpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP
  message: {
    success: false,
    message: "Too many requests, please try again later."
  },
});

export const resetPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP
  message: {
    success: false,
    message: "Too many requests, please try again later."
  },
});

