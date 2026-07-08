import { prisma } from "@/lib/prisma";
import { obtenerConfiguracion } from "@/server/modules/configuracion/service";
import {
  calcularIndiceDesempeno,
  calcularRoas,
  normalizarScore,
  promedioPonderado,
} from "./motor";

/**
 * Recalcula ROAS y scores de calidad por Ejecución, y agrega los 4 componentes
 * del Índice de Desempeño a nivel de Campaña. Se invoca cada vez que se
 * crea/edita/elimina una Ejecución o una Evaluación de Calidad.
 */
export async function recalcularCampana(campanaId: number) {
  const campana = await prisma.campana.findUniqueOrThrow({
    where: { id: campanaId },
    include: {
      ejecuciones: {
        include: { evaluaciones: { include: { categoria: true } } },
      },
    },
  });

  const configuracion = await obtenerConfiguracion();

  let sumVentas = 0;
  let sumInversion = 0;
  const puntajesCalidadCampana: { puntaje: number; peso: number }[] = [];
  const tiendasEjecutadas = new Set<number>();
  let ejecucionesConFecha = 0;
  let ejecucionesATiempo = 0;

  for (const ejecucion of campana.ejecuciones) {
    const roas = calcularRoas(ejecucion.ventasAtribuidas, ejecucion.inversionAsignada);
    const scoreCalidad = promedioPonderado(
      ejecucion.evaluaciones.map((e) => ({
        puntaje: e.puntaje,
        peso: e.categoria.peso,
      }))
    );

    if (roas !== ejecucion.roas || scoreCalidad !== ejecucion.scoreCalidad) {
      await prisma.ejecucion.update({
        where: { id: ejecucion.id },
        data: { roas, scoreCalidad },
      });
    }

    sumVentas += ejecucion.ventasAtribuidas ?? 0;
    sumInversion += ejecucion.inversionAsignada;
    tiendasEjecutadas.add(ejecucion.tiendaId);

    for (const evaluacion of ejecucion.evaluaciones) {
      puntajesCalidadCampana.push({
        puntaje: evaluacion.puntaje,
        peso: evaluacion.categoria.peso,
      });
    }

    if (ejecucion.fechaEjecucion) {
      ejecucionesConFecha += 1;
      const limite = ejecucion.fechaPlanificada ?? campana.fechaFin;
      if (ejecucion.fechaEjecucion <= limite) ejecucionesATiempo += 1;
    }
  }

  const roas = sumInversion > 0 ? sumVentas / sumInversion : null;
  const scoreIncrementoVentas = normalizarScore(sumVentas, campana.metaVentas);
  const scoreCalidadEjecucion = promedioPonderado(puntajesCalidadCampana);
  const scoreCoberturaTiendas = normalizarScore(
    tiendasEjecutadas.size,
    campana.metaTiendas
  );
  const scoreCumplimientoTiempos =
    ejecucionesConFecha > 0
      ? (ejecucionesATiempo / ejecucionesConFecha) * 100
      : null;

  const indiceDesempeno = calcularIndiceDesempeno(
    {
      scoreIncrementoVentas,
      scoreCalidadEjecucion,
      scoreCoberturaTiendas,
      scoreCumplimientoTiempos,
    },
    configuracion
  );

  return prisma.campana.update({
    where: { id: campanaId },
    data: {
      roas,
      scoreIncrementoVentas,
      scoreCalidadEjecucion,
      scoreCoberturaTiendas,
      scoreCumplimientoTiempos,
      indiceDesempeno,
    },
  });
}

/** Se invoca al cambiar los pesos/umbrales globales en Configuracion. */
export async function recalcularIndiceDeTodasLasCampanas() {
  const configuracion = await obtenerConfiguracion();
  const campanas = await prisma.campana.findMany({ select: { id: true, scoreIncrementoVentas: true, scoreCalidadEjecucion: true, scoreCoberturaTiendas: true, scoreCumplimientoTiempos: true } });

  await Promise.all(
    campanas.map((campana) =>
      prisma.campana.update({
        where: { id: campana.id },
        data: {
          indiceDesempeno: calcularIndiceDesempeno(campana, configuracion),
        },
      })
    )
  );
}
