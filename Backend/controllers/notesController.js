const {
  createNote,
  getAllNotesByUserId,
  getNoteByIdAndUserId,
  updateNoteByIdAndUserId,
  deleteNoteByIdAndUserId,
} = require("../model/noteModel");

const createNewNote = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { title, content } = req.body;

    const newNote = await createNote(userId, title, content);

    console.log(`Note created by user ${userId}, note id ${newNote.id}`);

    res.status(201).json({
      message: "Note created successfully",
      note: newNote,
    });
  } catch (error) {
    next(error);
  }
};

const getMyNotes = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const notes = await getAllNotesByUserId(userId);

    res.status(200).json({
      message: "Notes fetched successfully",
      notes,
    });
  } catch (error) {
    next(error);
  }
};

const getSingleNote = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const noteId = req.params.id;

    const note = await getNoteByIdAndUserId(noteId, userId);

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    res.status(200).json({
      message: "Note fetched successfully",
      note,
    });
  } catch (error) {
    next(error);
  }
};

const updateNote = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const noteId = req.params.id;
    const { title, content } = req.body;

    const updatedNote = await updateNoteByIdAndUserId(
      noteId,
      userId,
      title,
      content
    );

    if (!updatedNote) {
      return res.status(404).json({
        message: "Note not found or not authorized",
      });
    }

    console.log(`Note updated by user ${userId}, note id ${noteId}`);

    res.status(200).json({
      message: "Note updated successfully",
      note: updatedNote,
    });
  } catch (error) {
    next(error);
  }
};

const deleteNote = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const noteId = req.params.id;

    const deletedNote = await deleteNoteByIdAndUserId(noteId, userId);

    if (!deletedNote) {
      return res.status(404).json({
        message: "Note not found or not authorized",
      });
    }

    console.log(`Note deleted by user ${userId}, note id ${noteId}`);

    res.status(200).json({
      message: "Note deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createNewNote,
  getMyNotes,
  getSingleNote,
  updateNote,
  deleteNote,
};