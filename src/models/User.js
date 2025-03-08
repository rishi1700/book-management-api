const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const bcrypt = require("bcryptjs");
const logger = require("../utils/logger"); // ✅ Import Winston logger

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [4, 20],
        isAlphaNumericWithLetters(value) {
          if (!/[a-zA-Z]/.test(value)) {
            throw new Error("Username must contain at least one alphabetic character.");
          }
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [8, 100],
        isStrongPassword(value) {
          if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/.test(value)) {
            throw new Error(
              "Password must have at least 1 uppercase, 1 lowercase, 1 number, and 1 special character (!@#$%^&*)."
            );
          }
        },
      },
    },
  },
  {
    timestamps: true,
    hooks: {
      beforeValidate: (user) => {
        logger.info(`Validating username: ${user.username}`);
        user.username = user.username.toLowerCase();
      },
      beforeCreate: async (user) => {
        logger.info(`Creating new user: ${user.username}`);
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        logger.info("Password hashed successfully before saving.");
      },
      beforeUpdate: async (user) => {
        if (user.changed("password")) {
          logger.info(`Updating password for user: ${user.username}`);
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
          logger.info("New password hashed successfully before saving.");
        }
      },
    },
  }
);

module.exports = User;
