const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const { authenticateUser, requireAuth } = require('../middleware/auth');

// Login endpoint
router.post('/api/auth/login', authenticateUser, AuthController.login);

// Logout endpoint
router.post('/api/auth/logout', AuthController.logout);

// Verify token endpoint
router.get('/api/auth/verify', requireAuth, AuthController.verifyToken);

module.exports = router;
