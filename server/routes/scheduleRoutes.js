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
import { authenticateUser, authorizeRoles } from "../middleware/auth.js";

const router = Router();

router.get("/", authenticateUser, authorizeRoles("admin", "teacher", "student"), getSchedules);
router.post("/", authenticateUser, authorizeRoles("admin"), createSchedule);
router.put("/:id", authenticateUser, authorizeRoles("admin"), updateSchedule);
router.delete("/:id", authenticateUser, authorizeRoles("admin"), deleteSchedule);

export default router;
