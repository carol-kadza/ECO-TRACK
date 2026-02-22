const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authenticate = require('../middleware/authenticate');

// Public routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);

// Protected routes
router.get('/me', authenticate, authController.me);

module.exports = router;