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
} from "../controllers/gradeController.js";
import { authenticateUser, authorizeRoles } from "../middleware/auth.js";
import { validateGrade } from "../middleware/validate.js";

const router = Router();

router.get("/", authenticateUser, authorizeRoles("admin", "teacher", "student"), getGrades);
router.post("/", authenticateUser, authorizeRoles("admin", "teacher"), validateGrade, createGrade);
router.put("/:id", authenticateUser, authorizeRoles("admin", "teacher"), updateGrade);
router.delete("/:id", authenticateUser, authorizeRoles("admin", "teacher"), deleteGrade);

export default router;
