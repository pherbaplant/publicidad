import { prisma } from "@/lib/prisma";
import type { CiudadInput } from "./schema";

export function listarCiudades() {
  return prisma.ciudad.findMany({
    orderBy: { nombre: "asc" },
    include: { _count: { select: { tiendas: true } } },
  });
}

/** Lista liviana (solo id + nombre) para poblar selects — evita el _count al no necesitarlo. */
export function listarCiudadesOpciones() {
  return prisma.ciudad.findMany({
    orderBy: { nombre: "asc" },
    select: { id: true, nombre: true },
  });
}

export function crearCiudad(data: CiudadInput) {
  return prisma.ciudad.create({ data });
}

export function actualizarCiudad(id: number, data: CiudadInput) {
  return prisma.ciudad.update({ where: { id }, data });
}

export function eliminarCiudad(id: number) {
  return prisma.ciudad.delete({ where: { id } });
}
