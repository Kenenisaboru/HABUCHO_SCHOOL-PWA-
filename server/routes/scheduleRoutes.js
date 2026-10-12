/**
 * Schedule Routes
 * ----------------
 * GET — Admin, Teacher, Student
 * POST/PUT/DELETE — Admin only
 */
import { Router } from "express";
import {
  getSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule,
} from "../controllers/scheduleController.js";
import { authenticateUser, authorizeRoles, optionalAuth } from "../middleware/auth.js";
import { validateSchedule, validateUpdateSchedule } from "../middleware/validate.js";

const router = Router();

router.get("/", optionalAuth, getSchedules);
router.post("/", authenticateUser, authorizeRoles("admin"), validateSchedule, createSchedule);
router.put("/:id", authenticateUser, authorizeRoles("admin"), validateUpdateSchedule, updateSchedule);
router.delete("/:id", authenticateUser, authorizeRoles("admin"), deleteSchedule);

export default router;
