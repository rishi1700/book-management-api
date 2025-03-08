const express = require("express");
const cors = require("cors");
const allowedOrigins = ["http://localhost:3000"];
const sequelize = require("./config/db");
const bodyParser = require("body-parser");
const rateLimiter = require("./middlewares/rateLimitMiddleware");
const bookRoutes = require("./routes/bookRoutes");
const authRoutes = require("./routes/authRoutes");
const errorMiddleware = require("./middlewares/errorMiddleware");

require("dotenv").config();

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(rateLimiter); // ✅ Apply rate limiting middleware

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
        console.error("🚨 CORS Blocked: Unauthorized origin", origin);
        return res.status(403).json({ error: "CORS not allowed" });
    }
});

// Routes
app.use("/api/books", bookRoutes);
app.use("/api/auth", authRoutes);

const isTestEnv = process.env.NODE_ENV === "test";

sequelize
  .sync({ alter: true })
  .then(() => {
    if (!isTestEnv) {
      console.log("✅ Database synced");
    }
  })
  .catch((err) => console.error("🚨 Database sync error:", err));

// Global Error Handler
app.use(errorMiddleware);

if (!isTestEnv) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

module.exports = app;
