/**
 * User Model
 * ----------
 * Database queries for user CRUD operations.
 */
import pool from "../config/db.js";

export const findUserByEmail = async (email) => {
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  return result.rows[0];
};

export const findUserById = async (id) => {
  const result = await pool.query(
    "SELECT id, full_name, email, role, profile_picture, created_at FROM users WHERE id = $1",
    [id]
  );
  return result.rows[0];
};

export const createUser = async ({ full_name, email, password, role }) => {
  const result = await pool.query(
    "INSERT INTO users (full_name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, full_name, email, role, created_at",
    [full_name, email, password, role]
  );
  return result.rows[0];
};

export const getAllUsers = async ({ search, role, limit, offset }) => {
  let query = "SELECT id, full_name, email, role, profile_picture, created_at FROM users WHERE 1=1";
  const params = [];
  let paramIndex = 1;

  if (search) {
    query += ` AND (full_name ILIKE $${paramIndex} OR email ILIKE $${paramIndex})`;
    params.push(`%${search}%`);
    paramIndex++;
  }

  if (role) {
    query += ` AND role = $${paramIndex}`;
    params.push(role);
    paramIndex++;
  }

  // Count total for pagination
  const countResult = await pool.query(
    query.replace("SELECT id, full_name, email, role, profile_picture, created_at", "SELECT COUNT(*)"),
    params
  );
  const total = parseInt(countResult.rows[0].count, 10);

  query += ` ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
  params.push(limit, offset);

  const result = await pool.query(query, params);
  return { users: result.rows, total };
};

export const updateUser = async (id, { full_name, email, role, password, profile_picture }) => {
  const fields = [];
  const params = [];
  let paramIndex = 1;

  if (full_name) { fields.push(`full_name = $${paramIndex++}`); params.push(full_name); }
  if (email) { fields.push(`email = $${paramIndex++}`); params.push(email); }
  if (role) { fields.push(`role = $${paramIndex++}`); params.push(role); }
  if (password) { fields.push(`password = $${paramIndex++}`); params.push(password); }
  if (profile_picture) { fields.push(`profile_picture = $${paramIndex++}`); params.push(profile_picture); }

  if (fields.length === 0) return null;

  params.push(id);
  const result = await pool.query(
    `UPDATE users SET ${fields.join(", ")} WHERE id = $${paramIndex} RETURNING id, full_name, email, role, profile_picture, created_at`,
    params
  );
  return result.rows[0];
};

export const deleteUser = async (id) => {
  const result = await pool.query("DELETE FROM users WHERE id = $1 RETURNING id", [id]);
  return result.rows[0];
};

export const countUsersByRole = async (role) => {
  const result = await pool.query("SELECT COUNT(*) FROM users WHERE role = $1", [role]);
  return parseInt(result.rows[0].count, 10);
};
