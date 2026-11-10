/**
 * Academic & Ranking Routes
 * -------------------------
 */
import { Router } from "express";
import {
  triggerRankingRecalculation,
  topScorersByClass,
  topScorersByGrade,
  topScorersSchoolWide,
  topScorersBySubjectHandler,
  schoolPerformanceAnalytics,
  getStudentAcademicSummary,
  getStudentAcademicHistory,
} from "../controllers/academicController.js";
import { authenticateUser, authorizeRoles } from "../middleware/auth.js";

const router = Router();

// Student-specific endpoints (accessible by student for self, or admin/teacher)
router.get("/student/:studentId/summary", authenticateUser, getStudentAcademicSummary);
router.get("/student/:studentId/history", authenticateUser, getStudentAcademicHistory);

// Admin-only endpoints for ranking recalculation & analytics
router.post(
  "/recalculate-rankings",
  authenticateUser,
  authorizeRoles("admin"),
  triggerRankingRecalculation
);
router.get(
  "/top-scorers/class",
  authenticateUser,
  authorizeRoles("admin"),
  topScorersByClass
);
router.get(
  "/top-scorers/grade",
  authenticateUser,
  authorizeRoles("admin"),
  topScorersByGrade
);
router.get(
  "/top-scorers/school",
  authenticateUser,
  authorizeRoles("admin"),
  topScorersSchoolWide
);
router.get(
  "/top-scorers/subject",
  authenticateUser,
  authorizeRoles("admin"),
  topScorersBySubjectHandler
);
router.get(
  "/analytics",
  authenticateUser,
  authorizeRoles("admin"),
  schoolPerformanceAnalytics
);

export default router;

