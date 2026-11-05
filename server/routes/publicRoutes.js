import express from "express";
import {
  getPublicStats,
  getPublicPrograms,
  getPublicGallery,
  getPublicEvents,
  submitAdmission,
  getAdmissionStatus,
} from "../controllers/publicController.js";
import { apiLimiter } from "../middleware/rateLimiter.js";
import { documentUpload } from "../middleware/upload.js";

const router = express.Router();

// Apply rate limiting to all public endpoints
router.use(apiLimiter);

router.get("/stats", getPublicStats);
router.get("/programs", getPublicPrograms);
router.get("/gallery", getPublicGallery);
router.get("/events", getPublicEvents);
router.post("/admissions", documentUpload.array("documents", 5), submitAdmission);
router.get("/admissions/status/:referenceNumber", getAdmissionStatus);

export default router;
