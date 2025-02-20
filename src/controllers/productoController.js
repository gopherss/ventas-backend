const prisma = require('../prisma/prismaClient');

// Obtener todos los productos de un negocio
const getProductos = async (req, res) => {
    const { idNegocio } = req.params;
    const { page = 1, limit = 10, search } = req.query;

    try {
        const whereCondition = {
            id_negocio: parseInt(idNegocio),
            ...(search && {
                OR: [
                    { nombre: { contains: search.toLowerCase() } },
                    { descripcion: { contains: search.toLowerCase() } }
                ],
            }),
        };

        const total = await prisma.productos.count({ where: whereCondition });

        const productos = await prisma.productos.findMany({
            where: whereCondition,
            skip: (parseInt(page) - 1) * parseInt(limit),
            take: parseInt(limit),
            include: {
                categoriaProducto: { select: { nombre: true } },
            },
        });

        res.json({
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            data: productos,
        });
    } catch (err) {
        res.status(500).json({ message: "Error al obtener productos", error: err.message });
    }
};

//Obtener todas las categorías de productos
const getCategoriasProducto = async (req, res) => {
    const { idNegocio } = req.params; // Obtener el ID del negocio desde los parámetros de la ruta

    try {
        const categorias = await prisma.categoriaProducto.findMany({
            where: { id_negocio: Number(idNegocio) }, // Filtrar por negocio
        });
        res.status(200).json(categorias);
    } catch (err) {
        res.status(500).json({ message: "Error al obtener categorías", error: err.message });
    }
};

//Crear una nueva categoría de producto
const createCategoriaProducto = async (req, res) => {
    const { idNegocio } = req.params; // Obtener el ID del negocio desde los parámetros de la ruta
    const { nombre } = req.body;

    if (!nombre) {
        return res.status(400).json({ message: "El nombre de la categoría es obligatorio" });
    }

    try {
        const categoria = await prisma.categoriaProducto.create({
            data: {
                nombre,
                id_negocio: Number(idNegocio), // Asociar la categoría al negocio
            },
        });

        res.status(201).json(categoria);
    } catch (err) {
        if (err.code === "P2002") { // Código de error de Prisma para violación de restricción única
            return res.status(400).json({ message: "El nombre de la categoría ya está en uso" });
        }
        res.status(500).json({ message: "Error al crear la categoría", error: err.message });
    }
};

//Actualizar una categoría de producto
const updateCategoriaProducto = async (req, res) => {
    const { idNegocio, id } = req.params; // Obtener el ID del negocio y el ID de la categoría
    const { nombre } = req.body;

    if (!nombre) {
        return res.status(400).json({ message: "El nombre de la categoría es obligatorio" });
    }

    try {
        const categoriaActualizada = await prisma.categoriaProducto.update({
            where: {
                id_categoria_producto: Number(id),
                id_negocio: Number(idNegocio), // Asegurarse de que la categoría pertenezca al negocio
            },
            data: { nombre },
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
    getCategoriasProducto,
    createCategoriaProducto,
    updateCategoriaProducto,
    createProducto,
    updateProducto,
};
