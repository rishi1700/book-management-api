const express = require("express");
const allowedOrigins = ["http://localhost:3000"];
const sequelize = require("./config/db");
const rateLimiter = require("./middlewares/rateLimitMiddleware");
const bookRoutes = require("./routes/bookRoutes");
const authRoutes = require("./routes/authRoutes");
const errorMiddleware = require("./middlewares/errorMiddleware");
const morgan = require("morgan");
const logger = require("./utils/logger"); // ✅ Import Winston logger
const swaggerDocs = require("./config/swagger"); // ✅ Import Swagger
const helmet = require("helmet");

require("dotenv").config();

const app = express();

// ✅ Apply OWASP Security Headers
app.use(
  helmet({
    contentSecurityPolicy: false, // Disable CSP if needed (modify based on frontend setup)
    crossOriginResourcePolicy: { policy: "same-origin" },
    crossOriginOpenerPolicy: { policy: "same-origin" },
    referrerPolicy: { policy: "no-referrer" },
    frameguard: { action: "deny" }, // Prevents clickjacking
    dnsPrefetchControl: { allow: false }, // Disable DNS prefetching
    hidePoweredBy: true, // Removes 'X-Powered-By: Express' header
    ieNoOpen: true, // Prevents IE downloads from executing
    noSniff: true, // Prevents MIME sniffing
    xssFilter: true, // Enables XSS protection
  })
);

// ✅ Morgan logging integrated with Winston
app.use(morgan("combined", { stream: { write: (message) => logger.info(message.trim()) } }));

app.use(express.json());
app.use(rateLimiter); // ✅ Apply rate limiting middleware

// ✅ Load Swagger Docs
swaggerDocs(app);

// ✅ FIX: Properly handle CORS errors without throwing a 500
app.use((req, res, next) => {
    const origin = req.get("Origin");
    if (!origin || allowedOrigins.includes(origin)) {
        res.header("Access-Control-Allow-Origin", origin || allowedOrigins[0]);
        res.header("Access-Control-Allow-Credentials", "true");
        res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
        return next();
    } else {
        logger.warn("CORS Blocked: Unauthorized origin", { origin });
        return res.status(403).json({ error: "CORS not allowed" });
    }
});

// ✅ Log API route usage
app.use((req, res, next) => {
    logger.info("Incoming request", { method: req.method, url: req.url, ip: req.ip });
    next();
});

// Routes
app.use("/api/books", bookRoutes);
app.use("/api/auth", authRoutes);

const isTestEnv = process.env.NODE_ENV === "test";

sequelize
  .sync({ alter: true })
  .then(() => {
    if (!isTestEnv) {
      logger.info("✅ Database synced successfully");
    }
  })
  .catch((err) => logger.error("🚨 Database sync error", { error: err.message }));

// Global Error Handler
app.use(errorMiddleware);

if (!isTestEnv) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => logger.info(`🚀 Server running on port ${PORT}`));
}

module.exports = app;
