const rateLimit = require("express-rate-limit");
const logger = require("../utils/logger");

const isTestEnv = process.env.NODE_ENV === "test";

const limiter = rateLimit({
    windowMs: isTestEnv ? 1000 : 60 * 1000, // 1 second for tests, 1 minute for production
    max: isTestEnv ? 1000 : 5, // Allow 1000 requests per second in tests, 5 in production
    message: { error: "Too many requests from this IP, please try again later." },
    headers: true,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => req.ip || "test-ip",
    handler: (req, res) => {
        logger.warn(`🚨 Rate limit exceeded: ${req.ip} tried to access ${req.originalUrl}`);
        res.status(429).json({ error: "Too many requests from this IP, please try again later." });
    },
});

module.exports = limiter;
