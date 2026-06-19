/**
 * Announcement Routes
 * -------------------
 * GET    — All authenticated users
 * POST   — Admin & Teacher
 * PUT/DEL — Admin & Teacher
 */
import { Router } from "express";
import {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from "../controllers/announcementController.js";
import { authenticateUser, authorizeRoles } from "../middleware/auth.js";

const router = Router();

router.get("/", authenticateUser, getAnnouncements);
router.post("/", authenticateUser, authorizeRoles("admin", "teacher"), createAnnouncement);
router.put("/:id", authenticateUser, authorizeRoles("admin", "teacher"), updateAnnouncement);
router.delete("/:id", authenticateUser, authorizeRoles("admin", "teacher"), deleteAnnouncement);

export default router;
