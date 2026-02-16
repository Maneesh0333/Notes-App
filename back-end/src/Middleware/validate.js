import { asyncHandler } from "../utils/asyncHandler.js";

export const validate = (schema) =>
  asyncHandler(async (req, res, next) => {
    const validatedData = await schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true, 
    });

    req.body = validatedData; 
    next();
  });
