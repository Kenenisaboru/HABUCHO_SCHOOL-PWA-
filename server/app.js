/**
 * Express Application Setup
 * -------------------------
 * Configures middleware, routes, security, and error handling.
 */
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import announcementRoutes from "./routes/announcementRoutes.js";
import scheduleRoutes from "./routes/scheduleRoutes.js";
import gradeRoutes from "./routes/gradeRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import publicRoutes from "./routes/publicRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import galleryRoutes from "./routes/galleryRoutes.js";
import staffRoutes from "./routes/staffRoutes.js";
import admissionRoutes from "./routes/admissionRoutes.js";

import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import { apiLimiter } from "./middleware/rateLimiter.js";
import pool from "./config/db.js";
import logger from "./utils/logger.js";
import { UPLOAD_DIR } from "./utils/uploadStorage.js";

const app = express();

const isProduction = process.env.NODE_ENV === "production";
const defaultOrigins = [
  "http://localhost:5173",
  "http://localhost:4173",
  "https://habucho-school-pwa-0.onrender.com",
];

const envOrigins = (process.env.CLIENT_URL || "")
  .split(",")
  .map((origin) => origin.trim().replace(/\/+$/, ""))
  .filter(Boolean);

const allowedOrigins = Array.from(new Set([...defaultOrigins, ...envOrigins]));

app.set("trust proxy", 1);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:", "blob:"],
        connectSrc: ["'self'", "https:", "http:"],
        objectSrc: ["'none'"],
        frameAncestors: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
      },
    },
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
    noSniff: true,
    xssFilter: true,
  })
);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const normalized = origin.replace(/\/+$/, "");
    if (
      allowedOrigins.includes(normalized) ||
      normalized.endsWith(".onrender.com") ||
      !isProduction
    ) {
      return callback(null, true);
    }
    return callback(new Error("Origin is not allowed by CORS"));
  },
  credentials: true,
};
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Static uploads directory (accessible for gallery, staff photos, event images)
app.use("/uploads", express.static(UPLOAD_DIR));

app.get("/api/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    return res.status(200).json({ status: "ok" });
  } catch {
    logger.error("Health check failed: database unavailable");
    return res.status(503).json({ status: "error" });
  }
});

// API Endpoints (supports both /api/* and root /* paths)
app.use(["/api", "/"], apiLimiter);
app.use(["/api/auth", "/auth"], authRoutes);
app.use(["/api/users", "/users"], userRoutes);
app.use(["/api/announcements", "/announcements"], announcementRoutes);
app.use(["/api/schedules", "/schedules"], scheduleRoutes);
app.use(["/api/grades", "/grades"], gradeRoutes);
app.use(["/api/contact", "/contact"], contactRoutes);
app.use(["/api/public", "/public"], publicRoutes);
app.use(["/api/events", "/events"], eventRoutes);
app.use(["/api/gallery", "/gallery"], galleryRoutes);
app.use(["/api/staff", "/staff"], staffRoutes);
app.use(["/api/admissions", "/admissions"], admissionRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
