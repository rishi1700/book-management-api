// jest.global-teardown.js
const sequelize = require("./src/config/db");
const logger = require("./src/utils/logger");

module.exports = async function globalTeardown() {
  logger.info("🔌 Global teardown: Waiting before closing connections...");
  await new Promise(resolve => setTimeout(resolve, 2000));
  logger.info("🔌 Global teardown: Closing MySQL connection...");
  try {
    await sequelize.close();
  } catch (err) {
    if (err.message.includes("pool is draining")) {
      logger.warn("MySQL pool is draining; ignoring.");
    } else {
      logger.error("Error closing MySQL connection: " + err.message);
    }
  }
};
