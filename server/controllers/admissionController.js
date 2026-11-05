/**
 * Admission Controller
 * --------------------
 * Administrative review and management of student admission applications.
 */
import * as AdmissionModel from "../models/admissionModel.js";
import { sendSuccess, sendError, getPagination } from "../utils/response.js";

export const getAdmissions = async (req, res, next) => {
  try {
    const pagination = getPagination(req.query.page, req.query.limit);
    const { applications, total } = await AdmissionModel.getAllApplications(pagination);

    return sendSuccess(res, {
      applications,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages: Math.ceil(total / pagination.limit),
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getAdmissionById = async (req, res, next) => {
  try {
    const application = await AdmissionModel.getApplicationById(req.params.id);
    if (!application) return sendError(res, "Admission application not found", 404);
    return sendSuccess(res, application);
  } catch (err) {
    next(err);
  }
};

export const updateAdmissionStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ["pending", "under_review", "approved", "rejected"];
    if (!validStatuses.includes(status)) {
      return sendError(res, "Invalid status value", 400);
    }

    const application = await AdmissionModel.updateStatus(req.params.id, {
      status,
      reviewed_by: req.user.id,
      reviewed_at: new Date(),
    });

    if (!application) return sendError(res, "Admission application not found", 404);

    return sendSuccess(res, application, `Application status updated to ${status}`);
  } catch (err) {
    next(err);
  }
};
