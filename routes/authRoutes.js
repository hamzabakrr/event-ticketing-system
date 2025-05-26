const express = require('express');
const router = express.Router();
const { register, login, forgotPassword, me } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);

// Protected routes
router.get('/me', protect, me);

module.exports = router;