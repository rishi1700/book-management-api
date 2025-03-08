const rateLimit = require("express-rate-limit");
const logger = require("../utils/logger");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  handler: (req, res) => {
    logger.warn("Rate limit exceeded", { ip: req.ip, url: req.originalUrl });
    res.status(429).json({ error: "Too many requests from this IP, please try again later." });
  },
});

module.exports = limiter;
