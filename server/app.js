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
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// --- Global Middleware ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded profile pictures
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- API Routes ---
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use("/api/grades", gradeRoutes);
app.use("/api/contact", contactRoutes);

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ success: true, message: "Habucho School API is running" });
});

// --- Error Handling ---
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
