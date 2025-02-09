const express = require('express');
const { register, login, getProfile, updateProfile, getAllUsers } = require('../controllers/authController');
const { authenticateToken } = require('../middlewares/authMiddleware');
const authorizeRole = require('../middlewares/authorizeRole');
const { root } = require('../constants/index');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);
router.get('/list-users', authenticateToken, authorizeRole(root), getAllUsers);

module.exports = router;
