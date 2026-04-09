const {
  createNote,
  getAllNotesByUserId,
  getNoteByIdAndUserId,
  updateNoteByIdAndUserId,
  deleteNoteByIdAndUserId,
} = require("../model/noteModel");
const logger = require("../utils/logger");

const createNewNote = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { title, content } = req.body;

    // security: Create notes only for the authenticated user taken from the verified JWT
    // never from client-provided user input.
    const newNote = await createNote(userId, title, content);

    // security: Log security-relevant actions for traceability and incident investigation.
    logger.info("Note created", {
      requestId: req.requestId,
      userId,
      noteId: newNote.id,
    });

    return res.status(201).json({
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

    // security: Fetch only notes that belong to the authenticated user to enforce access control.
    const notes = await getAllNotesByUserId(userId);

    return res.status(200).json({
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

    // security: Scope note lookup by both note id and authenticated user id to prevent IDOR / unauthorized access to another user's note.
    const note = await getNoteByIdAndUserId(noteId, userId);

    if (!note) {
      logger.warn("Note access failed", {
        requestId: req.requestId,
        userId,
        noteId,
        reason: "not_found_or_not_owned",
      });

      return res.status(404).json({
        message: "Note not found",
      });
    }

    return res.status(200).json({
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

    // security: Update is allowed only when the note belongs to the authenticated user.
    const updatedNote = await updateNoteByIdAndUserId(
      noteId,
      userId,
      title,
      content
    );

    if (!updatedNote) {
      logger.warn("Note update failed", {
        requestId: req.requestId,
        userId,
        noteId,
        reason: "not_found_or_not_owned",
      });

      return res.status(404).json({
        message: "Note not found",
      });
    }

    // security: Audit successful update operations for accountability.
    logger.info("Note updated", {
      requestId: req.requestId,
      userId,
      noteId,
    });

    return res.status(200).json({
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

    // security: Delete is allowed only when the note belongs to the authenticated user.
    const deletedNote = await deleteNoteByIdAndUserId(noteId, userId);

    if (!deletedNote) {
      logger.warn("Note deletion failed", {
        requestId: req.requestId,
        userId,
        noteId,
        reason: "not_found_or_not_owned",
      });

      return res.status(404).json({
        message: "Note not found",
      });
    }

    // security: Audit successful delete operations for later review and monitoring.
    logger.info("Note deleted", {
      requestId: req.requestId,
      userId,
      noteId,
    });

    return res.status(200).json({
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