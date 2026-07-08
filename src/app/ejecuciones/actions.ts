"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ejecucionSchema } from "@/server/modules/ejecuciones/schema";
import {
  crearEjecucion,
  actualizarEjecucion,
  eliminarEjecucion,
} from "@/server/modules/ejecuciones/service";
import {
  erroresDeZod,
  type ActionState,
} from "@/server/modules/shared/action-state";
import { mensajeDeErrorPrisma } from "@/server/modules/shared/errores-prisma";

function datosDelForm(formData: FormData) {
  return {
    campanaId: formData.get("campanaId"),
    tiendaId: formData.get("tiendaId"),
    productoId: formData.get("productoId"),
    responsableId: formData.get("responsableId"),
    inversionAsignada: formData.get("inversionAsignada"),
    ventasAtribuidas: formData.get("ventasAtribuidas"),
    fechaPlanificada: formData.get("fechaPlanificada"),
    fechaEjecucion: formData.get("fechaEjecucion"),
  };
}

function revalidarRelacionados(campanaId: number, ejecucionId?: number) {
  revalidatePath("/ejecuciones");
  revalidatePath(`/campanas/${campanaId}`);
  revalidatePath("/campanas");
  revalidatePath("/");
  if (ejecucionId) revalidatePath(`/ejecuciones/${ejecucionId}`);
}

export async function crearEjecucionAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = ejecucionSchema.safeParse(datosDelForm(formData));
  if (!parsed.success) return { success: false, errors: erroresDeZod(parsed.error) };

  let ejecucionId: number;
  try {
    const ejecucion = await crearEjecucion(parsed.data);
    ejecucionId = ejecucion.id;
  } catch (error) {
    return {
      success: false,
      message: mensajeDeErrorPrisma(error, "una ejecución para esa combinación"),
    };
  }

  revalidarRelacionados(parsed.data.campanaId, ejecucionId);
  redirect(`/ejecuciones/${ejecucionId}`);
}

export async function actualizarEjecucionAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const id = Number(formData.get("id"));
  const parsed = ejecucionSchema.safeParse(datosDelForm(formData));
  if (!parsed.success) return { success: false, errors: erroresDeZod(parsed.error) };

  try {
    await actualizarEjecucion(id, parsed.data);
  } catch (error) {
    return { success: false, message: mensajeDeErrorPrisma(error, "la ejecución") };
  }

  revalidarRelacionados(parsed.data.campanaId, id);
  return { success: true, message: "Ejecución actualizada." };
}

export async function eliminarEjecucionAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const id = Number(formData.get("id"));

  try {
    const ejecucion = await eliminarEjecucion(id);
    revalidarRelacionados(ejecucion.campanaId);
  } catch (error) {
    return { success: false, message: mensajeDeErrorPrisma(error, "la ejecución") };
  }

  return { success: true, message: "Ejecución eliminada." };
}
