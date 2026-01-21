import express from "express";
import { createNote, deleteNote, getNotes, getSingleNote, updateNote,  } from "../Controllers/noteController.js";
import isAuthenticated from "../Middelware/isAuthenticated.js";

const router = express.Router();

router.post("/create", isAuthenticated, createNote);
router.get("/all", isAuthenticated, getNotes);
router.get("/:id", isAuthenticated, getSingleNote);
router.put("/:id", isAuthenticated, updateNote);
router.delete("/:id", isAuthenticated, deleteNote);


export default router;
