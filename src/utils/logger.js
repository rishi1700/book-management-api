const { createLogger, format, transports } = require("winston");
const fs = require("fs");
const path = require("path");

// Ensure logs directory exists
const logDir = "logs";
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const logger = createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [
    new transports.File({ filename: path.join(logDir, "error.log"), level: "error" }),
    new transports.File({ filename: path.join(logDir, "combined.log") }),
  ],
  exceptionHandlers: [
    new transports.File({ filename: path.join(logDir, "exceptions.log") }),
  ],
  rejectionHandlers: [
    new transports.File({ filename: path.join(logDir, "rejections.log") }),
  ],
});

// ✅ Always show logs in console (even in production)
logger.add(
  new transports.Console({
    format: format.combine(format.colorize(), format.simple()),
  })
);

module.exports = logger;
