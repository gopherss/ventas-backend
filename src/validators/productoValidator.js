const { body, param } = require('express-validator');

const validateProducto = [
    body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
    body('descripcion').notEmpty().withMessage('La descripción es obligatoria'),
    body('precio')
        .isFloat({ min: 0 })
        .withMessage('El precio debe ser un número mayor o igual a 0'),
    body('stock')
        .isInt({ min: 0 })
        .withMessage('El stock debe ser un número entero no negativo'),
    body('tipo_unidad').notEmpty().withMessage('El tipo de unidad es obligatorio'), // <-- Agregado
    body('id_negocio')
        .isInt()
        .withMessage('El ID del negocio debe ser un número entero'),
];

const validateProductoId = [
    param('id')
        .isInt()
        .withMessage('El ID del producto debe ser un número entero'),
];

module.exports = { validateProducto, validateProductoId };
