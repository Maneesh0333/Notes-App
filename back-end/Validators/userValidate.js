import * as yup from "yup";

const userSchema = yup.object({
  username: yup.string().trim().min(3).required("Username is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6).required("Password is required"),
});

const validateUser = (schema) => async (req, res, next) => {
  try {
    await schema.validate(req.body);
    next();
  } catch (err) {
    return res.status(400).json({
      error: err.errors,
    });
  }
};

export { validateUser, userSchema };
