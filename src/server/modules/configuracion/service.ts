import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

const CONFIG_ID = 1;

const DEFAULTS = {
  pesoIncrementoVentas: 0.4,
  pesoCalidadEjecucion: 0.3,
  pesoCoberturaTiendas: 0.2,
  pesoCumplimientoTiempos: 0.1,
  umbralVerde: 80,
  umbralAmarillo: 60,
};

export async function obtenerConfiguracion() {
  // upsert (no find-then-create) para evitar condiciones de carrera cuando
  // varias recalculaciones de campaña se disparan en paralelo. Con Postgres el
  // upsert en sí puede perder una carrera de creación bajo concurrencia real
  // (dos requests creando la fila a la vez) — si eso pasa, alguien más ya la
  // creó, así que simplemente la leemos.
  try {
    return await prisma.configuracion.upsert({
      where: { id: CONFIG_ID },
      update: {},
      create: { id: CONFIG_ID, ...DEFAULTS },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return prisma.configuracion.findUniqueOrThrow({ where: { id: CONFIG_ID } });
    }
    throw error;
  }
}

export type ActualizarConfiguracionInput = {
  pesoIncrementoVentas: number;
  pesoCalidadEjecucion: number;
  pesoCoberturaTiendas: number;
  pesoCumplimientoTiempos: number;
  umbralVerde: number;
  umbralAmarillo: number;
};

export async function actualizarConfiguracion(
  input: ActualizarConfiguracionInput
) {
  await obtenerConfiguracion();
  return prisma.configuracion.update({
    where: { id: CONFIG_ID },
    data: input,
  });
}
