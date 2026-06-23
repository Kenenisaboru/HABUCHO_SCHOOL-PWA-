import express from "express";
import { getPublicStats } from "../controllers/publicController.js";
import { apiLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

// Apply rate limiting to public endpoints to prevent abuse
router.use(apiLimiter);

router.get("/stats", getPublicStats);

export default router;
