import express from "express";
import {
  verifyUser,
  registerUser,
  loginUser,
  logoutUser,
  forgetPassword,
  verifyOTP,
  changePassword,
} from "../Controllers/userController.js";
import isAuthenticated from "../Middelware/isAuthenticated.js";
import { userSchema, validateUser } from "../Validators/userValidate.js";

const router = express.Router();

router.post("/register", validateUser(userSchema), registerUser);
router.post("/verify", verifyUser);
router.post("/login", loginUser);
router.post("/logout", isAuthenticated, logoutUser);
router.post("/forget-password", forgetPassword);
router.post("/verify-otp/:email", verifyOTP);
router.post("/change-password/:email", changePassword);

export default router;
