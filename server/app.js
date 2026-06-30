/**
 * Express Application Setup
 * -------------------------
 * Configures middleware, routes, and error handling.
 * Separated from server.js for testability.
 */
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import announcementRoutes from "./routes/announcementRoutes.js";
import scheduleRoutes from "./routes/scheduleRoutes.js";
import gradeRoutes from "./routes/gradeRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import publicRoutes from "./routes/publicRoutes.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

import helmet from "helmet";
import { apiLimiter } from "./middleware/rateLimiter.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// --- Global Middleware ---
app.use(helmet({ crossOriginResourcePolicy: false }));

const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Serve uploaded profile pictures
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- API Routes ---
app.use("/api", apiLimiter);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use("/api/grades", gradeRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/public", publicRoutes);

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ success: true, message: "Habucho School API is running" });
});

// --- Error Handling ---
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
