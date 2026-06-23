import pool from "../config/db.js";

/**
 * @desc    Get public statistics for landing page
 * @route   GET /api/public/stats
 * @access  Public
 */
export const getPublicStats = async (req, res, next) => {
  try {
    const studentQuery = await pool.query("SELECT COUNT(*) FROM users WHERE role = 'student'");
    const teacherQuery = await pool.query("SELECT COUNT(*) FROM users WHERE role = 'teacher'");

    const students = parseInt(studentQuery.rows[0].count, 10);
    const teachers = parseInt(teacherQuery.rows[0].count, 10);

    res.json({
      success: true,
      data: {
        students: `${students}+`,
        teachers: `${teachers}+`,
        passRate: "95%", // Mock data as there's no overall pass rate table yet
        years: `${new Date().getFullYear() - 1995}+`, // Calculate years since founded
      },
    });
  } catch (err) {
    next(err);
  }
};
