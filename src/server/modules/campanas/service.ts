import { prisma } from "@/lib/prisma";
import { recalcularCampana } from "@/server/modules/calculos/recompute";
import type { CampanaInput } from "./schema";

export function listarCampanas() {
  return prisma.campana.findMany({
    orderBy: { fechaInicio: "desc" },
    include: { _count: { select: { ejecuciones: true } } },
  });
}

/** Lista liviana (solo id + nombre) para poblar selects. */
export function listarCampanasOpciones() {
  return prisma.campana.findMany({
    orderBy: { fechaInicio: "desc" },
    select: { id: true, nombre: true },
  });
}

export function obtenerCampana(id: number) {
  return prisma.campana.findUnique({
    where: { id },
    include: {
      ejecuciones: {
        include: { tienda: { include: { ciudad: true } }, producto: true, responsable: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

function normalizar(data: CampanaInput) {
  return {
    nombre: data.nombre,
    objetivo: data.objetivo || null,
    fechaInicio: data.fechaInicio,
    fechaFin: data.fechaFin,
    inversionTotal: data.inversionTotal,
    metaVentas: data.metaVentas ?? null,
    metaTiendas: data.metaTiendas ?? null,
  };
}

export async function crearCampana(data: CampanaInput) {
  return prisma.campana.create({ data: normalizar(data) });
}

export async function actualizarCampana(id: number, data: CampanaInput) {
  const campana = await prisma.campana.update({
    where: { id },
    data: normalizar(data),
  });
  await recalcularCampana(id);
  return campana;
}

export function eliminarCampana(id: number) {
  return prisma.campana.delete({ where: { id } });
}
