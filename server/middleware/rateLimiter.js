/**
 * Rate Limiter Middleware
 * ----------------------
 * Prevents brute-force attacks and API abuse.
 * Uses in-memory store by default; configure REDIS_URL for production clustering.
 */
import rateLimit from "express-rate-limit";

const getStore = () => {
  if (process.env.REDIS_URL && process.env.NODE_ENV === "production") {
    try {
      const RedisStore = require("rate-limit-redis");
      const Redis = require("ioredis");
      const client = new Redis(process.env.REDIS_URL);
      return new RedisStore({ sendCommand: (...args) => client.call(...args) });
    } catch {
      return undefined;
    }
  }
  return undefined;
};

const store = getStore();

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    message: "Too many authentication attempts. Please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  ...(store && { store }),
});

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  ...(store && { store }),
});

export const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: "Too many messages sent. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  ...(store && { store }),
});
