import winston from "winston";

const { combine, timestamp, printf, colorize, json } = winston.format;

const consoleFormat = printf(({ level, message, timestamp: ts }) => {
  return `${ts} ${level}: ${message}`;
});

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || (process.env.NODE_ENV === "production" ? "info" : "debug"),
  defaultMeta: { service: "habucho-api" },
  transports: [
    new winston.transports.Console({
      format: process.env.NODE_ENV === "production"
        ? combine(timestamp(), json())
        : combine(timestamp({ format: "HH:mm:ss" }), colorize(), consoleFormat),
    }),
  ],
});

export default logger;
