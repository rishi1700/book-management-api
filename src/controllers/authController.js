const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const logger = require("../utils/logger");

exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;

    logger.info("Register request received", { username });

    // Check if user already exists
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      logger.warn("User already exists", { username });
      return res.status(400).json({ error: "User already exists" });
    }

    const user = await User.create({ username, password });
    logger.info("User registered successfully", { username, userId: user.id });

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    logger.error("Error registering user", { error: err.message });
    res.status(500).json({ error: "Error registering user" });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    logger.info("Login request received", { username });

    const user = await User.findOne({ where: { username } });
    if (!user) {
      logger.warn("Invalid login attempt", { username });
      return res.status(400).json({ error: "Invalid username or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      logger.warn("Invalid password attempt", { username });
      return res.status(400).json({ error: "Invalid username or password" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    
    logger.info("User logged in successfully", { username, userId: user.id });
    res.json({ token });
  } catch (err) {
    logger.error("Error logging in", { error: err.message });
    res.status(500).json({ error: "Error logging in" });
  }
};