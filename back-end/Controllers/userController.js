import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import verifyMail from "../EmailVerify/verifyMail.js";
import Session from "../models/sessionModel.js";
import sendOTP from "../EmailVerify/sendOTP.js";

const registerUser = async (req, res) => {
  try {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
      return res.status(400).json({
        success: false,
        message: "All fields are required!...",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists...",
      });
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create new User
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // create token
    const token = await jwt.sign(
      { id: newUser._id, username: newUser.username },
      process.env.SECRET_KEY,
      { expiresIn: "10m" }
    );

    verifyMail(token, email);

    newUser.token = token;
    await newUser.save();

    return res.status(201).json({
      success: true,
      message: "User created successfully...",
      data: newUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const verifyUser = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(400).json({
        success: false,
        message: "Authorization token is invalid or missing...",
      });
    }

    const token = authHeader.split(" ")[1];

    let decoded;

    try {
      decoded = jwt.verify(token, process.env.SECRET_KEY);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(400).json({
          success: false,
          message: "The registration token has expired...",
        });
      }

      return res.status(400).json({
        success: false,
        message: "Token verification failed",
      });
    }

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.token = null;
    user.isVerified = true;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Email verified successfully..",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check not empty
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required...",
      });
    }

    // Check user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User Does not exists",
      });
    }

    const passwordCheck = await bcrypt.compare(password, user.password);
    if (!passwordCheck) {
      return res.status(402).json({
        success: false,
        message: "Invalid password",
      });
    }

    // Check if user is verified
    if (user.isVerified !== true) {
      return res.status(403).json({
        success: false,
        message: "Verify your email and login",
      });
    }

    // check for existing session and delete it
    const existingSession = await Session.findOne({ userId: user._id });
    if (existingSession) {
      await Session.deleteOne({ userId: user._id });
    }

    // create a new session
    await Session.create({ userId: user._id });

    // generate token
    const accessToken = await jwt.sign(
      { id: user._id },
      process.env.SECRET_KEY,
      { expiresIn: "10d" }
    );
    const refreshToken = await jwt.sign(
      { id: user._id },
      process.env.SECRET_KEY,
      { expiresIn: "30d" }
    );

    user.isLoggedIn = true;

    await user.save();

    return res.status(200).json({
      success: true,
      message: `Welcome back ${user.username}`,
      userdata: {
        accessToken,
        refreshToken,
        user,
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const logoutUser = async (req, res) => {
  try {
    const userId = req.userId;

    // Delete session
    await Session.deleteMany({ userId });

    // Update user status
    await User.findByIdAndUpdate(userId, { isLoggedIn: false });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully...",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(402).json({
        success: false,
        message: "Email field is required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found..",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = otp;
    user.otpExpiry = otpExpiry;

    await user.save();
    await sendOTP(email, otp);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully..",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { otp } = req.body;
    const { email } = req.params;

    console.log("OTP: ", otp);
    console.log("Email: ", email);

    if (!otp) {
      return res.status(400).json({
        success: false,
        message: "OTP id required..",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found..",
      });
    }

    if (!user.otp || !user.otpExpiry) {
      return res.status(401).json({
        success: false,
        message: "OTP is not generated or Already verified..",
      });
    }

    if (user.otpExpiry < Date.now()) {
      return res.status(401).json({
        success: false,
        message: "OTP has expired..",
      });
    }

    if (user.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP..",
      });
    }

    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "OTP Verifird successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const changePassword = async (req, res) => {
  const { newPassword, confirmPassword } = req.body;
  const { email } = req.params;

  if (!newPassword || !confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "Password do not match",
    });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found..",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully..",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export {
  registerUser,
  verifyUser,
  loginUser,
  logoutUser,
  forgetPassword,
  verifyOTP,
  changePassword,
};
