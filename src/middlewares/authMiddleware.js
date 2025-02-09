const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: 'Acceso denegado' });


    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Token inválido' });
        req.user = user;

        next();
    });
};


const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1]; // Extracción del token desde el encabezado

    if (!token) {
        return res.status(403).json({ message: 'Acceso denegado: No se encontró el token' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Guardamos el usuario decodificado (userId y role)
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Token no válido' });
    }
};

module.exports = { authenticate, authenticateToken };
