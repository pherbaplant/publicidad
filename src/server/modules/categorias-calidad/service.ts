import { prisma } from "@/lib/prisma";
import type { CategoriaCalidadInput } from "./schema";

export function listarCategoriasCalidad() {
  return prisma.categoriaCalidad.findMany({
    orderBy: { nombre: "asc" },
    include: { _count: { select: { evaluaciones: true } } },
  });
}

export function crearCategoriaCalidad(data: CategoriaCalidadInput) {
  return prisma.categoriaCalidad.create({ data });
}

export function actualizarCategoriaCalidad(
  id: number,
  data: CategoriaCalidadInput
) {
  return prisma.categoriaCalidad.update({ where: { id }, data });
}

export function eliminarCategoriaCalidad(id: number) {
  return prisma.categoriaCalidad.delete({ where: { id } });
}
