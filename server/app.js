/**
 * Express Application Setup
 * -------------------------
 * Configures middleware, routes, security, and error handling.
 */
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

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
        connectSrc: ["'self'"],
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
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
};
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Static uploads directory (accessible for gallery, staff photos, event images)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API Endpoints
app.use("/api", apiLimiter);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use("/api/grades", gradeRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/admissions", admissionRoutes);

app.get("/api/health", (_req, res) => {
  res.json({ success: true, message: "Habucho School API is running in Pro Mode" });
});

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
