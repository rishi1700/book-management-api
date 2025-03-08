const express = require("express");
const cors = require("cors");
const allowedOrigins = ["http://localhost:3000"];
const sequelize = require("./config/db");
const bodyParser = require("body-parser");
const redisRateLimiter = require("./middlewares/rateLimitMiddleware");
const bookRoutes = require("./routes/bookRoutes");
const authRoutes = require("./routes/authRoutes");
const errorMiddleware = require("./middlewares/errorMiddleware");

require("dotenv").config();

const app = express();

// ✅ Remove duplicate cors() and use this correctly configured one
app.use(cors({
  origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
          callback(null, origin || allowedOrigins[0]); // ✅ Return allowed origin
      } else {
          callback(new Error("CORS not allowed"));
      }
  },
  credentials: true, // ✅ Allow cookies/auth headers if needed
  methods: "GET,POST,PUT,DELETE,OPTIONS",
  allowedHeaders: "Content-Type,Authorization",
}));

app.use(express.json());
app.use(bodyParser.json());
app.use(redisRateLimiter); // ✅ Apply rate limiting middleware here

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

if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

module.exports = app;
