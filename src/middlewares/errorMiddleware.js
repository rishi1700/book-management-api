const logger = require("../utils/logger");

module.exports = (err, req, res, next) => {
  logger.error("Unhandled error occurred", { error: err.message, stack: err.stack });
  
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  });
};
