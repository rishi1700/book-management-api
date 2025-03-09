const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const logger = require("../utils/logger"); // ✅ Import Winston logger

exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;
    logger.info(`📌 Registering user: ${username}`);

    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      logger.warn(`❌ Registration failed - User already exists: ${username}`);
      return res.status(400).json({
        error: {
          code: 400,
          message: "User already exists",
          details: `The username '${username}' is already taken.`,
        },
      });
    }

    // ✅ Attempt to create user (validation will trigger if invalid)
    const user = await User.create({ username, password });

    logger.info(`✅ User registered successfully: ${username}`);
    res.status(201).json({
      message: "User registered successfully",
      user: { id: user.id, username: user.username, createdAt: user.createdAt },
    });

  } catch (err) {
    logger.error(`🚨 Error registering user: ${err.message}`);

    // ✅ Handle Sequelize validation errors properly
    if (err.name === "SequelizeValidationError") {
      return res.status(400).json({
        error: {
          code: 400,
          message: "Validation Error",
          details: err.errors.map((e) => e.message), // Returns an array of validation errors
        },
      });
    }

    // ✅ Handle all other errors safely
    res.status(500).json({
      error: {
        code: 500,
        message: "Internal Server Error",
        details: process.env.NODE_ENV !== "production" ? err.message : "Please try again later.",
      },
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    logger.info(`🔑 Login attempt for user: ${username}`);

    const user = await User.findOne({ where: { username } });
    if (!user) {
      logger.warn(`❌ Login failed - User not found: ${username}`);
      return res.status(400).json({ error: "Invalid username or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      logger.warn(`❌ Login failed - Incorrect password for user: ${username}`);
      return res.status(400).json({ error: "Invalid username or password" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    logger.info(`✅ User logged in successfully: ${username}`);
    res.json({ token });
  } catch (err) {
    logger.error(`🚨 Error logging in user: ${err.message}`);
    res.status(500).json({ error: "Error logging in" });
  }
};
