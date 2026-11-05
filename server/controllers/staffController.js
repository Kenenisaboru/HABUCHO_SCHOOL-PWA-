/**
 * Staff Controller
 * ----------------
 * Administrative CRUD for faculty and leadership profiles.
 */
import fs from "fs";
import * as StaffModel from "../models/staffModel.js";
import { sendSuccess, sendError } from "../utils/response.js";

export const getStaffProfiles = async (_req, res, next) => {
  try {
    const staff = await StaffModel.getAllStaffProfiles();
    return sendSuccess(res, staff);
  } catch (err) {
    next(err);
  }
};

export const getStaffProfileById = async (req, res, next) => {
  try {
    const profile = await StaffModel.getStaffProfileById(req.params.id);
    if (!profile) return sendError(res, "Staff profile not found", 404);
    return sendSuccess(res, profile);
  } catch (err) {
    next(err);
  }
};

export const createStaffProfile = async (req, res, next) => {
  try {
    const { name, title, department, bio, display_order } = req.body;
    const photo_path = req.file ? `/uploads/${req.file.filename}` : null;

    const profile = await StaffModel.createStaffProfile({
      name,
      title,
      department: department || "",
      bio: bio || "",
      photo_path,
      display_order: parseInt(display_order, 10) || 0,
      created_by: req.user.id,
    });

    return sendSuccess(res, profile, "Staff profile created successfully", 201);
  } catch (err) {
    next(err);
  }
};

export const updateStaffProfile = async (req, res, next) => {
  try {
    const { name, title, department, bio, display_order, is_active } = req.body;
    const fields = { name, title, department, bio, display_order, is_active };

    if (req.file) {
      fields.photo_path = `/uploads/${req.file.filename}`;
    }

    const profile = await StaffModel.updateStaffProfile(req.params.id, fields);
    if (!profile) return sendError(res, "Staff profile not found", 404);

    return sendSuccess(res, profile, "Staff profile updated successfully");
  } catch (err) {
    next(err);
  }
};

export const deleteStaffProfile = async (req, res, next) => {
  try {
    const deleted = await StaffModel.deleteStaffProfile(req.params.id);
    if (!deleted) return sendError(res, "Staff profile not found", 404);

    if (deleted.photo_path) {
      const filePath = deleted.photo_path.replace(/^\/uploads\//, "uploads/");
      fs.unlink(filePath, () => {});
    }

    return sendSuccess(res, { id: req.params.id }, "Staff profile deleted successfully");
  } catch (err) {
    next(err);
  }
};
