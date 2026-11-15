import express from "express";
import {
  getStaffProfiles,
  getStaffProfileById,
  createStaffProfile,
  updateStaffProfile,
  deleteStaffProfile,
} from "../controllers/staffController.js";
import { authenticateUser, authorizeRoles } from "../middleware/auth.js";
import { upload, validateImageUploads } from "../middleware/upload.js";
import { processCloudinaryUpload } from "../services/cloudinaryService.js";
import { validateStaff, validateUpdateStaff } from "../middleware/validate.js";

const router = express.Router();

router.use(authenticateUser, authorizeRoles("admin"));

router.get("/", getStaffProfiles);
router.get("/:id", getStaffProfileById);
router.post(
  "/",
  upload.single("photo"),
  validateImageUploads,
  processCloudinaryUpload("staff"),
  validateStaff,
  createStaffProfile
);
router.put(
  "/:id",
  upload.single("photo"),
  validateImageUploads,
  processCloudinaryUpload("staff"),
  validateUpdateStaff,
  updateStaffProfile
);
router.delete("/:id", deleteStaffProfile);

export default router;
