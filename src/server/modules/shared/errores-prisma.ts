import { Prisma } from "@/generated/prisma/client";

/** Traduce errores comunes de Prisma a mensajes legibles para el usuario. */
export function mensajeDeErrorPrisma(error: unknown, entidad: string): string {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return `Ya existe ${entidad} con ese valor único (revisa los campos marcados como únicos).`;
    }
    if (error.code === "P2003" || error.code === "P2014") {
      return `No se puede eliminar: ${entidad} tiene registros asociados.`;
    }
    if (error.code === "P2025") {
      return `${entidad} ya no existe (puede haber sido eliminado por otra persona).`;
    }
  }
  return error instanceof Error ? error.message : "Ocurrió un error inesperado.";
}
