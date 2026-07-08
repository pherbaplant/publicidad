import { prisma } from "@/lib/prisma";
import { obtenerConfiguracion } from "@/server/modules/configuracion/service";
import {
  calcularIndiceDesempeno,
  calcularRoas,
  normalizarScore,
  obtenerSemaforo,
  promedioPonderado,
  type Semaforo,
} from "@/server/modules/calculos/motor";
import type { Prisma } from "@/generated/prisma/client";

export type FiltrosDashboard = {
  campanaId?: number;
  ciudadId?: number;
  productoId?: number;
  responsableId?: number;
  desde?: Date;
  hasta?: Date;
};

export type CampanaCalculada = {
  campanaId: number;
  nombre: string;
  inversion: number;
  ventas: number;
  roas: number | null;
  indiceDesempeno: number;
  semaforo: Semaforo | null;
};

export async function obtenerDatosDashboard(filtros: FiltrosDashboard) {
  const configuracion = await obtenerConfiguracion();

  const where: Prisma.EjecucionWhereInput = {
    campanaId: filtros.campanaId,
    productoId: filtros.productoId,
    responsableId: filtros.responsableId,
    tienda: filtros.ciudadId ? { ciudadId: filtros.ciudadId } : undefined,
    campana:
      filtros.desde || filtros.hasta
        ? {
            fechaFin: filtros.desde ? { gte: filtros.desde } : undefined,
            fechaInicio: filtros.hasta ? { lte: filtros.hasta } : undefined,
          }
        : undefined,
  };

  const ejecuciones = await prisma.ejecucion.findMany({
    where,
    include: {
      campana: true,
      evaluaciones: { include: { categoria: true } },
    },
  });

  const porCampana = new Map<number, typeof ejecuciones>();
  for (const ejecucion of ejecuciones) {
    const grupo = porCampana.get(ejecucion.campanaId) ?? [];
    grupo.push(ejecucion);
    porCampana.set(ejecucion.campanaId, grupo);
  }

  const campanas: CampanaCalculada[] = [...porCampana.entries()].map(
    ([campanaId, ejecucionesCampana]) => {
      const campana = ejecucionesCampana[0].campana;

      let sumVentas = 0;
      let sumInversion = 0;
      const puntajes: { puntaje: number; peso: number }[] = [];
      const tiendas = new Set<number>();
      let conFecha = 0;
      let aTiempo = 0;

      for (const ejecucion of ejecucionesCampana) {
        sumVentas += ejecucion.ventasAtribuidas ?? 0;
        sumInversion += ejecucion.inversionAsignada;
        tiendas.add(ejecucion.tiendaId);

        for (const evaluacion of ejecucion.evaluaciones) {
          puntajes.push({ puntaje: evaluacion.puntaje, peso: evaluacion.categoria.peso });
        }

        if (ejecucion.fechaEjecucion) {
          conFecha += 1;
          const limite = ejecucion.fechaPlanificada ?? campana.fechaFin;
          if (ejecucion.fechaEjecucion <= limite) aTiempo += 1;
        }
      }

      const roas = calcularRoas(sumVentas, sumInversion);
      const scoreIncrementoVentas = normalizarScore(sumVentas, campana.metaVentas);
      const scoreCalidadEjecucion = promedioPonderado(puntajes);
      const scoreCoberturaTiendas = normalizarScore(tiendas.size, campana.metaTiendas);
      const scoreCumplimientoTiempos =
        conFecha > 0 ? (aTiempo / conFecha) * 100 : null;

      const indiceDesempeno = calcularIndiceDesempeno(
        { scoreIncrementoVentas, scoreCalidadEjecucion, scoreCoberturaTiendas, scoreCumplimientoTiempos },
        configuracion
      );

      return {
        campanaId,
        nombre: campana.nombre,
        inversion: sumInversion,
        ventas: sumVentas,
        roas,
        indiceDesempeno,
        semaforo: obtenerSemaforo(indiceDesempeno, configuracion),
      };
    }
  );

  campanas.sort((a, b) => b.indiceDesempeno - a.indiceDesempeno);

  const inversionTotal = campanas.reduce((acc, c) => acc + c.inversion, 0);
  const ventasTotal = campanas.reduce((acc, c) => acc + c.ventas, 0);
  const roasPromedio = inversionTotal > 0 ? ventasTotal / inversionTotal : null;
  const indicePromedio =
    campanas.length > 0
      ? campanas.reduce((acc, c) => acc + c.indiceDesempeno, 0) / campanas.length
      : null;

  const conteoSemaforo = { verde: 0, amarillo: 0, rojo: 0 };
  for (const campana of campanas) {
    if (campana.semaforo) conteoSemaforo[campana.semaforo] += 1;
  }

  return {
    campanas,
    inversionTotal,
    ventasTotal,
    roasPromedio,
    indicePromedio,
    conteoSemaforo,
  };
}
