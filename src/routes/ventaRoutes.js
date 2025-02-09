const express = require('express');
const { createVenta, getVentas } = require('../controllers/ventaController');
const { validateVenta } = require('../validators/ventaValidator');
const handleValidationErrors = require('../middlewares/validationMiddleware');
const { authenticate } = require('../middlewares/authMiddleware');
const authorizeRole = require('../middlewares/authorizeRole');
const { root, admin, user } = require('../constants/index');

const router = express.Router();

router.post('/', authenticate, authorizeRole(root, admin, user), validateVenta, handleValidationErrors, createVenta);
router.get('/negocio/:idNegocio', authenticate, authorizeRole(root, admin, user), getVentas);

module.exports = router;
