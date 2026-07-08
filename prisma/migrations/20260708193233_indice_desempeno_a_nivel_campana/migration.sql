/*
  Warnings:

  - You are about to drop the column `indiceDesempeno` on the `Ejecucion` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Campana" ADD COLUMN "indiceDesempeno" REAL;
ALTER TABLE "Campana" ADD COLUMN "roas" REAL;
ALTER TABLE "Campana" ADD COLUMN "scoreCalidadEjecucion" REAL;
ALTER TABLE "Campana" ADD COLUMN "scoreCoberturaTiendas" REAL;
ALTER TABLE "Campana" ADD COLUMN "scoreCumplimientoTiempos" REAL;
ALTER TABLE "Campana" ADD COLUMN "scoreIncrementoVentas" REAL;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Ejecucion" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "campanaId" INTEGER NOT NULL,
    "tiendaId" INTEGER NOT NULL,
    "productoId" INTEGER NOT NULL,
    "responsableId" INTEGER NOT NULL,
    "inversionAsignada" REAL NOT NULL,
    "ventasAtribuidas" REAL,
    "fechaPlanificada" DATETIME,
    "fechaEjecucion" DATETIME,
    "roas" REAL,
    "scoreCalidad" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Ejecucion_campanaId_fkey" FOREIGN KEY ("campanaId") REFERENCES "Campana" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Ejecucion_tiendaId_fkey" FOREIGN KEY ("tiendaId") REFERENCES "Tienda" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Ejecucion_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Ejecucion_responsableId_fkey" FOREIGN KEY ("responsableId") REFERENCES "Responsable" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Ejecucion" ("campanaId", "createdAt", "fechaEjecucion", "fechaPlanificada", "id", "inversionAsignada", "productoId", "responsableId", "roas", "scoreCalidad", "tiendaId", "updatedAt", "ventasAtribuidas") SELECT "campanaId", "createdAt", "fechaEjecucion", "fechaPlanificada", "id", "inversionAsignada", "productoId", "responsableId", "roas", "scoreCalidad", "tiendaId", "updatedAt", "ventasAtribuidas" FROM "Ejecucion";
DROP TABLE "Ejecucion";
ALTER TABLE "new_Ejecucion" RENAME TO "Ejecucion";
CREATE UNIQUE INDEX "Ejecucion_campanaId_tiendaId_productoId_key" ON "Ejecucion"("campanaId", "tiendaId", "productoId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
