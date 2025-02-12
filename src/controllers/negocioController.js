const prisma = require('../prisma/prismaClient');

// Obtener todos los negocios
const getNegocios = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const parsedPage = parseInt(page);
    const parsedLimit = parseInt(limit);
    const skip = (parsedPage - 1) * parsedLimit;

    try {
        const total = await prisma.negocios.count();
        const negocios = await prisma.negocios.findMany({
            skip,
            take: parsedLimit,
            orderBy: { nombre: 'asc' }
        });

        res.json({
            total,
            page: parsedPage,
            limit: parsedLimit,
            data: negocios,
            pagination: {
                totalPages: Math.ceil(total / parsedLimit),
                hasNextPage: parsedPage * parsedLimit < total,
                hasPreviousPage: parsedPage > 1
            }
        });
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener negocios', error: err.message });
    }
};

// buscar negocios
const getNegocioBySearch = async (req, res) => {
    const { nombre, propietario, page = 1, limit = 10 } = req.query;
    const parsedPage = Math.max(parseInt(page, 10), 1);  // Asegura que la página sea >= 1
    const parsedLimit = Math.max(parseInt(limit, 10), 1); // Asegura que el límite sea >= 1
    const skip = (parsedPage - 1) * parsedLimit;

    try {
        const whereClause = {
            OR: []
        };

        if (nombre) {
            whereClause.OR.push({ nombre: { contains: nombre } });
        }

        if (propietario) {
            whereClause.OR.push({ propietario: { contains: propietario } });
        }

        const finalWhereClause = whereClause.OR.length ? whereClause : {};

        const [negocios, total] = await Promise.all([
            prisma.negocios.findMany({
                where: finalWhereClause,
                include: {
                    productos: true,
                    ventas: true
                },
                skip,
                take: parsedLimit,
                orderBy: { nombre: 'asc' }
            }),
            prisma.negocios.count({ where: finalWhereClause }) // Corrección de `Negocios` a `negocios`
        ]);

        res.json({
            data: negocios,
            pagination: {
                total,
                totalPages: Math.ceil(total / parsedLimit),
                currentPage: parsedPage,
                limit: parsedLimit,
                hasNextPage: parsedPage * parsedLimit < total,
                hasPreviousPage: parsedPage > 1
            }
        });
    } catch (err) {
        console.error('Error en búsqueda de negocios:', err);
        res.status(500).json({ message: 'Error al buscar negocios', error: err.message });
    }
};

// Crear una nueva categoría (método separado)
const createCategoriaNegocio = async (req, res) => {
    const { nombre } = req.body;

    try {
        const newCategoria = await prisma.categoriaNegocio.create({
            data: { nombre },
        });

        return res.status(201).json({ message: 'Categoría creada exitosamente', categoria: newCategoria });
    } catch (err) {
        return res.status(500).json({ message: 'Error al crear la categoría', error: err.message });
    }
};


const getAllNegociosCategoria = async (req, res) => {

    try {
        const categoriasNegocio = await prisma.categoriaNegocio.findMany({
            orderBy: { nombre: 'asc' }
        });

        res.json(categoriasNegocio);
    } catch (err) {
        console.error('Error en búsqueda categorías de negocios:', err);
        res.status(500).json({ message: 'Error al buscar negocios', error: err.message });
    }
};


// Actualizar la categoría de un negocio
const updateCategoriaNegocio = async (req, res) => {
    const { id } = req.params; // ID de la categoría que se desea actualizar
    const { nombre } = req.body; // Nuevo nombre de la categoría

    try {
        // Verificar si la categoría existe
        const categoriaExistente = await prisma.categoriaNegocio.findUnique({
            where: { id_categoria_negocio: parseInt(id) },
        });

        if (!categoriaExistente) {
            return res.status(404).json({ message: 'Categoría no encontrada' });
        }

        // Actualizar la categoría
        const updatedCategoria = await prisma.categoriaNegocio.update({
            where: { id_categoria_negocio: parseInt(id) },
            data: { nombre },
        });

        res.status(200).json({
            message: 'Categoría actualizada exitosamente',
            categoria: updatedCategoria,
        });
    } catch (err) {
        res.status(500).json({
            message: 'Error al actualizar la categoría',
            error: err.message,
        });
    }
};


// Crear un nuevo negocio
const createNegocio = async (req, res) => {
    const { nombre, propietario, direccion, telefono, estatus, id_categoria_negocio } = req.body;

    try {
        const categoriaExistente = await prisma.categoriaNegocio.findUnique({
            where: { id_categoria_negocio }
        });

        if (!categoriaExistente) {
            return res.status(400).json({ message: 'La categoría especificada no existe' });
        }

        const newNegocio = await prisma.negocios.create({
            data: { nombre, propietario, direccion, telefono, estatus: Boolean(estatus), id_categoria_negocio }
        });

        res.status(201).json({ message: 'Negocio creado exitosamente', negocio: newNegocio });
    } catch (err) {
        res.status(500).json({ message: 'Error al crear el negocio', error: err.message });
    }
};

// Actualizar un negocio
const updateNegocio = async (req, res) => {
    const { id } = req.params; // Aquí usamos `id` porque así está definido en la ruta
    const id_negocio = parseInt(id, 10); // Convertimos `id` a entero

    const { nombre, propietario, direccion, telefono, estatus, id_categoria_negocio } = req.body;

    if (isNaN(id_negocio)) {
        return res.status(400).json({ message: 'El ID del negocio debe ser un número válido' });
    }

    try {
        // Verificamos si el negocio existe
        const negocioExistente = await prisma.negocios.findUnique({ where: { id_negocio } });

        if (!negocioExistente) {
            return res.status(404).json({ message: 'Negocio no encontrado' });
        }

        // Validamos si la categoría existe (si se envía)
        if (id_categoria_negocio) {
            const categoriaExistente = await prisma.categoriaNegocio.findUnique({ where: { id_categoria_negocio } });
            if (!categoriaExistente) {
                return res.status(400).json({ message: 'La categoría especificada no existe' });
            }
        }

        // Actualizamos el negocio
        const updatedNegocio = await prisma.negocios.update({
            where: { id_negocio },
            data: {
                nombre,
                propietario,
                direccion,
                telefono,
                estatus: Boolean(estatus),
                id_categoria_negocio
            }
        });

        res.json({ message: 'Negocio actualizado exitosamente', negocio: updatedNegocio });
    } catch (err) {
        res.status(500).json({ message: 'Error al actualizar el negocio', error: err.message });
    }
};


module.exports = {
    getNegocios,
    getNegocioBySearch,
    createCategoriaNegocio,
    getAllNegociosCategoria,
    updateCategoriaNegocio,
    createNegocio,
    updateNegocio,
};
