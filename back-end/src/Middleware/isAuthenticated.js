import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";

const isAuthenticated = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // 1️⃣ Check Bearer token format
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError("Access token missing or invalid", 401);
  }

  const token = authHeader.split(" ")[1];

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      throw new AppError("Token expired", 401);
    }
    throw new AppError("Invalid token", 401);
  }

  // 2️⃣ Check if user still exists
  const user = await User.findById(decoded.id).select("-password");

  if (!user) {
    throw new AppError("User not found", 404);
  }

  req.userId = user._id;  

  next();
});

export default isAuthenticated;
