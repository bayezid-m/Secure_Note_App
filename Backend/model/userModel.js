const pool = require("../db");

// security: Query users by email using parameterized SQL to prevent SQL injection.
const findUserByEmail = async (email) => {
  const query = `
    SELECT id, email, password_hash, created_at
    FROM users
    WHERE email = $1
    LIMIT 1
  `;

  const result = await pool.query(query, [email]);
  return result.rows[0];
};

// security: Query users by id using parameterized SQL and only return needed fields.
const findUserById = async (id) => {
  const query = `
    SELECT id, email, created_at
    FROM users
    WHERE id = $1
    LIMIT 1
  `;

  const result = await pool.query(query, [id]);
  return result.rows[0];
};

// security: Create user with parameterized SQL to prevent injection and return only non-sensitive fields to the application layer.
const createUser = async (email, passwordHash) => {
  const query = `
    INSERT INTO users (email, password_hash)
    VALUES ($1, $2)
    RETURNING id, email, created_at
  `;

  const result = await pool.query(query, [email, passwordHash]);
  return result.rows[0];
};

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
};