/**
 * Input Validation Middleware
 * --------------------------
 * Reusable validation rules using express-validator.
 * Validates and sanitizes user inputs before they reach controllers.
 */
import { body, validationResult } from "express-validator";
import { sendError } from "../utils/response.js";

/**
 * Middleware to check validation results and return errors if any.
 */
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((e) => e.msg);
    return sendError(res, messages.join(". "), 422);
  }
  next();
};

/** Validation rules for user registration */
export const validateRegister = [
  body("full_name")
    .trim()
    .notEmpty().withMessage("Full name is required")
    .isLength({ min: 2, max: 100 }).withMessage("Full name must be 2–100 characters"),
  body("email")
    .trim()
    .isEmail().withMessage("Invalid email format")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
    .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
    .matches(/[0-9]/).withMessage("Password must contain at least one number"),
  handleValidationErrors,
];

/** Validation rules for login */
export const validateLogin = [
  body("email")
    .trim()
    .isEmail().withMessage("Invalid email format")
    .normalizeEmail(),
  body("password")
    .notEmpty().withMessage("Password is required"),
  handleValidationErrors,
];

/** Validation rules for creating a user (admin) */
export const validateCreateUser = [
  body("full_name")
    .trim()
    .notEmpty().withMessage("Full name is required")
    .isLength({ min: 2, max: 100 }).withMessage("Full name must be 2–100 characters"),
  body("email")
    .trim()
    .isEmail().withMessage("Invalid email format")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
  body("role")
    .isIn(["admin", "teacher", "student"]).withMessage("Role must be admin, teacher, or student"),
  handleValidationErrors,
];

/** Validation rules for updating a user (admin) — all fields optional */
export const validateUpdateUser = [
  body("full_name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage("Full name must be 2–100 characters"),
  body("email")
    .optional()
    .trim()
    .isEmail().withMessage("Invalid email format")
    .normalizeEmail(),
  body("password")
    .optional()
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
  body("role")
    .optional()
    .isIn(["admin", "teacher", "student"]).withMessage("Role must be admin, teacher, or student"),
  handleValidationErrors,
];

/** Validation rules for creating an announcement */
export const validateAnnouncement = [
  body("title")
    .trim()
    .notEmpty().withMessage("Title is required")
    .isLength({ max: 200 }).withMessage("Title must not exceed 200 characters"),
  body("content")
    .trim()
    .notEmpty().withMessage("Content is required")
    .isLength({ max: 10000 }).withMessage("Content must not exceed 10000 characters"),
  handleValidationErrors,
];

/** Validation rules for updating an announcement */
export const validateUpdateAnnouncement = [
  body("title")
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage("Title must not exceed 200 characters"),
  body("content")
    .optional()
    .trim()
    .isLength({ max: 10000 }).withMessage("Content must not exceed 10000 characters"),
  handleValidationErrors,
];

/** Validation rules for creating a grade */
export const validateGrade = [
  body("student_id")
    .isInt({ min: 1 }).withMessage("Valid student ID is required"),
  body("subject")
    .trim()
    .notEmpty().withMessage("Subject is required"),
  body("score")
    .isFloat({ min: 0 }).withMessage("Score must be a non-negative number"),
  body("semester")
    .trim()
    .notEmpty().withMessage("Semester is required"),
  handleValidationErrors,
];

/** Validation rules for updating a grade */
export const validateUpdateGrade = [
  body("student_id")
    .optional()
    .isInt({ min: 1 }).withMessage("Valid student ID is required"),
  body("subject")
    .optional()
    .trim()
    .notEmpty().withMessage("Subject cannot be empty"),
  body("score")
    .optional()
    .isFloat({ min: 0 }).withMessage("Score must be a non-negative number"),
  body("semester")
    .optional()
    .trim()
    .notEmpty().withMessage("Semester cannot be empty"),
  handleValidationErrors,
];

/** Validation rules for bulk grade upsert */
export const validateBulkGrades = [
  body("grades")
    .isArray({ min: 1 }).withMessage("Grades must be a non-empty array"),
  body("grades.*.student_id")
    .isInt({ min: 1 }).withMessage("Each grade needs a valid student ID"),
  body("grades.*.subject")
    .trim()
    .notEmpty().withMessage("Each grade needs a subject"),
  body("grades.*.score")
    .isFloat({ min: 0 }).withMessage("Each grade needs a non-negative score"),
  body("grades.*.semester")
    .trim()
    .notEmpty().withMessage("Each grade needs a semester"),
  handleValidationErrors,
];

/** Validation rules for creating a schedule */
export const validateSchedule = [
  body("grade_level")
    .trim()
    .notEmpty().withMessage("Grade level is required"),
  body("subject")
    .trim()
    .notEmpty().withMessage("Subject is required"),
  body("day")
    .trim()
    .notEmpty().withMessage("Day is required")
    .isIn(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"])
    .withMessage("Day must be a valid weekday name"),
  body("start_time")
    .trim()
    .notEmpty().withMessage("Start time is required")
    .matches(/^([01]\d|2[0-3]):[0-5]\d$/).withMessage("Start time must be in HH:MM format"),
  body("end_time")
    .trim()
    .notEmpty().withMessage("End time is required")
    .matches(/^([01]\d|2[0-3]):[0-5]\d$/).withMessage("End time must be in HH:MM format"),
  handleValidationErrors,
];

/** Validation rules for updating a schedule */
export const validateUpdateSchedule = [
  body("grade_level")
    .optional()
    .trim()
    .notEmpty().withMessage("Grade level cannot be empty"),
  body("subject")
    .optional()
    .trim()
    .notEmpty().withMessage("Subject cannot be empty"),
  body("day")
    .optional()
    .trim()
    .isIn(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"])
    .withMessage("Day must be a valid weekday name"),
  body("start_time")
    .optional()
    .trim()
    .matches(/^([01]\d|2[0-3]):[0-5]\d$/).withMessage("Start time must be in HH:MM format"),
  body("end_time")
    .optional()
    .trim()
    .matches(/^([01]\d|2[0-3]):[0-5]\d$/).withMessage("End time must be in HH:MM format"),
  handleValidationErrors,
];

/** Validation rules for contact messages */
export const validateContact = [
  body("name")
    .trim()
    .notEmpty().withMessage("Name is required")
    .isLength({ max: 100 }).withMessage("Name must not exceed 100 characters"),
  body("email")
    .trim()
    .isEmail().withMessage("Invalid email format")
    .normalizeEmail(),
  body("message")
    .trim()
    .notEmpty().withMessage("Message is required")
    .isLength({ max: 2000 }).withMessage("Message must not exceed 2000 characters"),
  handleValidationErrors,
];
