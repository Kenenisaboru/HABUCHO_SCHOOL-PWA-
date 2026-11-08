import crypto from "crypto";
import * as PublicModel from "../models/publicModel.js";
import * as AdmissionModel from "../models/admissionModel.js";
import { sendSuccess, sendError } from "../utils/response.js";

/**
 * Generate a unique, professional reference number: HAB-YYYY-XXXXXX
 */
const generateReferenceNumber = () => {
  const year = new Date().getFullYear();
  const random = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `HAB-${year}-${random}`;
};

/**
 * @desc    Get public statistics for landing page
 * @route   GET /api/public/stats
 * @access  Public
 */
export const getPublicStats = async (req, res, next) => {
  try {
    const students = await PublicModel.getStudentCount();
    const teachers = await PublicModel.getTeacherCount();

    return sendSuccess(res, {
      students: `${students}+`,
      teachers: `${teachers}+`,
      accreditation: "Grade A+",
      retentionRate: "98.6%",
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get all active academic programs
 * @route   GET /api/public/programs
 * @access  Public
 */
export const getPublicPrograms = async (_req, res, next) => {
  try {
    const programs = await PublicModel.getActivePrograms();
    return sendSuccess(res, programs);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get published gallery images
 * @route   GET /api/public/gallery
 * @access  Public
 */
export const getPublicGallery = async (_req, res, next) => {
  try {
    const images = await PublicModel.getGalleryImages();
    return sendSuccess(res, images);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get published school events & news
 * @route   GET /api/public/events
 * @access  Public
 */
export const getPublicEvents = async (_req, res, next) => {
  try {
    const events = await PublicModel.getPublishedEvents();
    return sendSuccess(res, events);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Submit an online admission application
 * @route   POST /api/public/admissions
 * @access  Public
 */
export const submitAdmission = async (req, res, next) => {
  try {
    const documentPaths = (req.files || []).map((file) => file.filename);
    const referenceNumber = generateReferenceNumber();

    const application = await AdmissionModel.createApplication({
      ...req.body,
      reference_number: referenceNumber,
      document_paths: documentPaths,
    });

    return sendSuccess(
      res,
      {
        referenceNumber: application.reference_number,
        applicantName: application.applicant_name,
        status: application.status,
        submittedAt: application.created_at,
      },
      "Application submitted successfully! Please save your reference number.",
      201
    );
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Check admission status by reference number
 * @route   GET /api/public/admissions/status/:referenceNumber
 * @access  Public
 */
export const getAdmissionStatus = async (req, res, next) => {
  try {
    const { referenceNumber } = req.params;
    const application = await AdmissionModel.getByReferenceNumber(referenceNumber.trim().toUpperCase());

    if (!application) {
      return sendError(res, "No application found matching this reference number.", 404);
    }

    return sendSuccess(res, {
      referenceNumber: application.reference_number,
      applicantName: application.applicant_name,
      gradeLevel: application.grade_level,
      status: application.status,
      submittedAt: application.created_at,
      reviewedAt: application.reviewed_at,
    });
  } catch (err) {
    next(err);
  }
};
