/**
 * Admission Controller
 * --------------------
 * Administrative review and management of student admission applications.
 */
import * as AdmissionModel from "../models/admissionModel.js";
import { sendSuccess, sendError, getPagination } from "../utils/response.js";
import fs from "node:fs/promises";
import path from "node:path";
import { getPrivateUploadPath } from "../utils/uploadStorage.js";
import { logAuditEvent } from "../services/auditService.js";

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

export const downloadAdmissionDocument = async (req, res, next) => {
  try {
    const application = await AdmissionModel.getApplicationById(req.params.id);
    if (!application) return sendError(res, "Admission application not found", 404);

    const filename = path.basename(req.params.filename);
    const ownedDocuments = (application.document_paths || []).map((storedPath) =>
      path.basename(String(storedPath).replace(/\\/g, "/"))
    );
    if (!ownedDocuments.includes(filename)) {
      return sendError(res, "Admission document not found", 404);
    }

    const filePath = getPrivateUploadPath(filename);
    if (!filePath) return sendError(res, "Admission document not found", 404);
    await fs.access(filePath);
    return res.download(filePath, filename, (error) => {
      if (error && !res.headersSent) next(error);
    });
  } catch (error) {
    if (error.code === "ENOENT") return sendError(res, "Admission document not found", 404);
    return next(error);
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

    await logAuditEvent({
      user: req.user,
      action: "ADMISSION_STATUS_UPDATE",
      entityType: "admission",
      entityId: req.params.id,
      details: { new_status: status },
      ip: req.ip,
    });

    return sendSuccess(res, application, `Application status updated to ${status}`);
  } catch (err) {
    next(err);
  }
};
