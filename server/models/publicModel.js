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
