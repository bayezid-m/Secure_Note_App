const express = require("express");
const {
  createNewNote,
  getMyNotes,
  getSingleNote,
  updateNote,
  deleteNote,
} = require("../controllers/notesController");
const { protect } = require("../middleWares/authMiddleware");
const {
  validateNoteInput,
  validateNoteIdParam,
} = require("../middleWares/validationMiddleware");

const router = express.Router();

router.use(protect); //protects all routes with JWT middleWare

router.post("/create", validateNoteInput, createNewNote);
router.get("/getAll", getMyNotes);
router.get("/singleNote/:id", validateNoteIdParam, getSingleNote);
router.put("/update/:id", validateNoteIdParam, validateNoteInput, updateNote);
router.delete("/delete/:id", validateNoteIdParam, deleteNote);

module.exports = router;