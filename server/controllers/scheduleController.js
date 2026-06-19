/**
 * Schedule Controller
 * -------------------
 * CRUD for class timetables. Admin manages; teachers/students view.
 */
import * as ScheduleModel from "../models/scheduleModel.js";
import { sendSuccess, sendError, getPagination } from "../utils/response.js";

export const getSchedules = async (req, res, next) => {
  try {
    const pagination = getPagination(req.query.page, req.query.limit);
    const filters = { ...pagination };

    if (req.query.grade_level) filters.grade_level = req.query.grade_level;

    // Teachers see only their assigned schedules
    if (req.user.role === "teacher") {
      filters.teacher_id = req.user.id;
    }

    const { schedules, total } = await ScheduleModel.getAllSchedules(filters);

    return sendSuccess(res, {
      schedules,
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

export const createSchedule = async (req, res, next) => {
  try {
    const { grade_level, subject, teacher_id, day, start_time, end_time } = req.body;

    if (!grade_level || !subject || !day || !start_time || !end_time) {
      return sendError(res, "All schedule fields are required");
    }

    const schedule = await ScheduleModel.createSchedule({
      grade_level,
      subject,
      teacher_id,
      day,
      start_time,
      end_time,
    });

    return sendSuccess(res, schedule, "Schedule created", 201);
  } catch (error) {
    next(error);
  }
};

export const updateSchedule = async (req, res, next) => {
  try {
    const schedule = await ScheduleModel.updateSchedule(req.params.id, req.body);
    if (!schedule) return sendError(res, "Schedule not found", 404);
    return sendSuccess(res, schedule, "Schedule updated");
  } catch (error) {
    next(error);
  }
};

export const deleteSchedule = async (req, res, next) => {
  try {
    const schedule = await ScheduleModel.deleteSchedule(req.params.id);
    if (!schedule) return sendError(res, "Schedule not found", 404);
    return sendSuccess(res, null, "Schedule deleted");
  } catch (error) {
    next(error);
  }
};
