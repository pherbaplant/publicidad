-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "Ciudad" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ciudad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tienda" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "formato" TEXT,
    "ciudadId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tienda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Producto" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "marca" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Producto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Responsable" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT,
    "rol" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Responsable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Campana" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "objetivo" TEXT,
    "fechaInicio" TIMESTAMP(3) NOT NULL,
    "fechaFin" TIMESTAMP(3) NOT NULL,
    "inversionTotal" DOUBLE PRECISION NOT NULL,
    "metaVentas" DOUBLE PRECISION,
    "metaTiendas" INTEGER,
    "roas" DOUBLE PRECISION,
    "scoreIncrementoVentas" DOUBLE PRECISION,
    "scoreCalidadEjecucion" DOUBLE PRECISION,
    "scoreCoberturaTiendas" DOUBLE PRECISION,
    "scoreCumplimientoTiempos" DOUBLE PRECISION,
    "indiceDesempeno" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Campana_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ejecucion" (
    "id" SERIAL NOT NULL,
    "campanaId" INTEGER NOT NULL,
    "tiendaId" INTEGER NOT NULL,
    "productoId" INTEGER NOT NULL,
    "responsableId" INTEGER NOT NULL,
    "inversionAsignada" DOUBLE PRECISION NOT NULL,
    "ventasAtribuidas" DOUBLE PRECISION,
    "fechaPlanificada" TIMESTAMP(3),
    "fechaEjecucion" TIMESTAMP(3),
    "roas" DOUBLE PRECISION,
    "scoreCalidad" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ejecucion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CategoriaCalidad" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "peso" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CategoriaCalidad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EvaluacionCalidad" (
    "id" SERIAL NOT NULL,
    "ejecucionId" INTEGER NOT NULL,
    "categoriaId" INTEGER NOT NULL,
    "puntaje" DOUBLE PRECISION NOT NULL,
    "comentario" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EvaluacionCalidad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EvidenciaFotografica" (
    "id" SERIAL NOT NULL,
    "evaluacionId" INTEGER NOT NULL,
    "rutaArchivo" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EvidenciaFotografica_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Configuracion" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "pesoIncrementoVentas" DOUBLE PRECISION NOT NULL DEFAULT 0.40,
    "pesoCalidadEjecucion" DOUBLE PRECISION NOT NULL DEFAULT 0.30,
    "pesoCoberturaTiendas" DOUBLE PRECISION NOT NULL DEFAULT 0.20,
    "pesoCumplimientoTiempos" DOUBLE PRECISION NOT NULL DEFAULT 0.10,
    "umbralVerde" DOUBLE PRECISION NOT NULL DEFAULT 80,
    "umbralAmarillo" DOUBLE PRECISION NOT NULL DEFAULT 60,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Configuracion_pkey" PRIMARY KEY ("id")
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

-- AddForeignKey
ALTER TABLE "Tienda" ADD CONSTRAINT "Tienda_ciudadId_fkey" FOREIGN KEY ("ciudadId") REFERENCES "Ciudad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ejecucion" ADD CONSTRAINT "Ejecucion_campanaId_fkey" FOREIGN KEY ("campanaId") REFERENCES "Campana"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ejecucion" ADD CONSTRAINT "Ejecucion_tiendaId_fkey" FOREIGN KEY ("tiendaId") REFERENCES "Tienda"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ejecucion" ADD CONSTRAINT "Ejecucion_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ejecucion" ADD CONSTRAINT "Ejecucion_responsableId_fkey" FOREIGN KEY ("responsableId") REFERENCES "Responsable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvaluacionCalidad" ADD CONSTRAINT "EvaluacionCalidad_ejecucionId_fkey" FOREIGN KEY ("ejecucionId") REFERENCES "Ejecucion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvaluacionCalidad" ADD CONSTRAINT "EvaluacionCalidad_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "CategoriaCalidad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvidenciaFotografica" ADD CONSTRAINT "EvidenciaFotografica_evaluacionId_fkey" FOREIGN KEY ("evaluacionId") REFERENCES "EvaluacionCalidad"("id") ON DELETE CASCADE ON UPDATE CASCADE;

