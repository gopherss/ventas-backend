const { body, param } = require('express-validator');

const validateVenta = [
    body('id_negocio')
        .isInt().withMessage('El ID del negocio es obligatorio y debe ser un número entero'),

    body('metodo_pago')
        .isString().withMessage('El método de pago es obligatorio y debe ser un string')
        .isLength({ min: 2 }).withMessage('El método de pago debe tener al menos 2 caracteres'),

    body('productos')
        .isArray({ min: 1 })
        .withMessage('Debe haber al menos un producto en la venta')
        .custom((productos) => {
            for (const producto of productos) {
                if (!producto.id_producto || !producto.cantidad || !producto.precio) {
                    throw new Error('Cada producto debe tener id_producto, cantidad y precio');
                }
                if (producto.cantidad <= 0 || producto.precio <= 0) {
                    throw new Error('La cantidad y el precio deben ser mayores a 0');
                }
            }
            return true;
        }),
];

const validateVentaId = [
    param('id')
        .isInt().withMessage('El ID de la venta debe ser un número entero'),
];

module.exports = { validateVenta, validateVentaId };
