import Note from "../models/noteModel.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";

const createNote = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name) {
    throw new AppError("Name field is required", 400);
  }

  const note = await Note.create({
    userId: req.userId,
    name,
    content: "",
  });

  res.status(201).json({
    success: true,
    message: "Note created successfully",
    data: note,
  });
});

const getNotes = asyncHandler(async (req, res) => {
  const notes = await Note.find({ userId: req.userId }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: notes,
  });
});

const getSingleNote = asyncHandler(async (req, res) => {
  const note = await Note.findOne({ _id: req.params.id, userId: req.userId });

  if (!note) {
    throw new AppError("Note not found", 404);
  }

  res.status(200).json({
    success: true,
    data: note,
  });
});

const updateNote = asyncHandler(async (req, res) => {
  const { content } = req.body;

  console.log("-------", content);
  
  const note = await Note.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId },
    { content },
    { new: true },
  );

  if (!note) {
    throw new AppError("Note not found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Note updated successfully",
    data: note,
  });
});

const deleteNote = asyncHandler(async (req, res) => {
  const note = await Note.findOneAndDelete({
    _id: req.params.id,
    userId: req.userId,
  });

  if (!note) {
    throw new AppError("Note not found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Note deleted successfully",
  });
});

export { createNote, getNotes, updateNote, getSingleNote, deleteNote };
