import express from 'express';
import dotenv from 'dotenv';
import connectDB from './Database/db.js';
import UserRoute from './routes/userRoutes.js';
import cors from 'cors';
import NoteRoute from "./routes/noteRoutes.js";

dotenv.config();
const PORT = process.env.PORT || 5000;

const app = express();

// ✅ Middleware to parse JSON body
app.use(express.json());
app.use(cors());

app.use("/api/auth", UserRoute);
app.use("/api/notes", NoteRoute);


app.listen(PORT,()=>{
  connectDB();
  console.log(`Serveris running on PORT ${PORT}`);
})