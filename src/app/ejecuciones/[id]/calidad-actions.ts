"use server";

import { revalidatePath } from "next/cache";
import { evaluacionCalidadSchema } from "@/server/modules/evaluaciones-calidad/schema";
import {
  guardarEvaluacionCalidad,
  eliminarEvaluacionCalidad,
} from "@/server/modules/evaluaciones-calidad/service";
import {
  erroresDeZod,
  type ActionState,
} from "@/server/modules/shared/action-state";
import { mensajeDeErrorPrisma } from "@/server/modules/shared/errores-prisma";

function revalidarRelacionados(ejecucionId: number) {
  revalidatePath(`/ejecuciones/${ejecucionId}`);
  revalidatePath("/ejecuciones");
  revalidatePath("/campanas");
  revalidatePath("/");
}

export async function guardarEvaluacionAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = evaluacionCalidadSchema.safeParse({
    ejecucionId: formData.get("ejecucionId"),
    categoriaId: formData.get("categoriaId"),
    puntaje: formData.get("puntaje"),
    comentario: formData.get("comentario"),
  });
  if (!parsed.success) return { success: false, errors: erroresDeZod(parsed.error) };

  const fotos = formData.getAll("fotos").filter((f): f is File => f instanceof File);

  try {
    await guardarEvaluacionCalidad(parsed.data, fotos);
  } catch (error) {
    return {
      success: false,
      message: mensajeDeErrorPrisma(error, "la evaluación de calidad"),
    };
  }

  revalidarRelacionados(parsed.data.ejecucionId);
  return { success: true, message: "Evaluación de calidad guardada." };
}

export async function eliminarEvaluacionAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const id = Number(formData.get("id"));
  const ejecucionId = Number(formData.get("ejecucionId"));

  try {
    await eliminarEvaluacionCalidad(id);
  } catch (error) {
    return {
      success: false,
      message: mensajeDeErrorPrisma(error, "la evaluación de calidad"),
    };
  }

  revalidarRelacionados(ejecucionId);
  return { success: true, message: "Evaluación eliminada." };
}
