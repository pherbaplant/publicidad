import { prisma } from "@/lib/prisma";
import type { ResponsableInput } from "./schema";

function normalizar(data: ResponsableInput) {
  return { ...data, email: data.email ? data.email : null };
}

export function listarResponsables() {
  return prisma.responsable.findMany({
    orderBy: { nombre: "asc" },
    include: { _count: { select: { ejecuciones: true } } },
  });
}

export function crearResponsable(data: ResponsableInput) {
  return prisma.responsable.create({ data: normalizar(data) });
}

export function actualizarResponsable(id: number, data: ResponsableInput) {
  return prisma.responsable.update({ where: { id }, data: normalizar(data) });
}

export function eliminarResponsable(id: number) {
  return prisma.responsable.delete({ where: { id } });
}
