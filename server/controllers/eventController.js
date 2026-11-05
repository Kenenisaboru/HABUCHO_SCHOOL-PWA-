/**
 * Event Controller
 * ----------------
 * Administrative CRUD operations for news and school events.
 */
import fs from "fs";
import * as EventModel from "../models/eventModel.js";
import { sendSuccess, sendError, getPagination } from "../utils/response.js";

export const getEvents = async (req, res, next) => {
  try {
    const pagination = getPagination(req.query.page, req.query.limit);
    const { events, total } = await EventModel.getAllEvents(pagination);

    return sendSuccess(res, {
      events,
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

export const getEventById = async (req, res, next) => {
  try {
    const event = await EventModel.getEventById(req.params.id);
    if (!event) return sendError(res, "Event not found", 404);
    return sendSuccess(res, event);
  } catch (err) {
    next(err);
  }
};

export const createEvent = async (req, res, next) => {
  try {
    const { title, content, event_date, category, status } = req.body;
    const image_path = req.file ? `/uploads/${req.file.filename}` : null;

    const event = await EventModel.createEvent({
      title,
      content,
      event_date,
      category,
      status: status || "published",
      image_path,
      created_by: req.user.id,
    });

    return sendSuccess(res, event, "Event created successfully", 201);
  } catch (err) {
    next(err);
  }
};

export const updateEvent = async (req, res, next) => {
  try {
    const { title, content, event_date, category, status } = req.body;
    const fields = { title, content, event_date, category, status };

    if (req.file) {
      fields.image_path = `/uploads/${req.file.filename}`;
    }

    const event = await EventModel.updateEvent(req.params.id, fields);
    if (!event) return sendError(res, "Event not found", 404);

    return sendSuccess(res, event, "Event updated successfully");
  } catch (err) {
    next(err);
  }
};

export const deleteEvent = async (req, res, next) => {
  try {
    const existing = await EventModel.getEventById(req.params.id);
    if (!existing) return sendError(res, "Event not found", 404);

    if (existing.image_path) {
      const filePath = existing.image_path.replace(/^\/uploads\//, "uploads/");
      fs.unlink(filePath, () => {});
    }

    await EventModel.deleteEvent(req.params.id);
    return sendSuccess(res, { id: req.params.id }, "Event deleted successfully");
  } catch (err) {
    next(err);
  }
};
