/**
 * Auth Controller
 * ---------------
 * Handles user registration and login with JWT + bcrypt.
 */
import bcrypt from "bcryptjs";
import * as UserModel from "../models/userModel.js";
import { generateToken } from "../utils/jwt.js";
import { sendSuccess, sendError } from "../utils/response.js";

export const register = async (req, res, next) => {
  try {
    const { full_name, email, password } = req.body;

    if (!full_name || !email || !password) {
      return sendError(res, "Full name, email, and password are required");
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return sendError(res, "Invalid email format");
    }

    // Validate password strength
    if (password.length < 8) {
      return sendError(res, "Password must be at least 8 characters long");
    }

    // Public registration is always "student" — admins/teachers are created by admin
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
    });

    const token = generateToken(user);

    return sendSuccess(
      res,
      {
        token,
        user: { id: user.id, name: user.full_name, role: user.role },
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

    return sendSuccess(res, {
      token,
      user: { id: user.id, name: user.full_name, role: user.role },
    }, "Login successful");
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
