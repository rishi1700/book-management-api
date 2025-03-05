const express = require('express');
const { getBooks, getBookById, createBook, updateBook, deleteBook } = require('../controllers/bookController');
const { validateBook } = require('../middlewares/validateMiddleware');

const router = express.Router();

router.get('/', getBooks);
router.get('/:id', getBookById);
router.post('/', validateBook, createBook);
router.put('/:id', validateBook, updateBook);
router.delete('/:id', deleteBook);

module.exports = router;
