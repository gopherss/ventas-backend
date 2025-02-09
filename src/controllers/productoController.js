const prisma = require('../prisma/prismaClient');

// Obtener todos los productos de un negocio
const getProductos = async (req, res) => {
    const { idNegocio } = req.params;
    const { page = 1, limit = 10 } = req.query;

    try {
        const total = await prisma.productos.count({
            where: { id_negocio: parseInt(idNegocio) }
        });

        const productos = await prisma.productos.findMany({
            where: { id_negocio: parseInt(idNegocio) },
            skip: (page - 1) * limit,
            take: parseInt(limit),
            include: {
                categoriaProducto: true,
                negocio: true
            }
        });

        res.json({
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            data: productos,
        });
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener productos', error: err.message });
    }
};

// Buscar Productos por nombre
const searchByNameProductos = async (req, res) => {
    const { nombre, id_negocio, page = 1, limit = 10 } = req.query;

    if (!id_negocio) {
        return res.status(400).json({ message: 'El id_negocio es requerido' });
    }

    try {
        const productos = await prisma.productos.findMany({
            where: {
                nombre: {
                    contains: nombre?.toLowerCase(),
                },
                id_negocio: Number(id_negocio),
            },
            skip: (page - 1) * Number(limit),
            take: Number(limit),
            select: {
                id_producto: true,
                nombre: true,
                precio: true,
                stock: true,
                id_negocio: true,
            },
        });

        const total = await prisma.productos.count({
            where: {
                nombre: {
                    contains: nombre?.toLowerCase(),
                },
                id_negocio: Number(id_negocio),
            },
        });

        res.json({
            productos,
            total,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(total / limit),
        });
    } catch (err) {
        console.error('Error al buscar productos:', err);
        res.status(500).json({ message: 'Error al buscar productos', error: err.message });
    }
};

//Obtener todas las categorías de productos
const getCategoriasProducto = async (req, res) => {
    try {
        const categorias = await prisma.categoriaProducto.findMany();
        res.status(200).json(categorias);
    } catch (err) {
        res.status(500).json({ message: "Error al obtener categorías", error: err.message });
    }
};

//Crear una nueva categoría de producto
const createCategoriaProducto = async (req, res) => {
    const { nombre } = req.body;

    if (!nombre) {
        return res.status(400).json({ message: "El nombre de la categoría es obligatorio" });
    }

    try {
        const categoria = await prisma.categoriaProducto.create({
            data: { nombre }
        });

        res.status(201).json(categoria);
    } catch (err) {
        res.status(500).json({ message: "Error al crear la categoría", error: err.message });
    }
};

//Actualizar una categoría de producto
const updateCategoriaProducto = async (req, res) => {
    const { id } = req.params;
    const { nombre } = req.body;

    if (!nombre) {
        return res.status(400).json({ message: "El nombre de la categoría es obligatorio" });
    }

    try {
        const categoriaActualizada = await prisma.categoriaProducto.update({
            where: { id_categoria_producto: Number(id) },
            data: { nombre }
        });

        res.status(200).json(categoriaActualizada);
    } catch (err) {
        res.status(500).json({ message: "Error al actualizar la categoría", error: err.message });
    }
};


// Crear un producto
const createProducto = async (req, res) => {
    const { nombre, descripcion, precio, stock, tipo_unidad, id_negocio, id_categoria_producto } = req.body;
    const userId = req.user.userId;

    try {
        const resultado = await prisma.$transaction(async (prisma) => {
            const existingProducto = await prisma.productos.findFirst({
                where: { nombre, id_negocio }
            });

            if (existingProducto) {
                return await prisma.productos.update({
                    where: { id_producto: existingProducto.id_producto },
                    data: { stock: existingProducto.stock + stock },
                });
            }

            return await prisma.productos.create({
                data: {
                    nombre,
                    descripcion,
                    precio,
                    stock,
                    tipo_unidad, // <-- Agregado
                    id_negocio,
                    id_categoria_producto,
                    createdBy: userId,
                }
            });
        });

        res.status(201).json(resultado);
    } catch (err) {
        res.status(500).json({ message: 'Error al crear el producto', error: err.message });
    }
};


// Actualizar un producto
const updateProducto = async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, sku, precio, stock, tipo_unidad, estatus, fecha_expiracion, id_categoria_producto } = req.body;

    try {
        // Verificar si el producto existe antes de actualizar
        const existingProducto = await prisma.productos.findUnique({
            where: { id_producto: parseInt(id) }
        });

        if (!existingProducto) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        const updatedProducto = await prisma.productos.update({
            where: { id_producto: parseInt(id) },
            data: {
                nombre,
                descripcion,
                sku,
                precio,
                stock,
                tipo_unidad,
                estatus,
                fecha_expiracion,
                id_categoria_producto,
            }
        });

        res.json({ message: 'Producto actualizado correctamente', producto: updatedProducto });
    } catch (err) {
        res.status(500).json({ message: 'Error al actualizar el producto', error: err.message });
    }
};


module.exports = {
    getProductos,
    searchByNameProductos,
    getCategoriasProducto,
    createCategoriaProducto,
    updateCategoriaProducto,
    createProducto,
    updateProducto,
};
