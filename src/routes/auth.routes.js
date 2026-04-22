const express = require('express');
const router = express.Router();
const { signup, login, getMe, logout } = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Public routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

// Protected route - needs valid JWT
router.get('/me', authMiddleware, getMe);

module.exports = router;
