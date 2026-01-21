import Note from "../models/noteModel.js";

const createNote = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Name field is required" });
    }

    const note = await Note.create({
      userId: req.userId,
      name,
      content: "",
    });
    res.status(201).json({
      success: true,
      message: "Note created successfully",
      note,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.userId }).sort({
      createdAt: -1,
    });
    res.status(200).json({ success: true, data: notes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getSingleNote = async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, userId: req.userId });
    if (!note)
      return res
        .status(404)
        .json({ success: false, message: "Note not found" });
    res.status(200).json({ success: true, note });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateNote = async (req, res) => {
  try {
    const { content } = req.body;
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { content },
      { new: true }
    );
    if (!note)
      return res.status(404).json({ success: false, message: "Note not found" });
    res.status(200).json({ success: true, message: "Note saved" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteNote = async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Note deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export { createNote, getNotes, updateNote, getSingleNote, deleteNote };
