const sequelize = require('../config/db');
const { DataTypes } = require('sequelize');

const Book = sequelize.define('Book', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    author: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    published_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    genre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
    }
}, {
    timestamps: true,
    paranoid: true, // Enables soft delete
});

module.exports = Book;
