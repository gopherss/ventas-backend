const { body, param, query } = require('express-validator');

const validateNegocio = [
    body('nombre')
        .notEmpty().withMessage('El nombre es obligatorio')
        .isString().withMessage('El nombre debe ser texto')
        .trim()
        .isLength({ min: 3, max: 100 }).withMessage('El nombre debe tener entre 3 y 100 caracteres'),

    body('propietario')
        .notEmpty().withMessage('El propietario es obligatorio')
        .isString().withMessage('El propietario debe ser texto')
        .trim()
        .isLength({ min: 3, max: 100 }).withMessage('El nombre del propietario debe tener entre 3 y 100 caracteres'),

    body('direccion')
        .optional() // La dirección es opcional en el modelo
        .isString().withMessage('La dirección debe ser texto')
        .trim()
        .isLength({ min: 5, max: 200 }).withMessage('La dirección debe tener entre 5 y 200 caracteres'),

    body('telefono')
        .optional() // El teléfono es opcional en el modelo
        .isMobilePhone('any', { strictMode: false }).withMessage('El teléfono debe tener un formato válido')
        .trim(),
];

const validateNegocioId = [
    param('id')
        .isInt({ min: 1 }).withMessage('El ID del negocio debe ser un número entero positivo')
        .toInt(),
];

const validateNegocioSearch = [
    query('nombre')
        .optional()
        .isString().withMessage('El nombre debe ser texto')
        .trim()
        .isLength({ min: 2 }).withMessage('El término de búsqueda debe tener al menos 2 caracteres'),

    query('propietario')
        .optional()
        .isString().withMessage('El propietario debe ser texto')
        .trim()
        .isLength({ min: 2 }).withMessage('El término de búsqueda debe tener al menos 2 caracteres'),

    query('page')
        .optional()
        .isInt({ min: 1 }).withMessage('La página debe ser un número entero positivo')
        .toInt(),

    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 }).withMessage('El límite debe ser un número entre 1 y 100')
        .toInt(),
];


module.exports = { validateNegocio, validateNegocioId, validateNegocioSearch };
