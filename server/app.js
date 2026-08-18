/**
 * Express Application Setup
 * -------------------------
 * Configures middleware, routes, and error handling.
 * Separated from server.js for testability.
 */
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
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
import { authenticateUser } from "./middleware/auth.js";

import helmet from "helmet";
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
        imgSrc: ["'self'", "data:", "https:"],
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

app.use("/uploads", authenticateUser, express.static(path.join(__dirname, "uploads")));

app.use("/api", apiLimiter);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use("/api/grades", gradeRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/public", publicRoutes);

app.get("/api/health", (_req, res) => {
  res.json({ success: true, message: "Habucho School API is running" });
});

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
