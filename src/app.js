const express = require('express');
const cors = require('cors');
const bookRoutes = require('./routes/bookRoutes');
const errorMiddleware = require('./middlewares/errorMiddleware');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/books', bookRoutes);

// Global Error Handler
app.use(errorMiddleware);

if (process.env.NODE_ENV !== 'test') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
}

module.exports = app;
