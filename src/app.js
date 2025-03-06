const express = require('express');
const cors = require('cors');
const sequelize = require("./config/db");
const bodyParser = require("body-parser");
const redisRateLimiter = require("./middlewares/rateLimitMiddleware"); 
const bookRoutes = require('./routes/bookRoutes');
const authRoutes = require("./routes/authRoutes");
const errorMiddleware = require('./middlewares/errorMiddleware');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(redisRateLimiter); // ✅ Apply rate limiting middleware here

// Routes
app.use("/api/books", bookRoutes);
app.use("/api/auth", authRoutes);

// Sync Database (Create tables if they don't exist)
sequelize.sync({ alter: true })
    .then(() => console.log("✅ Database synced"))
    .catch((err) => console.error("🚨 Database sync error:", err));

// Global Error Handler
app.use(errorMiddleware);

if (process.env.NODE_ENV !== 'test') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

module.exports = app;
