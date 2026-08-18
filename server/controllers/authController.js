/**
 * Auth Controller
 * ---------------
 * Handles user registration and login with JWT + bcrypt.
 * Uses short-lived access tokens (15min) + long-lived refresh tokens (7d).
 */
import bcrypt from "bcryptjs";
import crypto from "crypto";
import * as UserModel from "../models/userModel.js";
import { generateAccessToken, generateRefreshToken, verifyToken } from "../utils/jwt.js";
import { sendSuccess, sendError } from "../utils/response.js";
import pool from "../config/db.js";

const ACCESS_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 15 * 60 * 1000,
  path: "/",
};

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/api/auth/refresh",
};

const setAuthCookies = (res, user) => {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  res.cookie("token", accessToken, ACCESS_COOKIE_OPTIONS);
  res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);
  return { accessToken, refreshToken };
};

export const register = async (req, res, next) => {
  try {
    const {
      full_name,
      email,
      password,
      student_id,
      gender,
      date_of_birth,
      grade_level,
      section,
      stream,
      phone,
      parent_name,
      parent_phone,
      address,
      academic_year,
      emergency_contact_name,
      emergency_contact_phone,
      blood_group,
      previous_school,
      remarks,
    } = req.body;

    if (!full_name || !email || !password) {
      return sendError(res, "Full name, email, and password are required");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return sendError(res, "Invalid email format");
    }

    if (password.length < 8) {
      return sendError(res, "Password must be at least 8 characters long");
    }

    const userRole = "student";

    const existing = await UserModel.findUserByEmail(email);
    if (existing) {
      return sendError(res, "Email already registered", 409);
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await UserModel.createUser({
      full_name,
      email,
      password: hashedPassword,
      role: userRole,
      student_id,
      gender,
      date_of_birth,
      grade_level,
      section,
      stream,
      phone,
      parent_name,
      parent_phone,
      address,
      academic_year,
      emergency_contact_name,
      emergency_contact_phone,
      blood_group,
      previous_school,
      remarks,
    });

    setAuthCookies(res, user);

    return sendSuccess(
      res,
      {
        user: { id: user.id, name: user.full_name, role: user.role, grade_level: user.grade_level, section: user.section, stream: user.stream },
      },
      "Registration successful",
      201
    );
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, "Email and password are required");
    }

    const user = await UserModel.findUserByEmail(email);
    if (!user) {
      return sendError(res, "Invalid email or password", 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return sendError(res, "Invalid email or password", 401);
    }

    setAuthCookies(res, user);

    return sendSuccess(res, {
      user: { id: user.id, name: user.full_name, role: user.role },
    }, "Login successful");
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res) => {
  res.clearCookie("token", { path: "/" });
  res.clearCookie("refreshToken", { path: "/api/auth/refresh" });
  return sendSuccess(res, null, "Logged out successfully");
};

export const refreshAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return sendError(res, "No refresh token provided", 401);
    }

    let decoded;
    try {
      decoded = verifyToken(refreshToken);
    } catch {
      return sendError(res, "Invalid or expired refresh token", 401);
    }

    if (decoded.type !== "refresh") {
      return sendError(res, "Invalid token type", 401);
    }

    const user = await UserModel.findUserById(decoded.id);
    if (!user) {
      return sendError(res, "User not found", 404);
    }

    setAuthCookies(res, user);

    return sendSuccess(res, {
      user: { id: user.id, name: user.full_name, role: user.role },
    }, "Token refreshed");
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return sendError(res, "Email is required");

    const user = await UserModel.findUserByEmail(email);
    if (!user) return sendSuccess(res, null, "If the email exists, a reset link has been sent.");

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = await bcrypt.hash(resetToken, 10);
    const expires = new Date(Date.now() + 60 * 60 * 1000);

    await pool.query(
      "UPDATE users SET password_reset_token = $1, password_reset_expires = $2 WHERE id = $3",
      [hashedToken, expires, user.id]
    );

    console.log(`[PASSWORD RESET] Token for ${email}: ${resetToken}`);
    console.log(`[PASSWORD RESET] Expires at: ${expires.toISOString()}`);

    return sendSuccess(res, null, "If the email exists, a reset link has been sent.");
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) return sendError(res, "Token and new password are required");

    if (password.length < 8) return sendError(res, "Password must be at least 8 characters long");

    const { rows } = await pool.query(
      "SELECT id, password_reset_token, password_reset_expires FROM users WHERE password_reset_token IS NOT NULL"
    );

    let matchedUser = null;
    for (const row of rows) {
      if (row.password_reset_expires < new Date()) continue;
      const isMatch = await bcrypt.compare(token, row.password_reset_token);
      if (isMatch) { matchedUser = row; break; }
    }

    if (!matchedUser) return sendError(res, "Invalid or expired reset token", 400);

    const hashedPassword = await bcrypt.hash(password, 12);
    await pool.query(
      "UPDATE users SET password = $1, password_reset_token = NULL, password_reset_expires = NULL WHERE id = $2",
      [hashedPassword, matchedUser.id]
    );

    return sendSuccess(res, null, "Password reset successful. You can now log in with your new password.");
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const user = await UserModel.findUserById(req.user.id);
    if (!user) return sendError(res, "User not found", 404);
    return sendSuccess(res, user);
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { full_name, phone } = req.body;
    if (!full_name?.trim()) return sendError(res, "Full name is required");

    const { rows } = await pool.query(
      "UPDATE users SET full_name = $1, phone = $2, updated_at = NOW() WHERE id = $3 RETURNING id, full_name, email, role, phone",
      [full_name.trim(), phone?.trim() || null, req.user.id]
    );

    if (!rows.length) return sendError(res, "User not found", 404);
    return sendSuccess(res, rows[0], "Profile updated");
  } catch (error) {
    next(error);
  }
};

export const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) return sendError(res, "No image file provided");

    const avatarPath = `/uploads/${req.file.filename}`;
    await pool.query(
      "UPDATE users SET avatar_url = $1, updated_at = NOW() WHERE id = $2",
      [avatarPath, req.user.id]
    );

    return sendSuccess(res, { avatar_url: avatarPath }, "Avatar updated");
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { current_password, new_password } = req.body;
    if (!current_password || !new_password) {
      return sendError(res, "Current and new password are required");
    }
    if (new_password.length < 8) {
      return sendError(res, "New password must be at least 8 characters");
    }

    const user = await UserModel.findUserById(req.user.id);
    if (!user) return sendError(res, "User not found", 404);

    const valid = await bcrypt.compare(current_password, user.password);
    if (!valid) return sendError(res, "Current password is incorrect", 401);

    const hashed = await bcrypt.hash(new_password, 12);
    await pool.query("UPDATE users SET password = $1, updated_at = NOW() WHERE id = $2", [hashed, req.user.id]);

    return sendSuccess(res, null, "Password changed successfully");
  } catch (error) {
    next(error);
  }
};
