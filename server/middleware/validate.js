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

/** Validation rules for creating an announcement */
export const validateAnnouncement = [
  body("title")
    .trim()
    .notEmpty().withMessage("Title is required")
    .isLength({ max: 200 }).withMessage("Title must not exceed 200 characters"),
  body("content")
    .trim()
    .notEmpty().withMessage("Content is required"),
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
    .isFloat({ min: 0, max: 100 }).withMessage("Score must be between 0 and 100"),
  body("semester")
    .trim()
    .notEmpty().withMessage("Semester is required"),
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
    .notEmpty().withMessage("Day is required"),
  body("start_time")
    .trim()
    .notEmpty().withMessage("Start time is required"),
  body("end_time")
    .trim()
    .notEmpty().withMessage("End time is required"),
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
