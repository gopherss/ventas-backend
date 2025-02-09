const express = require('express');
const {
    getNegocios,
    getNegocioBySearch,
    createNegocio,
    getAllNegociosCategoria,
    updateNegocio,
    createCategoriaNegocio,
    updateCategoriaNegocio
} = require('../controllers/negocioController');
const { validateNegocio, validateNegocioId, validateNegocioSearch } = require('../validators/negocioValidator');
const { validateCategoriaNegocio, validateCategoriaNegocioId } = require('../validators/categoriaNegocioValidator'); // Validación para categoría
const handleValidationErrors = require('../middlewares/validationMiddleware');
const { authenticate } = require('../middlewares/authMiddleware');
const authorizeRole = require('../middlewares/authorizeRole');
const { root } = require('../constants/index');

const router = express.Router();

// Rutas de negocios
router.get('/', authenticate, authorizeRole(root), getNegocios);
router.get('/search', authenticate, authorizeRole(root), validateNegocioSearch, handleValidationErrors, getNegocioBySearch);
router.post('/', authenticate, authorizeRole(root), validateNegocio, handleValidationErrors, createNegocio);
router.put('/:id', authenticate, authorizeRole(root), validateNegocioId, validateNegocio, handleValidationErrors, updateNegocio);

// Rutas de categorías de negocio
router.post('/categoria', authenticate, authorizeRole(root), validateCategoriaNegocio, handleValidationErrors, createCategoriaNegocio);
router.get('/categoria', authenticate, authorizeRole(root), handleValidationErrors, getAllNegociosCategoria);
router.put('/categoria/:id', authenticate, authorizeRole(root), validateCategoriaNegocioId, validateCategoriaNegocio, handleValidationErrors, updateCategoriaNegocio);

module.exports = router;
