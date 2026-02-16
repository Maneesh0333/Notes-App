import authRoutes from "./routes/authRoutes.js";
import cors from "cors";
import NoteRoutes from "./routes/noteRoutes.js";
import express from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { errorHandler } from './Middleware/errorHandler.js'
import { logger } from "./Middleware/logger.js";
import dotenv from 'dotenv';
import { globalLimiter } from "./Middleware/rateLimiter.js";

dotenv.config()

const app = express();

// Middleware
app.use(express.json({limit: '10kb'}));
app.use(
  cors({
    origin: process.env.FRONTEND_URL, 
    credentials: true,         
  })
);
app.use(cookieParser());
app.use(helmet());
app.use(logger);
app.use(globalLimiter);

app.use("/auth", authRoutes);
app.use("/notes", NoteRoutes);

app.use(errorHandler);
export default app;
