/**
 * User Controller
 * ---------------
 * Admin-only user management (CRUD + search + pagination).
 */
import bcrypt from "bcryptjs";
import * as UserModel from "../models/userModel.js";
import { sendSuccess, sendError, getPagination } from "../utils/response.js";

export const getUsers = async (req, res, next) => {
  try {
    const { search, role, page, limit } = req.query;
    const pagination = getPagination(page, limit);
    const { users, total } = await UserModel.getAllUsers({
      search,
      role,
      ...pagination,
    });

    return sendSuccess(res, {
      users,
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

export const getUserById = async (req, res, next) => {
  try {
    const user = await UserModel.findUserById(req.params.id);
    if (!user) return sendError(res, "User not found", 404);
    return sendSuccess(res, user);
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const { full_name, email, password, role } = req.body;

    if (!full_name || !email || !password || !role) {
      return sendError(res, "All fields are required");
    }

    const existing = await UserModel.findUserByEmail(email);
    if (existing) return sendError(res, "Email already exists", 409);

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await UserModel.createUser({
      full_name,
      email,
      password: hashedPassword,
      role,
    });

    return sendSuccess(res, user, "User created", 201);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { full_name, email, role, password } = req.body;
    const updateData = { full_name, email, role };

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const user = await UserModel.updateUser(req.params.id, updateData);
    if (!user) return sendError(res, "User not found", 404);

    return sendSuccess(res, user, "User updated");
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    if (parseInt(req.params.id) === req.user.id) {
      return sendError(res, "Cannot delete your own account");
    }

    const user = await UserModel.deleteUser(req.params.id);
    if (!user) return sendError(res, "User not found", 404);

    return sendSuccess(res, null, "User deleted");
  } catch (error) {
    next(error);
  }
};

/** List students only — accessible by admin and teacher */
export const getStudents = async (req, res, next) => {
  try {
    const pagination = getPagination(req.query.page, req.query.limit || 100);
    const { users, total } = await UserModel.getAllUsers({
      role: "student",
      search: req.query.search,
      ...pagination,
    });
    return sendSuccess(res, { students: users, total });
  } catch (error) {
    next(error);
  }
};

export const getStats = async (req, res, next) => {
  try {
    const [students, teachers, announcements, schedules] = await Promise.all([
      UserModel.countUsersByRole("student"),
      UserModel.countUsersByRole("teacher"),
      import("../models/announcementModel.js").then((m) => m.countAnnouncements()),
      import("../models/scheduleModel.js").then((m) => m.countSchedules()),
    ]);

    return sendSuccess(res, { students, teachers, announcements, schedules });
  } catch (error) {
    next(error);
  }
};
