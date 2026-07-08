import { prisma } from "@/lib/prisma";
import { recalcularCampana } from "@/server/modules/calculos/recompute";
import type { EjecucionInput } from "./schema";

export function listarEjecuciones() {
  return prisma.ejecucion.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      campana: true,
      tienda: { include: { ciudad: true } },
      producto: true,
      responsable: true,
      evaluaciones: true,
    },
  });
}

export function obtenerEjecucion(id: number) {
  return prisma.ejecucion.findUnique({
    where: { id },
    include: {
      campana: true,
      tienda: { include: { ciudad: true } },
      producto: true,
      responsable: true,
      evaluaciones: {
        include: { categoria: true, evidencias: true },
      },
    },
  });
}

function normalizar(data: EjecucionInput) {
  return {
    campanaId: data.campanaId,
    tiendaId: data.tiendaId,
    productoId: data.productoId,
    responsableId: data.responsableId,
    inversionAsignada: data.inversionAsignada,
    ventasAtribuidas: data.ventasAtribuidas ?? null,
    fechaPlanificada: data.fechaPlanificada ?? null,
    fechaEjecucion: data.fechaEjecucion ?? null,
  };
}

export async function crearEjecucion(data: EjecucionInput) {
  const ejecucion = await prisma.ejecucion.create({ data: normalizar(data) });
  await recalcularCampana(ejecucion.campanaId);
  return ejecucion;
}

export async function actualizarEjecucion(id: number, data: EjecucionInput) {
  const ejecucion = await prisma.ejecucion.update({
    where: { id },
    data: normalizar(data),
  });
  await recalcularCampana(ejecucion.campanaId);
  return ejecucion;
}

export async function eliminarEjecucion(id: number) {
  const ejecucion = await prisma.ejecucion.delete({ where: { id } });
  await recalcularCampana(ejecucion.campanaId);
  return ejecucion;
}
