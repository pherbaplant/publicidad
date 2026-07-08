import { prisma } from "@/lib/prisma";
import { recalcularCampana } from "@/server/modules/calculos/recompute";
import { guardarEvidencia } from "@/server/modules/shared/upload";
import type { EvaluacionCalidadInput } from "./schema";

async function campanaDeEjecucion(ejecucionId: number) {
  const ejecucion = await prisma.ejecucion.findUniqueOrThrow({
    where: { id: ejecucionId },
    select: { campanaId: true },
  });
  return ejecucion.campanaId;
}

/** Crea o actualiza la calificación de una categoría para una Ejecución (upsert). */
export async function guardarEvaluacionCalidad(
  data: EvaluacionCalidadInput,
  fotos: File[]
) {
  const evaluacion = await prisma.evaluacionCalidad.upsert({
    where: {
      ejecucionId_categoriaId: {
        ejecucionId: data.ejecucionId,
        categoriaId: data.categoriaId,
      },
    },
    create: {
      ejecucionId: data.ejecucionId,
      categoriaId: data.categoriaId,
      puntaje: data.puntaje,
      comentario: data.comentario ?? null,
    },
    update: {
      puntaje: data.puntaje,
      comentario: data.comentario ?? null,
    },
  });

  const fotosValidas = fotos.filter((f) => f.size > 0);
  if (fotosValidas.length > 0) {
    const rutas = await Promise.all(fotosValidas.map(guardarEvidencia));
    await prisma.evidenciaFotografica.createMany({
      data: rutas.map((rutaArchivo) => ({
        evaluacionId: evaluacion.id,
        rutaArchivo,
      })),
    });
  }

  const campanaId = await campanaDeEjecucion(data.ejecucionId);
  await recalcularCampana(campanaId);

  return evaluacion;
}

export async function eliminarEvaluacionCalidad(id: number) {
  const evaluacion = await prisma.evaluacionCalidad.delete({
    where: { id },
    include: { ejecucion: { select: { campanaId: true } } },
  });
  await recalcularCampana(evaluacion.ejecucion.campanaId);
  return evaluacion;
}
