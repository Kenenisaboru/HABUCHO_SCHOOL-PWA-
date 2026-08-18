import * as PublicModel from "../models/publicModel.js";
import { sendSuccess } from "../utils/response.js";

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
    });
  } catch (err) {
    next(err);
  }
};
