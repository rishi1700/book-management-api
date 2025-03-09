const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const bcrypt = require("bcryptjs");
const logger = require("../utils/logger");

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
        len: {
          args: [4, 20], // Enforce length
          msg: "Username must be between 4 and 20 characters.",
        },
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
        len: {
          args: [8, 100],
          msg: "Password must be at least 8 characters long.",
        },
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
        user.username = user.username.toLowerCase();
      },
      beforeCreate: async (user) => {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      },
      beforeUpdate: async (user) => {
        if (user.changed("password")) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
  }
);

module.exports = User;
