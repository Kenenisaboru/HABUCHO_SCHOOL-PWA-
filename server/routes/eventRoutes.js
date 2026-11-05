import express from "express";
import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../controllers/eventController.js";
import { authenticateUser, authorizeRoles } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import { validateEvent, validateUpdateEvent } from "../middleware/validate.js";

const router = express.Router();

router.use(authenticateUser, authorizeRoles("admin"));

router.get("/", getEvents);
router.get("/:id", getEventById);
router.post("/", upload.single("image"), validateEvent, createEvent);
router.put("/:id", upload.single("image"), validateUpdateEvent, updateEvent);
router.delete("/:id", deleteEvent);

export default router;
