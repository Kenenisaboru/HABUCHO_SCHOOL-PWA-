/**
 * Announcement Controller
 * -----------------------
 * CRUD for school announcements with role-based permissions.
 */
import * as AnnouncementModel from "../models/announcementModel.js";
import { sendSuccess, sendError, getPagination } from "../utils/response.js";

export const getAnnouncements = async (req, res, next) => {
  try {
    const pagination = getPagination(req.query.page, req.query.limit);
    const { announcements, total } = await AnnouncementModel.getAllAnnouncements(pagination);

    return sendSuccess(res, {
      announcements,
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

export const createAnnouncement = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) return sendError(res, "Title and content are required");

    const announcement = await AnnouncementModel.createAnnouncement({
      title,
      content,
      created_by: req.user.id,
    });

    return sendSuccess(res, announcement, "Announcement created", 201);
  } catch (error) {
    next(error);
  }
};

export const updateAnnouncement = async (req, res, next) => {
  try {
    const announcement = await AnnouncementModel.updateAnnouncement(req.params.id, req.body);
    if (!announcement) return sendError(res, "Announcement not found", 404);
    return sendSuccess(res, announcement, "Announcement updated");
  } catch (error) {
    next(error);
  }
};

export const deleteAnnouncement = async (req, res, next) => {
  try {
    const announcement = await AnnouncementModel.deleteAnnouncement(req.params.id);
    if (!announcement) return sendError(res, "Announcement not found", 404);
    return sendSuccess(res, null, "Announcement deleted");
  } catch (error) {
    next(error);
  }
};
