/**
 * Auth Controller
 * ---------------
 * Handles user registration and login with JWT + bcrypt.
 */
import bcrypt from "bcryptjs";
import * as UserModel from "../models/userModel.js";
import { generateToken } from "../utils/jwt.js";
import { sendSuccess, sendError } from "../utils/response.js";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/",
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

    const token = generateToken(user);

    res.cookie("token", token, COOKIE_OPTIONS);

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

    const token = generateToken(user);

    res.cookie("token", token, COOKIE_OPTIONS);

    return sendSuccess(res, {
      user: { id: user.id, name: user.full_name, role: user.role },
    }, "Login successful");
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res) => {
  res.clearCookie("token", { path: "/" });
  return sendSuccess(res, null, "Logged out successfully");
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
