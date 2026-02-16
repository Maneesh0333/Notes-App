import express from "express";
import {
  createNote,
  deleteNote,
  getNotes,
  getSingleNote,
  updateNote,
} from "../Controllers/noteController.js";
import isAuthenticated from "../Middleware/isAuthenticated.js";
import { sanitizeHtmlMiddleware } from "../Middleware/sanitizeHtmlMiddleware.js";

const router = express.Router();

router.post("/", isAuthenticated, createNote);
router.get("/", isAuthenticated, getNotes);
router.get("/:id", isAuthenticated, getSingleNote);
router.put("/:id", isAuthenticated, sanitizeHtmlMiddleware, updateNote);
router.delete("/:id", isAuthenticated, deleteNote);

export default router;
