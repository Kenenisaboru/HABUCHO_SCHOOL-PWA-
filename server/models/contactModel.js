/**
 * Contact Model
 * -------------
 * Database queries for contact form messages.
 */
import pool from "../config/db.js";

export const getAllMessages = async ({ limit, offset }) => {
  const countResult = await pool.query("SELECT COUNT(*) FROM contact_messages");
  const total = parseInt(countResult.rows[0].count, 10);

  const result = await pool.query(
    "SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT $1 OFFSET $2",
    [limit, offset]
  );
  return { messages: result.rows, total };
};

export const createMessage = async ({ name, email, message }) => {
  const result = await pool.query(
    "INSERT INTO contact_messages (name, email, message) VALUES ($1, $2, $3) RETURNING *",
    [name, email, message]
  );
  return result.rows[0];
};

export const deleteMessage = async (id) => {
  const result = await pool.query("DELETE FROM contact_messages WHERE id = $1 RETURNING id", [id]);
  return result.rows[0];
};
