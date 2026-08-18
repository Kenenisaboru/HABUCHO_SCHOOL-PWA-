/**
 * Grade Routes
 * ------------
 * GET — Admin, Teacher (all), Student (own only)
 * POST/PUT/DELETE — Teacher (Admin can also manage)
 */
import { Router } from "express";
import {
  getGrades,
  createGrade,
  updateGrade,
  deleteGrade,
  bulkUpsert,
  sendScoresToStudents,
} from "../controllers/gradeController.js";
import { authenticateUser, authorizeRoles } from "../middleware/auth.js";
import { validateGrade, validateUpdateGrade, validateBulkGrades } from "../middleware/validate.js";

const router = Router();

router.get("/", authenticateUser, authorizeRoles("admin", "teacher", "student"), getGrades);
router.post("/send-to-students", authenticateUser, authorizeRoles("admin", "teacher"), sendScoresToStudents);
router.post("/bulk", authenticateUser, authorizeRoles("admin", "teacher"), validateBulkGrades, bulkUpsert);
router.post("/", authenticateUser, authorizeRoles("admin", "teacher"), validateGrade, createGrade);
router.put("/:id", authenticateUser, authorizeRoles("admin", "teacher"), validateUpdateGrade, updateGrade);
router.delete("/:id", authenticateUser, authorizeRoles("admin", "teacher"), deleteGrade);

export default router;
