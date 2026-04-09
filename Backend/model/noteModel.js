const pool = require("../db");

// security: Use parameterized SQL queries to prevent SQL injection and always associate the new note with the authenticated user's id.
const createNote = async (userId, title, content) => {
  const query = `
    INSERT INTO notes (user_id, title, content)
    VALUES ($1, $2, $3)
    RETURNING id, user_id, title, content, created_at, updated_at
  `;

  const result = await pool.query(query, [userId, title, content]);
  return result.rows[0];
};

// security: Fetch only notes that belong to the authenticated user to enforce access control and prevent unauthorized data exposure.
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

// security: Scope note lookup by both note id and user id to prevent IDOR / unauthorized access to another user's note.
const getNoteByIdAndUserId = async (noteId, userId) => {
  const query = `
    SELECT id, user_id, title, content, created_at, updated_at
    FROM notes
    WHERE id = $1 AND user_id = $2
    LIMIT 1
  `;

  const result = await pool.query(query, [noteId, userId]);
  return result.rows[0];
};

// security: Update only the authenticated user's own note by requiring both note id and user id in the WHERE clause.
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

// security: Delete only the authenticated user's own note by requiring both note id and user id in the WHERE clause.
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