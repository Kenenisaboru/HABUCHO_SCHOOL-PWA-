/**
 * Public Stats Model
 * ------------------
 * Queries for public-facing statistics.
 */
import pool from "../config/db.js";

export const getStudentCount = async () => {
  const { rows } = await pool.query("SELECT COUNT(*) FROM users WHERE role = 'student'");
  return parseInt(rows[0].count, 10);
};

export const getTeacherCount = async () => {
  const { rows } = await pool.query("SELECT COUNT(*) FROM users WHERE role = 'teacher'");
  return parseInt(rows[0].count, 10);
};

export const getActivePrograms = async () => {
  const { rows } = await pool.query(
    "SELECT * FROM academic_programs WHERE is_active = TRUE ORDER BY display_order, id"
  );
  return rows;
};

export const getGalleryImages = async () => {
  const { rows } = await pool.query(
    "SELECT * FROM gallery_images ORDER BY display_order, id"
  );
  return rows;
};

export const getPublishedEvents = async () => {
  const { rows } = await pool.query(
    "SELECT * FROM events WHERE status = 'published' ORDER BY event_date DESC, id"
  );
  return rows;
};
