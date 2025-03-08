const Joi = require("joi");
const logger = require("../utils/logger");
const xss = require("xss");
// Define Book Schema for validation
const bookSchema = Joi.object({
  title: Joi.string().min(3).required(),
  author: Joi.string().min(3).required(),
  published_date: Joi.date().iso().required(),
  genre: Joi.string().min(3).required(),
});

// Validate book details before saving
exports.validateBook = (req, res, next) => {
  const { error } = bookSchema.validate(req.body);
  if (error) {
    logger.warn("Validation error in book details", { details: error.details[0].message });
    return res.status(400).json({
      error: {
        code: 400,
        message: "Validation Error",
        details: error.details[0].message,
      },
    });
  }
  // Check for potential XSS in input fields
  const sanitizedTitle = xss(req.body.title);
  if (sanitizedTitle !== req.body.title) {
    logger.warn("Potential XSS detected in title", { title: req.body.title });
    return res.status(400).json({
      error: {
        code: 400,
        message: "Invalid input detected",
        details: "XSS attempt blocked",
      },
    });
  }
  logger.info("Book details validated successfully");
  next();
};

// SQL Injection Protection Middleware
exports.validateSQLInjection = (req, res, next) => {
  const sqlInjectionPattern =
    /(\b(SELECT|INSERT|DELETE|UPDATE|DROP|UNION|WHERE|OR|AND|;|--|\/\*|\*\/|\*|=|\(|\))\b)/gi;

  // Check query parameters
  for (const param in req.query) {
    if (
      typeof req.query[param] === "string" &&
      sqlInjectionPattern.test(req.query[param])
    ) {
      logger.warn("Potential SQL Injection detected in query parameters", { param, value: req.query[param] });
      return res
        .status(400)
        .json({ error: "Invalid input detected in query parameters" });
    }
  }

  // Check request body
  for (const key in req.body) {
    if (
      typeof req.body[key] === "string" &&
      sqlInjectionPattern.test(req.body[key])
    ) {
      logger.warn("Potential SQL Injection detected in request body", { key, value: req.body[key] });
      return res
        .status(400)
        .json({ error: "Invalid input detected in request body" });
    }
  }

  // Check route parameters
  for (const param in req.params) {
    if (
      typeof req.params[param] === "string" &&
      sqlInjectionPattern.test(req.params[param])
    ) {
      logger.warn("Potential SQL Injection detected in route parameters", { param, value: req.params[param] });
      return res
        .status(400)
        .json({ error: "Invalid input detected in route parameters" });
    }
  }
  
  logger.info("SQL Injection validation passed");
  next();
};