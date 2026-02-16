import * as yup from "yup";

export const registerSchema = yup
  .object({
    username: yup
      .string()
      .trim()
      .min(3, "Username must be at least 3 characters")
      .required("Username is required"),

    email: yup
      .string()
      .email("Invalid email format")
      .lowercase()
      .required("Email is required"),

    password: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .matches(/[A-Za-z]/, "Password must contain at least one letter")
      .matches(/[0-9]/, "Password must contain at least one number")
      .required("Password is required"),
  })
  .noUnknown(true, "Unknown fields are not allowed");

export const loginSchema = yup
  .object({
    email: yup
      .string()
      .required("Email is required")
      .email("Invalid email format")
      .lowercase(),
    password: yup
      .string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters")
      .matches(/[A-Za-z]/, "Password must contain at least one letter")
      .matches(/[0-9]/, "Password must contain at least one number")
  })
  .noUnknown(true, "Unknown fields are not allowed");
