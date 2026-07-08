import { prisma } from "@/lib/prisma";
import type { ProductoInput } from "./schema";

export function listarProductos() {
  return prisma.producto.findMany({
    orderBy: { nombre: "asc" },
    include: { _count: { select: { ejecuciones: true } } },
  });
}

export function crearProducto(data: ProductoInput) {
  return prisma.producto.create({ data });
}

export function actualizarProducto(id: number, data: ProductoInput) {
  return prisma.producto.update({ where: { id }, data });
}

export function eliminarProducto(id: number) {
  return prisma.producto.delete({ where: { id } });
}
