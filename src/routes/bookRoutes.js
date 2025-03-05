const express = require("express");
const { getBooks, getBookById, createBook, updateBook, deleteBook, restoreBook } = require("../controllers/bookController");
const { authenticate } = require("../middlewares/authMiddleware");
const { validateBook } = require("../middlewares/validateMiddleware");

const router = express.Router();

router.get("/", getBooks);
router.get("/:id", getBookById);
router.post("/", authenticate, validateBook, createBook);
router.put("/:id", authenticate, validateBook, updateBook);
router.delete("/:id", authenticate, deleteBook);
router.post("/:id/restore", authenticate, restoreBook);

module.exports = router;
