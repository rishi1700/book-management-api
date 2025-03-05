const Book = require('../models/Book');
const logger = require('../utils/logger');
const { Op } = require("sequelize");

exports.getBooks = async (req, res) => {
    try {
        const { title, genre, sortBy = "title", order = "ASC", page = 1, limit = 5 } = req.query;

        let whereClause = {};
        if (title) {
            whereClause.title = { [Op.like]: `%${title}%` };
        }
        if (genre) {
            whereClause.genre = genre;
        }

        const offset = (page - 1) * limit;
        const { count, rows } = await Book.findAndCountAll({
            where: whereClause,
            order: [[sortBy, order.toUpperCase()]],
            limit: parseInt(limit),
            offset: parseInt(offset),
        });

        res.status(200).json({
            totalBooks: count,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            books: rows,
        });
    } catch (err) {
        console.error("Error fetching books:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};




exports.getBookById = async (req, res, next) => {
    try {
        const book = await Book.findByPk(req.params.id);
        if (!book) {
            logger.warn(`Book not found: ID ${req.params.id}`);
            return res.status(404).json({ error: 'Book not found' });
        }
        
        logger.info(`Fetched book: ID ${req.params.id}`);
        res.json(book);
    } catch (err) {
        logger.error("Error fetching book: " + err.message);
        next(err);
    }
};

exports.createBook = async (req, res, next) => {
    try {
        const { title, author, published_date, genre } = req.body;
        const newBook = await Book.create({ title, author, published_date, genre });

        logger.info(`Created book: ${newBook.title}`);
        res.status(201).json(newBook);
    } catch (err) {
        logger.error("Error creating book: " + err.message);
        next(err);
    }
};

exports.updateBook = async (req, res, next) => {
    try {
        const { title, author, published_date, genre } = req.body;
        const book = await Book.findByPk(req.params.id);

        if (!book) {
            logger.warn(`Book not found for update: ID ${req.params.id}`);
            return res.status(404).json({ error: 'Book not found' });
        }

        await book.update({ title, author, published_date, genre });

        logger.info(`Updated book: ID ${req.params.id}`);
        res.json(book);
    } catch (err) {
        logger.error("Error updating book: " + err.message);
        next(err);
    }
};

exports.deleteBook = async (req, res, next) => {
    try {
        const book = await Book.findByPk(req.params.id);
        if (!book) {
            logger.warn(`Book not found for deletion: ID ${req.params.id}`);
            return res.status(404).json({ error: 'Book not found' });
        }

        await book.destroy(); // Soft delete: sets deletedAt timestamp instead of deleting

        logger.info(`Soft deleted book: ID ${req.params.id}`);
        res.json({ message: 'Book soft deleted' });
    } catch (err) {
        logger.error("Error soft deleting book: " + err.message);
        next(err);
    }
};

exports.restoreBook = async (req, res, next) => {
    try {
        const book = await Book.findOne({
            where: { id: req.params.id },
            paranoid: false // Include soft-deleted books
        });

        if (!book) {
            logger.warn(`Book not found for restoration: ID ${req.params.id}`);
            return res.status(404).json({ error: 'Book not found' });
        }

        await book.restore(); // Restores the soft-deleted book
        logger.info(`Restored book: ID ${req.params.id}`);

        res.json({ message: 'Book restored successfully' });
    } catch (err) {
        logger.error("Error restoring book: " + err.message);
        next(err);
    }
};
