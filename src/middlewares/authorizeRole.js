const authorizeRole = (...allowedRoles) => {
    return (req, res, next) => {
        const userRole = req.user.role;

        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({ message: 'Acceso denegado No tienes el rol Permitido' });
        }

        next();
    };
};

module.exports = authorizeRole;
