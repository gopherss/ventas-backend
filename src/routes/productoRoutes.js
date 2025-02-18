const express = require('express');
const {
    getProductos,
    searchByNameProductos,
    getCategoriasProducto,
    createProducto,
    updateProducto,
    createCategoriaProducto,
    updateCategoriaProducto,
} = require('../controllers/productoController');
const { validateProducto, validateProductoId, validateCategoriaProductoId, validateCategoriaProducto } = require('../validators/productoValidator');
const handleValidationErrors = require('../middlewares/validationMiddleware');
const { authenticate } = require('../middlewares/authMiddleware');
const authorizeRole = require('../middlewares/authorizeRole');
const { root, admin, user, } = require('../constants/index');

const router = express.Router();

// Rutas de productos
router.get('/negocio/:idNegocio', authenticate, authorizeRole(root, admin, user), getProductos);
router.get('/', authenticate, authorizeRole(root, admin, user), searchByNameProductos);
router.post('/', authenticate, authorizeRole(root, admin, user), validateProducto, handleValidationErrors, createProducto);
router.put('/:id', authenticate, authorizeRole(root, admin, user), validateProductoId, validateProducto, handleValidationErrors, updateProducto);


// Rutas de categorías de productos
router.get("/negocio/:idNegocio/categorias", authenticate, authorizeRole(root, admin, user), getCategoriasProducto);
router.post("/negocio/:idNegocio/categorias", authenticate, authorizeRole(root, admin, user), validateCategoriaProducto, handleValidationErrors, createCategoriaProducto);
router.put("/negocio/:idNegocio/categorias/:id", authenticate, authorizeRole(root, admin, user), validateCategoriaProductoId, handleValidationErrors, updateCategoriaProducto);


module.exports = router;
