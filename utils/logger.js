// src/utils/logger.js
const { createLogger, format, transports } = require("winston");
const fs = require("fs");
const path = require("path");

// Ensure logs directory exists
const logDir = "logs";
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const isTest = process.env.NODE_ENV === 'test';
const isProduction = process.env.NODE_ENV === 'production';

// File format (persistent logs)
const fileFormat = format.combine(
  format.timestamp(),
  format.json()
);

// Console format (simple, human-readable output)
const consoleFormat = format.combine(
  format.colorize(),
  format.simple()
);

// File transports for persistent logs
const fileTransports = [
  new transports.File({
    filename: path.join(logDir, "error.log"),
    level: "error",
    format: fileFormat
  }),
  new transports.File({
    filename: path.join(logDir, "combined.log"),
    format: fileFormat
  })
];

// For console, log only errors in test/production; use info in development.
let consoleTransport;
if (isTest || isProduction) {
  consoleTransport = new transports.Console({
    level: "error",
    format: consoleFormat
  });
} else {
  consoleTransport = new transports.Console({
    level: "info",
    format: consoleFormat
  });
}

const logger = createLogger({
  level: process.env.LOG_LEVEL || "info",
  transports: [...fileTransports, consoleTransport],
  exceptionHandlers: [
    new transports.File({
      filename: path.join(logDir, "exceptions.log"),
      format: fileFormat
    })
  ],
  rejectionHandlers: [
    new transports.File({
      filename: path.join(logDir, "rejections.log"),
      format: fileFormat
    })
  ]
});

module.exports = logger;
