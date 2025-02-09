const prisma = require('../prisma/prismaClient');

// 📌 Crear un proveedor
const createProveedor = async (req, res) => {
    const { nombre, ruc, contacto, telefono, direccion } = req.body;

    try {
        const proveedor = await prisma.proveedores.create({
            data: { nombre, ruc, contacto, telefono, direccion }
        });

        res.status(201).json({ message: 'Proveedor creado exitosamente', proveedor });
    } catch (err) {
        res.status(400).json({ message: 'Error al crear el proveedor', error: err.message });
    }
};

// 📌 Obtener todos los proveedores
const getProveedores = async (req, res) => {
    try {
        const proveedores = await prisma.proveedores.findMany();
        res.json(proveedores);
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener proveedores', error: err.message });
    }
};

// 📌 Crear una recepción de productos (Ingreso de inventario)
const createRecepcion = async (req, res) => {
    const { id_producto, cantidad, precio_compra, id_proveedor } = req.body;
    const id_usuario = req.user.userId;  // Usuario autenticado

    try {
        const resultado = await prisma.$transaction(async (prisma) => {
            // Verificar si el producto existe
            const producto = await prisma.productos.findUnique({
                where: { id_producto }
            });

            if (!producto) {
                throw new Error(`El producto con ID ${id_producto} no existe`);
            }

            // Actualizar el stock del producto
            await prisma.productos.update({
                where: { id_producto },
                data: { stock: producto.stock + cantidad }
            });

            // Registrar la recepción del producto
            const recepcion = await prisma.recepcionProductos.create({
                data: {
                    id_producto,
                    cantidad,
                    precio_compra,
                    id_proveedor,
                    id_usuario
                }
            });

            return recepcion;
        });

        res.status(201).json({ message: 'Recepción de producto registrada exitosamente', recepcion: resultado });
    } catch (err) {
        res.status(400).json({ message: 'Error al registrar la recepción', error: err.message });
    }
};

// 📌 Obtener todas las recepciones de productos
const getRecepciones = async (req, res) => {
    try {
        const recepciones = await prisma.recepcionProductos.findMany({
            include: {
                producto: { select: { nombre: true } },
                proveedor: { select: { nombre: true } },
                usuario: { select: { nombre: true } }
            }
        });

        res.json(recepciones);
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener recepciones', error: err.message });
    }
};

module.exports = { createProveedor, getProveedores, createRecepcion, getRecepciones };
