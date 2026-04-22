const express = require('express');
const cors = require('cors');
const app = express();

const studentRoutes = require('./routes/student.routes');
const authRoutes = require('./routes/auth.routes');
const logger = require('./middlewares/logger.middleware');
const errorHandler = require('./middlewares/error.middleware');
const notFound = require('./middlewares/notFound.middleware');

// Middleware
app.use(express.json());

// CORS Configuration
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(logger);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);

// 404 Middleware
app.use(notFound);

// Error Middleware
app.use(errorHandler);

module.exports = app;
