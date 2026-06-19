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
