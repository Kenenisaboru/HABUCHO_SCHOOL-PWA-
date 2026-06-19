/**
 * Announcement Model
 * ------------------
 * Database queries for school announcements.
 */
import pool from "../config/db.js";

export const getAllAnnouncements = async ({ limit, offset }) => {
  const countResult = await pool.query("SELECT COUNT(*) FROM announcements");
  const total = parseInt(countResult.rows[0].count, 10);

  const result = await pool.query(
    `SELECT a.*, u.full_name AS author_name
     FROM announcements a
     LEFT JOIN users u ON a.created_by = u.id
     ORDER BY a.created_at DESC
     LIMIT $1 OFFSET $2`,
    [limit, offset]
  );
  return { announcements: result.rows, total };
};

export const getAnnouncementById = async (id) => {
  const result = await pool.query(
    `SELECT a.*, u.full_name AS author_name
     FROM announcements a
     LEFT JOIN users u ON a.created_by = u.id
     WHERE a.id = $1`,
    [id]
  );
  return result.rows[0];
};

export const createAnnouncement = async ({ title, content, created_by }) => {
  const result = await pool.query(
    "INSERT INTO announcements (title, content, created_by) VALUES ($1, $2, $3) RETURNING *",
    [title, content, created_by]
  );
  return result.rows[0];
};

export const updateAnnouncement = async (id, { title, content }) => {
  const result = await pool.query(
    "UPDATE announcements SET title = COALESCE($1, title), content = COALESCE($2, content) WHERE id = $3 RETURNING *",
    [title, content, id]
  );
  return result.rows[0];
};

export const deleteAnnouncement = async (id) => {
  const result = await pool.query("DELETE FROM announcements WHERE id = $1 RETURNING id", [id]);
  return result.rows[0];
};

export const countAnnouncements = async () => {
  const result = await pool.query("SELECT COUNT(*) FROM announcements");
  return parseInt(result.rows[0].count, 10);
};
