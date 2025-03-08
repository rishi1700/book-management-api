const Book = require("../models/Book");
const logger = require("../utils/logger");
const sequelize = require("../config/db");
const { Op } = require("sequelize");

exports.getBooks = async (req, res) => {
  try {
    const { title, genre, sortBy = "title", order = "ASC", page = 1, limit = 5 } = req.query;
    logger.info("Fetching books", { title, genre, sortBy, order, page, limit });

    let whereClause = {};
    if (title) whereClause.title = { [Op.like]: `%${title}%` };
    if (genre) whereClause.genre = genre;

    const offset = (page - 1) * limit;
    const { count, rows } = await Book.findAndCountAll({
      where: whereClause,
      order: [[sortBy, order.toUpperCase()]],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    logger.info("Books fetched successfully", { totalBooks: count });
    res.status(200).json({
      totalBooks: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      books: rows,
    });
  } catch (err) {
    logger.error("Error fetching books", { error: err.message });
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getBookById = async (req, res, next) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) {
      logger.warn("Book not found", { bookId: req.params.id });
      return res.status(404).json({ error: "Book not found" });
    }
    logger.info("Fetched book successfully", { bookId: req.params.id });
    res.json(book);
  } catch (err) {
    logger.error("Error fetching book", { error: err.message });
    next(err);
  }
};

exports.createBook = async (req, res, next) => {
  const { title, author, published_date, genre } = req.body;
  const transaction = await sequelize.transaction();

  try {
    logger.info("Creating book", { title, author, published_date, genre });
    
    const existingBook = await Book.findOne({ where: { title } }, { transaction });
    if (existingBook) {
      await transaction.rollback();
      logger.warn("Book already exists", { title });
      return res.status(409).json({ error: { code: 409, message: "Conflict", details: "Book already exists" } });
    }

    const newBook = await Book.create({ title, author, published_date, genre }, { transaction });
    await transaction.commit();
    logger.info("Book created successfully", { bookId: newBook.id });

    res.status(201).json(newBook);
  } catch (err) {
    await transaction.rollback();
    logger.error("Error creating book", { error: err.message });
    next(err);
  }
};

exports.updateBook = async (req, res, next) => {
  const { id } = req.params;
  const { title, author, published_date, genre } = req.body;
  const transaction = await sequelize.transaction();

  try {
    logger.info("Updating book", { bookId: id });
    
    const book = await Book.findByPk(id, { transaction, lock: transaction.LOCK.UPDATE });
    if (!book) {
      await transaction.rollback();
      logger.warn("Book not found", { bookId: id });
      return res.status(404).json({ error: "Book not found" });
    }

    await book.update({ title, author, published_date, genre }, { transaction });
    await transaction.commit();
    logger.info("Book updated successfully", { bookId: id });
    res.json(book);
  } catch (error) {
    await transaction.rollback();
    logger.error("Error updating book", { error: error.message });
    next(error);
  }
};

exports.deleteBook = async (req, res, next) => {
  try {
    logger.info("Deleting book", { bookId: req.params.id });
    
    const book = await Book.findOne({ where: { id: req.params.id }, paranoid: false });
    if (!book) {
      logger.warn("Book not found for deletion", { bookId: req.params.id });
      return res.status(404).json({ error: "Book not found" });
    }

    if (book.deletedAt) {
      logger.warn("Book already deleted", { bookId: req.params.id });
      return res.status(409).json({ error: "Book is already deleted" });
    }

    await book.destroy();
    logger.info("Book soft deleted", { bookId: req.params.id });
    res.json({ message: "Book soft deleted" });
  } catch (err) {
    logger.error("Error soft deleting book", { error: err.message });
    next(err);
  }
};

exports.restoreBook = async (req, res, next) => {
  try {
    logger.info("Restoring book", { bookId: req.params.id });
    
    const book = await Book.findOne({ where: { id: req.params.id }, paranoid: false });
    if (!book) {
      logger.warn("Book not found for restoration", { bookId: req.params.id });
      return res.status(404).json({ error: "Book not found" });
    }

    if (!book.deletedAt) {
      logger.warn("Book is not deleted", { bookId: req.params.id });
      return res.status(400).json({ error: "Book is not deleted" });
    }

    await book.restore();
    logger.info("Book restored successfully", { bookId: req.params.id });
    res.json({ message: "Book restored successfully" });
  } catch (err) {
    logger.error("Error restoring book", { error: err.message });
    next(err);
  }
};
