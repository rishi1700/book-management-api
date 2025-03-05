const Book = require('../models/Book');
const logger = require('../utils/logger');

exports.getBooks = async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;
        
        const books = await Book.findAndCountAll({
            limit: parseInt(limit),
            offset: parseInt(offset),
        });

        logger.info(`Fetched books: Page ${page}, Limit ${limit}`);
        
        res.json({
            totalBooks: books.count,
            totalPages: Math.ceil(books.count / limit),
            currentPage: parseInt(page),
            books: books.rows
        });
    } catch (err) {
        logger.error("Error fetching books: " + err.message);
        next(err);
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

        await book.destroy();
        logger.info(`Deleted book: ID ${req.params.id}`);

        res.json({ message: 'Book deleted' });
    } catch (err) {
        logger.error("Error deleting book: " + err.message);
        next(err);
    }
};
