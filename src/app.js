const express = require('express');
const cors = require('cors');
const sequelize = require("./config/db");
const bodyParser = require("body-parser");
const bookRoutes = require('./routes/bookRoutes');
const authRoutes = require("./routes/authRoutes");
const User = require("./models/User"); 
const rateLimiter = require("./middlewares/rateLimitMiddleware");
const errorMiddleware = require('./middlewares/errorMiddleware');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(rateLimiter);
// Routes
app.use("/api/books", require("./routes/bookRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));

app.use("/api/books", bookRoutes);
app.use("/api/books", rateLimiter);
// Sync Database (Create tables if they don't exist)
sequelize.sync({ alter: true }) // Use alter to update schema without dropping tables
    .then(() => console.log("Database synced"))
    .catch((err) => console.error("Database sync error:", err));
// Global Error Handler
app.use(errorMiddleware);

if (process.env.NODE_ENV !== 'test') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
