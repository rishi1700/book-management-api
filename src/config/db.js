const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST || "127.0.0.1",
        dialect: "mysql",
        dialectModule: require("mysql2"),
        port: process.env.DB_PORT || 3306,
        logging: false,
        dialectOptions: {
            connectTimeout: 10000,
        },
    }
);

// Test connection
sequelize
    .authenticate()
    .then(() => console.log("✅ MySQL Database Connected Successfully!"))
    .catch((err) => console.error("🚨 Database Connection Error:", err));

module.exports = sequelize;
