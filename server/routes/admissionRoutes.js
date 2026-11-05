import express from "express";
import {
  getAdmissions,
  getAdmissionById,
  updateAdmissionStatus,
} from "../controllers/admissionController.js";
import { authenticateUser, authorizeRoles } from "../middleware/auth.js";
import { validateAdmissionStatus } from "../middleware/validate.js";

const router = express.Router();

router.use(authenticateUser, authorizeRoles("admin"));

router.get("/", getAdmissions);
router.get("/:id", getAdmissionById);
router.put("/:id/status", validateAdmissionStatus, updateAdmissionStatus);

export default router;
