/**
 * Subject & Curriculum Routes
 * --------------------------
 */
import { Router } from "express";
import {
  getSubjects,
  getCurriculumStructure,
  createSubject,
  updateSubject,
  getTeacherAssignments,
  assignTeacherToSubject,
  removeTeacherAssignment,
} from "../controllers/subjectController.js";
import { authenticateUser, authorizeRoles } from "../middleware/auth.js";

const router = Router();

router.get("/", authenticateUser, getSubjects);
router.get("/curriculum", authenticateUser, getCurriculumStructure);
router.get("/assignments", authenticateUser, getTeacherAssignments);

// Admin-only management
router.post("/", authenticateUser, authorizeRoles("admin"), createSubject);
router.put("/:id", authenticateUser, authorizeRoles("admin"), updateSubject);
router.post("/assignments", authenticateUser, authorizeRoles("admin"), assignTeacherToSubject);
router.delete("/assignments/:id", authenticateUser, authorizeRoles("admin"), removeTeacherAssignment);

export default router;

