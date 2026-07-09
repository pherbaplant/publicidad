-- CreateTable
CREATE TABLE "Ciudad" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Tienda" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "formato" TEXT,
    "ciudadId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Tienda_ciudadId_fkey" FOREIGN KEY ("ciudadId") REFERENCES "Ciudad" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Producto" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "marca" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Responsable" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "email" TEXT,
    "rol" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Campana" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "objetivo" TEXT,
    "fechaInicio" DATETIME NOT NULL,
    "fechaFin" DATETIME NOT NULL,
    "inversionTotal" REAL NOT NULL,
    "metaVentas" REAL,
    "metaTiendas" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Ejecucion" (
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
    "indiceDesempeno" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Ejecucion_campanaId_fkey" FOREIGN KEY ("campanaId") REFERENCES "Campana" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Ejecucion_tiendaId_fkey" FOREIGN KEY ("tiendaId") REFERENCES "Tienda" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Ejecucion_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Ejecucion_responsableId_fkey" FOREIGN KEY ("responsableId") REFERENCES "Responsable" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CategoriaCalidad" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "peso" REAL NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "EvaluacionCalidad" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ejecucionId" INTEGER NOT NULL,
    "categoriaId" INTEGER NOT NULL,
    "puntaje" REAL NOT NULL,
    "comentario" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "EvaluacionCalidad_ejecucionId_fkey" FOREIGN KEY ("ejecucionId") REFERENCES "Ejecucion" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "EvaluacionCalidad_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "CategoriaCalidad" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EvidenciaFotografica" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "evaluacionId" INTEGER NOT NULL,
    "rutaArchivo" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "EvidenciaFotografica_evaluacionId_fkey" FOREIGN KEY ("evaluacionId") REFERENCES "EvaluacionCalidad" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Configuracion" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "pesoIncrementoVentas" REAL NOT NULL DEFAULT 0.40,
    "pesoCalidadEjecucion" REAL NOT NULL DEFAULT 0.30,
    "pesoCoberturaTiendas" REAL NOT NULL DEFAULT 0.20,
    "pesoCumplimientoTiempos" REAL NOT NULL DEFAULT 0.10,
    "umbralVerde" REAL NOT NULL DEFAULT 80,
    "umbralAmarillo" REAL NOT NULL DEFAULT 60,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Ciudad_nombre_key" ON "Ciudad"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Responsable_email_key" ON "Responsable"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Ejecucion_campanaId_tiendaId_productoId_key" ON "Ejecucion"("campanaId", "tiendaId", "productoId");

-- CreateIndex
CREATE UNIQUE INDEX "CategoriaCalidad_nombre_key" ON "CategoriaCalidad"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "EvaluacionCalidad_ejecucionId_categoriaId_key" ON "EvaluacionCalidad"("ejecucionId", "categoriaId");
