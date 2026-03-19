const pool = require("../db");

const findUserByEmail = async (email) => {
  const query = `
    SELECT id, email, password_hash, created_at
    FROM users
    WHERE email = $1
  `;
  const result = await pool.query(query, [email]);
  return result.rows[0];
};

const findUserById = async (id) => {
  const query = `
    SELECT id, email, created_at
    FROM users
    WHERE id = $1
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

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