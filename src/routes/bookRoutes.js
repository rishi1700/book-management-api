const express = require("express");
const {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  restoreBook,
} = require("../controllers/bookController");

const authenticate = require("../middlewares/authMiddleware");
const {
  validateBook,
  validateSQLInjection,
} = require("../middlewares/validateMiddleware");

const router = express.Router();

// Apply validation middleware correctly
router.get("/", authenticate, validateSQLInjection, getBooks);
router.get("/:id", authenticate, validateSQLInjection, getBookById);
router.post("/", authenticate, validateSQLInjection, validateBook, createBook);
router.put(
  "/:id",
  authenticate,
  validateSQLInjection,
  validateBook,
  updateBook,
);
router.delete("/:id", authenticate, validateSQLInjection, deleteBook);
router.post("/:id/restore", authenticate, validateSQLInjection, restoreBook);

module.exports = router;