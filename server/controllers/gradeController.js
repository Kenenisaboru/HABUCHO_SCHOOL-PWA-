/**
 * Grade Controller
 * ----------------
 * Teachers manage grades; students view only their own.
 */
import * as GradeModel from "../models/gradeModel.js";
import { sendSuccess, sendError, getPagination } from "../utils/response.js";

export const getGrades = async (req, res, next) => {
  try {
    const pagination = getPagination(req.query.page, req.query.limit);
    const filters = { ...pagination };

    // Students can only see their own grades
    if (req.user.role === "student") {
      filters.student_id = req.user.id;
    } else if (req.user.role === "teacher") {
      filters.teacher_id = req.user.id;
    }

    if (req.query.student_id && req.user.role !== "student") {
      filters.student_id = req.query.student_id;
    }
    
    // Add new filters
    if (req.query.academic_year) filters.academic_year = req.query.academic_year;
    if (req.query.grade_level) filters.grade_level = req.query.grade_level;
    if (req.query.section) filters.section = req.query.section;
    if (req.query.subject) filters.subject = req.query.subject;
    if (req.query.assessment_type) filters.assessment_type = req.query.assessment_type;
    if (req.query.semester) filters.semester = req.query.semester;

    const { grades, total } = await GradeModel.getAllGrades(filters);

    return sendSuccess(res, {
      grades,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages: Math.ceil(total / pagination.limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createGrade = async (req, res, next) => {
  try {
    const { student_id, subject, score, semester } = req.body;

    if (!student_id || !subject || score === undefined || !semester) {
      return sendError(res, "All grade fields are required");
    }

    if (score < 0 || score > 100) {
      return sendError(res, "Score must be between 0 and 100");
    }

    const grade = await GradeModel.createGrade({
      student_id,
      teacher_id: req.user.id,
      subject,
      score,
      semester,
    });

    return sendSuccess(res, grade, "Grade created", 201);
  } catch (error) {
    next(error);
  }
};

export const updateGrade = async (req, res, next) => {
  try {
    const grade = await GradeModel.updateGrade(req.params.id, req.body);
    if (!grade) return sendError(res, "Grade not found", 404);
    return sendSuccess(res, grade, "Grade updated");
  } catch (error) {
    next(error);
  }
};

export const deleteGrade = async (req, res, next) => {
  try {
    const grade = await GradeModel.deleteGrade(req.params.id);
    if (!grade) return sendError(res, "Grade not found", 404);
    return sendSuccess(res, null, "Grade deleted");
  } catch (error) {
    next(error);
  }
};

export const bulkUpsert = async (req, res, next) => {
  try {
    const { grades } = req.body;
    
    if (!grades || !Array.isArray(grades) || grades.length === 0) {
      return sendError(res, "Invalid grades data provided");
    }

    // Force the teacher_id to be the currently logged-in teacher
    const gradesWithTeacherId = grades.map(g => ({
      ...g,
      teacher_id: req.user.id
    }));

    await GradeModel.bulkUpsertGrades(gradesWithTeacherId);
    
    return sendSuccess(res, null, "Scores saved successfully");
  } catch (error) {
    next(error);
  }
};
