import { prisma } from "@/lib/prisma";
import type { TiendaInput } from "./schema";

export function listarTiendas() {
  return prisma.tienda.findMany({
    orderBy: { nombre: "asc" },
    include: { ciudad: true, _count: { select: { ejecuciones: true } } },
  });
}

export function crearTienda(data: TiendaInput) {
  return prisma.tienda.create({ data });
}

export function actualizarTienda(id: number, data: TiendaInput) {
  return prisma.tienda.update({ where: { id }, data });
}

export function eliminarTienda(id: number) {
  return prisma.tienda.delete({ where: { id } });
}
