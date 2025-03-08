const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    logger.warn("Unauthorized access attempt: No token provided");
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    logger.info("Token verified successfully", { userId: decoded.id });
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      logger.warn("Token expired", { error: err.message });
      return res.status(401).json({ error: "Token expired" });
    } else {
      logger.error("Unauthorized access attempt: Invalid token", { error: err.message });
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }
  }
};
