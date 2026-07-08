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
  // varias recalculaciones de campaña se disparan en paralelo.
  return prisma.configuracion.upsert({
    where: { id: CONFIG_ID },
    update: {},
    create: { id: CONFIG_ID, ...DEFAULTS },
  });
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
