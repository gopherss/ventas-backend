const prisma = require('../prisma/prismaClient');

// Crear una venta
const createVenta = async (req, res) => {
    const { id_negocio, productos, metodo_pago } = req.body;
    const userId = req.user.userId;  // Tomamos el ID del usuario autenticado

    try {
        if (!metodo_pago) {
            return res.status(400).json({ message: "El método de pago es obligatorio" });
        }

        // Ejecutamos dentro de una transacción para asegurar consistencia
        const resultado = await prisma.$transaction(async (prisma) => {
            // Crear la venta
            const newVenta = await prisma.ventas.create({
                data: {
                    id_negocio,
                    id_usuario: userId,
                    metodo_pago,
                    total: productos.reduce((acc, p) => acc + p.precio * p.cantidad, 0),
                }
            });

            // Verificar stock y preparar detalles de venta
            const detalles = [];

            for (const producto of productos) {
                const productoExistente = await prisma.productos.findUnique({
                    where: { id_producto: producto.id_producto }
                });

                if (!productoExistente) {
                    throw new Error(`El producto con ID ${producto.id_producto} no existe`);
                }

                if (productoExistente.stock < producto.cantidad) {
                    throw new Error(`No hay suficiente stock para el producto ${productoExistente.nombre}`);
                }

                // Reducir el stock del producto
                await prisma.productos.update({
                    where: { id_producto: producto.id_producto },
                    data: { stock: productoExistente.stock - producto.cantidad },
                });

                // Agregar detalle a la lista
                detalles.push({
                    id_venta: newVenta.id_venta,
                    id_producto: producto.id_producto,
                    cantidad: producto.cantidad,
                    precio_unitario: producto.precio,
                    subtotal: producto.precio * producto.cantidad,
                });
            }

            // Crear los detalles de la venta
            await prisma.detalleVentas.createMany({ data: detalles });

            return prisma.ventas.findUnique({
                where: { id_venta: newVenta.id_venta },
                include: { detalles: true },
            });
        });

        res.status(201).json({ message: 'Venta creada exitosamente', venta: resultado });
    } catch (err) {
        res.status(400).json({ message: 'Error al crear la venta', error: err.message });
    }
};

// Obtener todas las ventas de un negocio
const getVentas = async (req, res) => {
    const { idNegocio } = req.params;
    const { page = 1, limit = 10 } = req.query;

    try {
        const total = await prisma.ventas.count({
            where: { id_negocio: parseInt(idNegocio, 10) }
        });

        const ventas = await prisma.ventas.findMany({
            where: { id_negocio: parseInt(idNegocio, 10) },
            skip: (page - 1) * parseInt(limit, 10),
            take: parseInt(limit, 10),
            include: {
                detalles: {
                    include: {
                        producto: true,
                    }
                },
                usuario: {
                    select: { nombre: true }
                }
            }
        });

        res.json({
            total,
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            data: ventas,
        });
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener ventas', error: err.message });
    }
};

module.exports = { createVenta, getVentas };
