/*
  Warnings:

  - Added the required column `id_negocio` to the `CategoriaProducto` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CategoriaProducto" (
    "id_categoria_producto" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "id_negocio" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CategoriaProducto_id_negocio_fkey" FOREIGN KEY ("id_negocio") REFERENCES "Negocios" ("id_negocio") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_CategoriaProducto" ("createdAt", "id_categoria_producto", "nombre", "updatedAt") SELECT "createdAt", "id_categoria_producto", "nombre", "updatedAt" FROM "CategoriaProducto";
DROP TABLE "CategoriaProducto";
ALTER TABLE "new_CategoriaProducto" RENAME TO "CategoriaProducto";
CREATE UNIQUE INDEX "CategoriaProducto_nombre_key" ON "CategoriaProducto"("nombre");
CREATE INDEX "CategoriaProducto_nombre_idx" ON "CategoriaProducto"("nombre");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

