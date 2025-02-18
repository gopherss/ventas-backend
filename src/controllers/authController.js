const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../prisma/prismaClient');
const { root, user } = require('../constants/index');


const register = async (req, res) => {
    const { nombre, email, password, role, id_negocio } = req.body;
    const userRole = role || user;

    try {
        if (userRole === root) {
            const existingRoot = await prisma.usuarios.findFirst({ where: { role: root } });
            if (existingRoot) {
                return res.status(403).json({ status: 'error', message: 'Ya existe un usuario root en el sistema.' });
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        let negocioId = id_negocio;

        if (userRole === root) {
            let negocioFicticio = await prisma.negocios.findFirst({ where: { nombre: 'Negocio Ficticio Root' } });

            if (!negocioFicticio) {
                let categoriaFicticia = await prisma.categoriaNegocio.findFirst({ where: { nombre: 'Ficticio' } });
                if (!categoriaFicticia) {
                    categoriaFicticia = await prisma.categoriaNegocio.create({
                        data: { nombre: 'Ficticio' }
                    });
                }

                negocioFicticio = await prisma.negocios.create({
                    data: {
                        nombre: 'Negocio Ficticio Root',
                        propietario: 'Root User',
                        direccion: 'Calle Imaginaria 123',
                        telefono: '123456789',
                        estatus: true,
                        id_categoria_negocio: categoriaFicticia.id_categoria_negocio,
                    },
                });
            }
            negocioId = negocioFicticio.id_negocio;
        } else {
            const negocio = await prisma.negocios.findUnique({ where: { id_negocio } });
            if (!negocio) {
                return res.status(400).json({ status: 'error', message: 'El negocio especificado no existe' });
            }
        }

        const existingUser = await prisma.usuarios.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ status: 'error', message: 'El email ya está registrado' });
        }

        const newUser = await prisma.usuarios.create({
            data: { nombre, email, password: hashedPassword, role: userRole, id_negocio: negocioId, estatus: true },
        });

        const { password: _, ...userResponse } = newUser;
        res.status(201).json({ status: 'success', message: 'Usuario registrado exitosamente', user: userResponse });
    } catch (err) {
        console.error('Error en registro:', err);
        res.status(500).json({ status: 'error', message: 'Error al registrar usuario', error: err.message });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await prisma.usuarios.findUnique({ where: { email } });
        if (!user) return res.status(400).json({ message: 'Usuario no encontrado' });

        if (!user.estatus) return res.status(403).json({ message: 'Cuenta inactiva. Contacta al administrador.' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Credenciales inválidas' });

        const token = jwt.sign({ userId: user.id_usuario, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ message: 'Login exitoso', token });
    } catch (err) {
        console.error('Error en login:', err);
        res.status(500).json({ message: 'Error al iniciar sesión' });
    }
};

const getProfile = async (req, res) => {
    const { userId } = req.user;
    try {
        const user = await prisma.usuarios.findUnique({
            where: { id_usuario: userId },
            select: {
                nombre: true,
                email: true,
                role: true,
                id_negocio: true,
                negocio: {
                    select: { nombre: true }
                }
            },
        });
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
        res.json({ user });
    } catch (err) {
        console.error('Error al obtener el perfil:', err);
        res.status(500).json({ message: 'Error al obtener el perfil del usuario' });
    }
};

const updateProfile = async (req, res) => {
    const { userId } = req.params;
    const { nombre, email, password, id_negocio, role, estatus } = req.body;

    let id_usuario_int = parseInt(userId, 10);

    try {
        const existingUser = await prisma.usuarios.findUnique({ where: { id_usuario: id_usuario_int } });
        if (!existingUser) return res.status(404).json({ message: 'Usuario no encontrado' });

        if (email && email !== existingUser.email) {
            const emailExists = await prisma.usuarios.findUnique({ where: { email } });
            if (emailExists) return res.status(400).json({ message: 'El email ya está en uso por otro usuario' });
        }

        const data = { nombre, email, id_negocio, role, estatus };
        if (password) data.password = await bcrypt.hash(password, 10);

        const user = await prisma.usuarios.update({ where: { id_usuario: id_usuario_int }, data });
        res.json({ message: 'Perfil actualizado exitosamente', user });
    } catch (err) {
        console.error('Error al actualizar perfil:', err);
        res.status(500).json({ message: 'Error al actualizar perfil' });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await prisma.usuarios.findMany({
            select: {
                id_usuario: true,
                nombre: true,
                email: true,
                role: true,
                id_negocio: true,
                estatus: true,
                negocio: {
                    select: {
                        nombre: true
                    }
                }
            },
        });
        res.json({ status: 'success', users });
    } catch (err) {
        console.error('Error al obtener todos los usuarios:', err);
        res.status(500).json({ status: 'error', message: 'Error al obtener todos los usuarios' });
    }
};

module.exports = { register, login, getProfile, updateProfile, getAllUsers };
