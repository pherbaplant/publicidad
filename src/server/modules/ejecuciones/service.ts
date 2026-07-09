import { prisma } from "@/lib/prisma";
import { recalcularCampana } from "@/server/modules/calculos/recompute";
import type { EjecucionInput } from "./schema";

/** Todas las ejecuciones sin paginar — solo para exportaciones (Excel). */
export function listarEjecuciones() {
  return prisma.ejecucion.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      campana: true,
      tienda: { include: { ciudad: true } },
      producto: true,
      responsable: true,
    },
  });
}

export const EJECUCIONES_POR_PAGINA = 25;

/** Listado paginado para la vista de tabla — evita cargar todo el dataset en una sola página. */
export async function listarEjecucionesPaginado(pagina: number) {
  const paginaSegura = Math.max(1, pagina);

  const [ejecuciones, total] = await Promise.all([
    prisma.ejecucion.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        campana: { select: { id: true, nombre: true } },
        tienda: { include: { ciudad: true } },
        producto: true,
        responsable: true,
      },
      skip: (paginaSegura - 1) * EJECUCIONES_POR_PAGINA,
      take: EJECUCIONES_POR_PAGINA,
    }),
    prisma.ejecucion.count(),
  ]);

  return {
    ejecuciones,
    total,
    totalPaginas: Math.max(1, Math.ceil(total / EJECUCIONES_POR_PAGINA)),
    pagina: paginaSegura,
  };
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
