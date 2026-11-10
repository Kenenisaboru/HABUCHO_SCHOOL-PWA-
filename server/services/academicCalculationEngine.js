/**
 * Academic Calculation & Ranking Engine
 * -------------------------------------
 * High-performance Ethiopian secondary school academic calculation and ranking engine.
 * STRICTLY NUMERICAL: Pure marks, totals, percentages, pass/fail counts, and tied rankings.
 * NO LETTER GRADES OR GPA.
 */
import pool from "../config/db.js";
import logger from "../utils/logger.js";

/**
 * Recalculate academic summary and ranks for a single student or class/section
 */
export const syncStudentAcademicSummary = async (clientOrPool, studentId, academicYear, semester, assessmentType = "All") => {
  const db = clientOrPool || pool;

  // 1. Fetch user information
  const userRes = await db.query(
    "SELECT id, full_name, student_id, grade_level, section, stream FROM users WHERE id = $1 AND role = 'student'",
    [studentId]
  );
  if (userRes.rows.length === 0) return null;
  const student = userRes.rows[0];

  // 2. Fetch approved/published grades for this student
  let gradeQuery = `
    SELECT score, total_marks, subject
    FROM grades
    WHERE student_id = $1 
      AND academic_year = $2 
      AND semester = $3
      AND submission_status IN ('approved', 'published')
  `;
  const params = [studentId, academicYear, semester];

  if (assessmentType && assessmentType !== "All") {
    params.push(assessmentType);
    gradeQuery += ` AND assessment_type = $4`;
  }

  const { rows: grades } = await db.query(gradeQuery, params);

  if (grades.length === 0) {
    // If no grades, remove or don't calculate
    await db.query(
      `DELETE FROM student_academic_summaries 
       WHERE student_id = $1 AND academic_year = $2 AND semester = $3 AND assessment_type = $4`,
      [studentId, academicYear, semester, assessmentType]
    );
    return null;
  }

  let totalMarksObtained = 0;
  let totalPossibleMarks = 0;
  let subjectsPassed = 0;
  let subjectsFailed = 0;

  for (const g of grades) {
    const score = parseFloat(g.score) || 0;
    const maxMarks = parseFloat(g.total_marks) || 100.0;
    totalMarksObtained += score;
    totalPossibleMarks += maxMarks;

    const percentage = maxMarks > 0 ? (score / maxMarks) * 100 : 0;
    if (percentage >= 50.0) {
      subjectsPassed++;
    } else {
      subjectsFailed++;
    }
  }

  const averagePercentage = totalPossibleMarks > 0
    ? Math.round(((totalMarksObtained / totalPossibleMarks) * 100) * 100) / 100
    : 0;

  // 3. Upsert into student_academic_summaries
  const upsertQuery = `
    INSERT INTO student_academic_summaries (
      student_id, academic_year, semester, assessment_type,
      grade_level, section, stream,
      total_marks_obtained, total_possible_marks, average_percentage,
      subjects_registered, subjects_passed, subjects_failed,
      status, updated_at
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, 'published', CURRENT_TIMESTAMP)
    ON CONFLICT (student_id, academic_year, semester, assessment_type) DO UPDATE
    SET grade_level = EXCLUDED.grade_level,
        section = EXCLUDED.section,
        stream = EXCLUDED.stream,
        total_marks_obtained = EXCLUDED.total_marks_obtained,
        total_possible_marks = EXCLUDED.total_possible_marks,
        average_percentage = EXCLUDED.average_percentage,
        subjects_registered = EXCLUDED.subjects_registered,
        subjects_passed = EXCLUDED.subjects_passed,
        subjects_failed = EXCLUDED.subjects_failed,
        updated_at = CURRENT_TIMESTAMP
    RETURNING *;
  `;

  const summaryRes = await db.query(upsertQuery, [
    student.id,
    academicYear,
    semester,
    assessmentType,
    student.grade_level || "11",
    student.section || "A",
    student.stream || "General",
    totalMarksObtained,
    totalPossibleMarks,
    averagePercentage,
    grades.length,
    subjectsPassed,
    subjectsFailed,
  ]);

  return summaryRes.rows[0];
};

/**
 * Recalculate Class, Grade, and School Rankings
 * Uses standard competition ranking (RANK()) to handle tied scores accurately.
 */
export const recalculateRankings = async (academicYear, semester, assessmentType = "All") => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // 1. Identify all students who have grades in this period and sync summaries
    const studentsRes = await client.query(
      `SELECT DISTINCT student_id 
       FROM grades 
       WHERE academic_year = $1 AND semester = $2 AND submission_status IN ('approved', 'published')`,
      [academicYear, semester]
    );

    for (const row of studentsRes.rows) {
      await syncStudentAcademicSummary(client, row.student_id, academicYear, semester, assessmentType);
    }

    // 2. Perform Tied Multi-Level Ranking via Window Functions
    const rankingUpdateQuery = `
      WITH RankedScores AS (
        SELECT 
          id,
          RANK() OVER (
            PARTITION BY academic_year, semester, assessment_type, grade_level, section 
            ORDER BY average_percentage DESC, total_marks_obtained DESC
          ) AS calculated_class_rank,
          RANK() OVER (
            PARTITION BY academic_year, semester, assessment_type, grade_level 
            ORDER BY average_percentage DESC, total_marks_obtained DESC
          ) AS calculated_grade_rank,
          RANK() OVER (
            PARTITION BY academic_year, semester, assessment_type 
            ORDER BY average_percentage DESC, total_marks_obtained DESC
          ) AS calculated_school_rank
        FROM student_academic_summaries
        WHERE academic_year = $1 AND semester = $2 AND assessment_type = $3
      )
      UPDATE student_academic_summaries s
      SET class_rank = r.calculated_class_rank,
          grade_rank = r.calculated_grade_rank,
          school_rank = r.calculated_school_rank,
          updated_at = CURRENT_TIMESTAMP
      FROM RankedScores r
      WHERE s.id = r.id;
    `;

    await client.query(rankingUpdateQuery, [academicYear, semester, assessmentType]);
    await client.query("COMMIT");
    logger.info(`[RANKING ENGINE] Recalculated rankings for ${academicYear} ${semester} (${assessmentType})`);
    return true;
  } catch (error) {
    await client.query("ROLLBACK");
    logger.error(`[RANKING ENGINE ERROR] Ranking recalculation failed: ${error.message}`);
    throw error;
  } finally {
    client.release();
  }
};

/**
 * Top Scorers by Class (e.g. Grade 10 Section A)
 */
export const getTopScorersByClass = async ({ academic_year, semester, assessment_type = "All", grade_level, section, limit = 10 }) => {
  const query = `
    SELECT 
      s.id AS summary_id,
      s.class_rank,
      s.grade_rank,
      s.total_marks_obtained,
      s.total_possible_marks,
      s.average_percentage,
      s.subjects_registered,
      s.subjects_passed,
      s.subjects_failed,
      u.id AS student_id,
      u.full_name AS student_name,
      u.student_id AS student_code,
      u.profile_picture AS avatar,
      u.grade_level,
      u.section,
      u.stream
    FROM student_academic_summaries s
    JOIN users u ON s.student_id = u.id
    WHERE s.academic_year = $1 
      AND s.semester = $2 
      AND s.assessment_type = $3
      AND s.grade_level = $4
      AND s.section = $5
    ORDER BY s.class_rank ASC, s.average_percentage DESC
    LIMIT $6
  `;
  const { rows } = await pool.query(query, [academic_year, semester, assessment_type, grade_level, section, limit]);
  return rows;
};

/**
 * Top Scorers by Grade (e.g. Grade 9, 10, 11, or 12 across all sections)
 */
export const getTopScorersByGrade = async ({ academic_year, semester, assessment_type = "All", grade_level, limit = 15 }) => {
  const query = `
    SELECT 
      s.id AS summary_id,
      s.class_rank,
      s.grade_rank,
      s.school_rank,
      s.total_marks_obtained,
      s.total_possible_marks,
      s.average_percentage,
      s.subjects_registered,
      s.subjects_passed,
      s.subjects_failed,
      u.id AS student_id,
      u.full_name AS student_name,
      u.student_id AS student_code,
      u.profile_picture AS avatar,
      u.grade_level,
      u.section,
      u.stream
    FROM student_academic_summaries s
    JOIN users u ON s.student_id = u.id
    WHERE s.academic_year = $1 
      AND s.semester = $2 
      AND s.assessment_type = $3
      AND s.grade_level = $4
    ORDER BY s.grade_rank ASC, s.average_percentage DESC
    LIMIT $5
  `;
  const { rows } = await pool.query(query, [academic_year, semester, assessment_type, grade_level, limit]);
  return rows;
};

/**
 * School-Wide Top Scorers (Top 5, 10, 20)
 */
export const getTopScorersSchoolWide = async ({ academic_year, semester, assessment_type = "All", limit = 10 }) => {
  const query = `
    SELECT 
      s.id AS summary_id,
      s.school_rank,
      s.grade_rank,
      s.class_rank,
      s.total_marks_obtained,
      s.total_possible_marks,
      s.average_percentage,
      s.subjects_registered,
      s.subjects_passed,
      s.subjects_failed,
      u.id AS student_id,
      u.full_name AS student_name,
      u.student_id AS student_code,
      u.profile_picture AS avatar,
      u.grade_level,
      u.section,
      u.stream
    FROM student_academic_summaries s
    JOIN users u ON s.student_id = u.id
    WHERE s.academic_year = $1 
      AND s.semester = $2 
      AND s.assessment_type = $3
    ORDER BY s.school_rank ASC, s.average_percentage DESC
    LIMIT $4
  `;
  const { rows } = await pool.query(query, [academic_year, semester, assessment_type, limit]);
  return rows;
};

/**
 * Top Scorers by Individual Subject (e.g. Mathematics, Physics, Biology)
 */
export const getTopScorersBySubject = async ({ academic_year, semester, subject, grade_level = null, limit = 15 }) => {
  let query = `
    WITH SubjectRanks AS (
      SELECT 
        g.id AS grade_id,
        g.score,
        g.total_marks,
        ROUND((g.score / g.total_marks * 100), 2) AS percentage,
        g.assessment_type,
        g.subject,
        u.id AS student_id,
        u.full_name AS student_name,
        u.student_id AS student_code,
        u.profile_picture AS avatar,
        u.grade_level,
        u.section,
        u.stream,
        RANK() OVER (ORDER BY g.score DESC) AS subject_rank
      FROM grades g
      JOIN users u ON g.student_id = u.id
      WHERE g.academic_year = $1 
        AND g.semester = $2 
        AND g.subject = $3
        AND g.submission_status IN ('approved', 'published')
  `;
  const params = [academic_year, semester, subject];
  let paramIndex = 4;

  if (grade_level) {
    query += ` AND g.grade_level = $${paramIndex++}`;
    params.push(grade_level);
  }

  query += `
    )
    SELECT * FROM SubjectRanks
    ORDER BY subject_rank ASC, score DESC
    LIMIT $${paramIndex}
  `;
  params.push(limit);

  const { rows } = await pool.query(query, params);
  return rows;
};

/**
 * School Performance Analytics
 * Overall pass rates, averages, and comparisons across grades/sections
 */
export const getSchoolPerformanceAnalytics = async ({ academic_year = "2024/2025", semester = "Semester 1", assessment_type = "All" }) => {
  // 1. Registered students count
  const regRes = await pool.query("SELECT COUNT(*) FROM users WHERE role = 'student'");
  const totalRegisteredStudents = parseInt(regRes.rows[0].count, 10);

  // 2. Finalized student summaries count & school averages
  const summaryRes = await pool.query(
    `SELECT 
       COUNT(*) AS finalized_students,
       COALESCE(AVG(average_percentage), 0) AS school_average,
       COALESCE(MAX(average_percentage), 0) AS highest_average,
       COALESCE(MIN(average_percentage), 0) AS lowest_average
     FROM student_academic_summaries
     WHERE academic_year = $1 AND semester = $2 AND assessment_type = $3`,
    [academic_year, semester, assessment_type]
  );

  const finalizedStudents = parseInt(summaryRes.rows[0].finalized_students, 10);
  const schoolAverage = parseFloat(parseFloat(summaryRes.rows[0].school_average).toFixed(2));

  // 3. Pass / Fail Rates
  const passFailRes = await pool.query(
    `SELECT 
       COUNT(CASE WHEN average_percentage >= 50.0 THEN 1 END) AS passed_students,
       COUNT(CASE WHEN average_percentage < 50.0 THEN 1 END) AS failed_students
     FROM student_academic_summaries
     WHERE academic_year = $1 AND semester = $2 AND assessment_type = $3`,
    [academic_year, semester, assessment_type]
  );
  const passedStudents = parseInt(passFailRes.rows[0].passed_students, 10);
  const failedStudents = parseInt(passFailRes.rows[0].failed_students, 10);
  const overallPassRate = finalizedStudents > 0 ? parseFloat(((passedStudents / finalizedStudents) * 100).toFixed(1)) : 0;
  const overallFailRate = finalizedStudents > 0 ? parseFloat(((failedStudents / finalizedStudents) * 100).toFixed(1)) : 0;

  // 4. Highest Performing Student
  const topStudentRes = await pool.query(
    `SELECT u.full_name, u.student_id, s.grade_level, s.section, s.average_percentage, s.total_marks_obtained
     FROM student_academic_summaries s
     JOIN users u ON s.student_id = u.id
     WHERE s.academic_year = $1 AND s.semester = $2 AND s.assessment_type = $3
     ORDER BY s.average_percentage DESC, s.total_marks_obtained DESC
     LIMIT 1`,
    [academic_year, semester, assessment_type]
  );

  // 5. Grade Performance Comparison
  const gradePerfRes = await pool.query(
    `SELECT 
       grade_level,
       COUNT(*) as student_count,
       ROUND(AVG(average_percentage), 2) as average_percentage,
       ROUND(AVG(total_marks_obtained), 2) as average_total_marks,
       COUNT(CASE WHEN average_percentage >= 50 THEN 1 END) as passed_count
     FROM student_academic_summaries
     WHERE academic_year = $1 AND semester = $2 AND assessment_type = $3
     GROUP BY grade_level
     ORDER BY grade_level ASC`,
    [academic_year, semester, assessment_type]
  );

  // 6. Section Performance Comparison
  const sectionPerfRes = await pool.query(
    `SELECT 
       grade_level,
       section,
       COUNT(*) as student_count,
       ROUND(AVG(average_percentage), 2) as average_percentage
     FROM student_academic_summaries
     WHERE academic_year = $1 AND semester = $2 AND assessment_type = $3
     GROUP BY grade_level, section
     ORDER BY average_percentage DESC`,
    [academic_year, semester, assessment_type]
  );

  // 7. Subject Performance Comparison (Highest & Lowest Performing Subjects)
  const subjectPerfRes = await pool.query(
    `SELECT 
       subject,
       COUNT(*) as test_count,
       ROUND(AVG((score / total_marks) * 100), 2) as average_score,
       ROUND(MIN(score), 2) as min_score,
       ROUND(MAX(score), 2) as max_score
     FROM grades
     WHERE academic_year = $1 AND semester = $2 AND submission_status IN ('approved', 'published')
     GROUP BY subject
     ORDER BY average_score DESC`,
    [academic_year, semester]
  );

  const subjects = subjectPerfRes.rows;
  const highestSubject = subjects.length > 0 ? subjects[0] : null;
  const lowestSubject = subjects.length > 0 ? subjects[subjects.length - 1] : null;

  return {
    totalRegisteredStudents,
    finalizedStudents,
    schoolAverage,
    passedStudents,
    failedStudents,
    overallPassRate,
    overallFailRate,
    topStudent: topStudentRes.rows[0] || null,
    highestSubject,
    lowestSubject,
    gradePerformance: gradePerfRes.rows,
    sectionPerformance: sectionPerfRes.rows,
    subjectPerformance: subjects,
  };
};

