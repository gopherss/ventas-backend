-- CreateTable
CREATE TABLE "Negocios" (
    "id_negocio" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "propietario" TEXT NOT NULL,
    "direccion" TEXT,
    "telefono" TEXT,
    "estatus" BOOLEAN NOT NULL DEFAULT true,
    "id_categoria_negocio" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Negocios_id_categoria_negocio_fkey" FOREIGN KEY ("id_categoria_negocio") REFERENCES "CategoriaNegocio" ("id_categoria_negocio") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CategoriaNegocio" (
    "id_categoria_negocio" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Productos" (
    "id_producto" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "sku" TEXT,
    "precio" REAL NOT NULL,
    "stock" REAL NOT NULL,
    "tipo_unidad" TEXT NOT NULL,
    "estatus" BOOLEAN NOT NULL DEFAULT true,
    "fecha_expiracion" DATETIME,
    "id_negocio" INTEGER NOT NULL,
    "createdBy" INTEGER,
    "id_categoria_producto" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Productos_id_negocio_fkey" FOREIGN KEY ("id_negocio") REFERENCES "Negocios" ("id_negocio") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Productos_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "Usuarios" ("id_usuario") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Productos_id_categoria_producto_fkey" FOREIGN KEY ("id_categoria_producto") REFERENCES "CategoriaProducto" ("id_categoria_producto") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Proveedores" (
    "id_proveedor" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "ruc" TEXT NOT NULL,
    "contacto" TEXT,
    "telefono" TEXT,
    "direccion" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "RecepcionProductos" (
    "id_recepcion" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_producto" INTEGER NOT NULL,
    "cantidad" REAL NOT NULL,
    "precio_compra" REAL NOT NULL,
    "id_proveedor" INTEGER NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "fecha" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "RecepcionProductos_id_producto_fkey" FOREIGN KEY ("id_producto") REFERENCES "Productos" ("id_producto") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "RecepcionProductos_id_proveedor_fkey" FOREIGN KEY ("id_proveedor") REFERENCES "Proveedores" ("id_proveedor") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "RecepcionProductos_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuarios" ("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CategoriaProducto" (
    "id_categoria_producto" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Ventas" (
    "id_venta" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fecha" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metodo_pago" TEXT NOT NULL,
    "total" REAL NOT NULL,
    "id_negocio" INTEGER NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Ventas_id_negocio_fkey" FOREIGN KEY ("id_negocio") REFERENCES "Negocios" ("id_negocio") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Ventas_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuarios" ("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DetalleVentas" (
    "id_detalle" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_venta" INTEGER NOT NULL,
    "id_producto" INTEGER NOT NULL,
    "cantidad" REAL NOT NULL,
    "precio_unitario" REAL NOT NULL,
    "subtotal" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "DetalleVentas_id_venta_fkey" FOREIGN KEY ("id_venta") REFERENCES "Ventas" ("id_venta") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DetalleVentas_id_producto_fkey" FOREIGN KEY ("id_producto") REFERENCES "Productos" ("id_producto") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Usuarios" (
    "id_usuario" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "id_negocio" INTEGER NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "estatus" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Usuarios_id_negocio_fkey" FOREIGN KEY ("id_negocio") REFERENCES "Negocios" ("id_negocio") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Negocios_nombre_idx" ON "Negocios"("nombre");

-- CreateIndex
CREATE INDEX "Negocios_propietario_idx" ON "Negocios"("propietario");

-- CreateIndex
CREATE UNIQUE INDEX "CategoriaNegocio_nombre_key" ON "CategoriaNegocio"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Productos_sku_key" ON "Productos"("sku");

-- CreateIndex
CREATE INDEX "Productos_nombre_idx" ON "Productos"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Proveedores_nombre_key" ON "Proveedores"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Proveedores_ruc_key" ON "Proveedores"("ruc");

-- CreateIndex
CREATE INDEX "RecepcionProductos_fecha_idx" ON "RecepcionProductos"("fecha");

-- CreateIndex
CREATE INDEX "RecepcionProductos_id_proveedor_idx" ON "RecepcionProductos"("id_proveedor");

-- CreateIndex
CREATE INDEX "RecepcionProductos_id_usuario_idx" ON "RecepcionProductos"("id_usuario");

-- CreateIndex
CREATE UNIQUE INDEX "CategoriaProducto_nombre_key" ON "CategoriaProducto"("nombre");

-- CreateIndex
CREATE INDEX "CategoriaProducto_nombre_idx" ON "CategoriaProducto"("nombre");

-- CreateIndex
CREATE INDEX "Ventas_fecha_idx" ON "Ventas"("fecha");

-- CreateIndex
CREATE INDEX "Ventas_id_usuario_idx" ON "Ventas"("id_usuario");

-- CreateIndex
CREATE UNIQUE INDEX "Usuarios_email_key" ON "Usuarios"("email");

-- CreateIndex
CREATE INDEX "Usuarios_nombre_idx" ON "Usuarios"("nombre");
