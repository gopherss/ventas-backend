const express = require('express');
const {
    createProveedor, getProveedores,
    createRecepcion, getRecepciones
} = require('../controllers/inventarioController');

const { authenticate } = require('../middlewares/authMiddleware');
const authorizeRole = require('../middlewares/authorizeRole');
const { root, admin } = require('../constants/index');
const { validateProveedor, validateRecepcion } = require('../validators/inventarioValidator');

const router = express.Router();

// 📌 Rutas para proveedores
router.post('/proveedores', authenticate, authorizeRole(root, admin), validateProveedor, createProveedor);
router.get('/proveedores', authenticate, authorizeRole(root, admin), getProveedores);

// 📌 Rutas para recepción de productos (Ingreso de inventario)
router.post('/recepciones', authenticate, authorizeRole(root, admin), validateRecepcion, createRecepcion);
router.get('/recepciones', authenticate, authorizeRole(root, admin), getRecepciones);

module.exports = router;
