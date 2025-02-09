const { body } = require('express-validator');

const validateProveedor = [
    body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
    body('ruc').notEmpty().withMessage('El RUC es obligatorio'),
];

const validateRecepcion = [
    body('id_producto').isInt().withMessage('El ID del producto debe ser un número entero'),
    body('cantidad').isFloat({ min: 1 }).withMessage('La cantidad debe ser mayor a 0'),
    body('precio_compra').isFloat({ min: 0 }).withMessage('El precio de compra debe ser un número positivo'),
    body('id_proveedor').isInt().withMessage('El ID del proveedor debe ser un número entero'),
];

module.exports = { validateProveedor, validateRecepcion };
