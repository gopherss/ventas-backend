const { body, param } = require('express-validator');

const validateCategoriaNegocio = [
    body('nombre')
        .notEmpty().withMessage('El nombre de la categoría es obligatorio')
        .isString().withMessage('El nombre de la categoría debe ser texto')
        .trim()
        .isLength({ min: 3, max: 100 }).withMessage('El nombre de la categoría debe tener entre 3 y 100 caracteres')
];

const validateCategoriaNegocioId = [
    param('id')
        .isInt({ min: 1 }).withMessage('El ID de la categoría debe ser un número entero positivo')
        .toInt()
];

module.exports = { validateCategoriaNegocio, validateCategoriaNegocioId };
