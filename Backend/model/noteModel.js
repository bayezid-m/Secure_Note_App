const pool = require("../db");

const createNote = async (userId, title, content) => {
  const query = `
    INSERT INTO notes (user_id, title, content)
    VALUES ($1, $2, $3)
    RETURNING id, user_id, title, content, created_at, updated_at
  `;
  const result = await pool.query(query, [userId, title, content]);
  return result.rows[0];
};

const getAllNotesByUserId = async (userId) => {
  const query = `
    SELECT id, user_id, title, content, created_at, updated_at
    FROM notes
    WHERE user_id = $1
    ORDER BY created_at DESC
  `;
  const result = await pool.query(query, [userId]);
  return result.rows;
};

const getNoteByIdAndUserId = async (noteId, userId) => {
  const query = `
    SELECT id, user_id, title, content, created_at, updated_at
    FROM notes
    WHERE id = $1 AND user_id = $2
  `;
  const result = await pool.query(query, [noteId, userId]);
  return result.rows[0];
};

const updateNoteByIdAndUserId = async (noteId, userId, title, content) => {
  const query = `
    UPDATE notes
    SET title = $1,
        content = $2,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $3 AND user_id = $4
    RETURNING id, user_id, title, content, created_at, updated_at
  `;
  const result = await pool.query(query, [title, content, noteId, userId]);
  return result.rows[0];
};

const deleteNoteByIdAndUserId = async (noteId, userId) => {
  const query = `
    DELETE FROM notes
    WHERE id = $1 AND user_id = $2
    RETURNING id
  `;
  const result = await pool.query(query, [noteId, userId]);
  return result.rows[0];
};

module.exports = {
  createNote,
  getAllNotesByUserId,
  getNoteByIdAndUserId,
  updateNoteByIdAndUserId,
  deleteNoteByIdAndUserId,
};