const express = require('express');
const { register, login, getProfile, updateProfile, getAllUsers } = require('../controllers/authController');
const { authenticateToken, authenticate } = require('../middlewares/authMiddleware');
const authorizeRole = require('../middlewares/authorizeRole');
const { root } = require('../constants/index');

const router = express.Router();

router.post('/register', /* authenticate, authorizeRole(root), */ register);
router.post('/login', login);
router.get('/profile', authenticateToken, getProfile);
router.put('/profile/:userId', authenticate, authorizeRole(root), updateProfile);
router.get('/list-users', authenticateToken, authorizeRole(root), getAllUsers);

module.exports = router;
