const express = require('express');
const app = express();

const studentRoutes = require('./routes/student.routes');
const logger = require('./middlewares/logger.middleware');
const errorHandler = require('./middlewares/error.middleware');
const notFound = require('./middlewares/notFound.middleware');

// Middleware
app.use(express.json());
app.use(logger);

// Routes
app.use('/api/students', studentRoutes);

// 404 Middleware
app.use(notFound);

// Error Middleware
app.use(errorHandler);

module.exports = app;