"use server";

import { revalidatePath } from "next/cache";
import { campanaSchema } from "@/server/modules/campanas/schema";
import {
  crearCampana,
  actualizarCampana,
  eliminarCampana,
} from "@/server/modules/campanas/service";
import {
  erroresDeZod,
  type ActionState,
} from "@/server/modules/shared/action-state";
import { mensajeDeErrorPrisma } from "@/server/modules/shared/errores-prisma";

function datosDelForm(formData: FormData) {
  return {
    nombre: formData.get("nombre"),
    objetivo: formData.get("objetivo"),
    fechaInicio: formData.get("fechaInicio"),
    fechaFin: formData.get("fechaFin"),
    inversionTotal: formData.get("inversionTotal"),
    metaVentas: formData.get("metaVentas"),
    metaTiendas: formData.get("metaTiendas"),
  };
}

export async function crearCampanaAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = campanaSchema.safeParse(datosDelForm(formData));
  if (!parsed.success) return { success: false, errors: erroresDeZod(parsed.error) };

  try {
    await crearCampana(parsed.data);
  } catch (error) {
    return { success: false, message: mensajeDeErrorPrisma(error, "una campaña") };
  }

  revalidatePath("/campanas");
  revalidatePath("/");
  return { success: true, message: "Campaña creada correctamente." };
}

export async function actualizarCampanaAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const id = Number(formData.get("id"));
  const parsed = campanaSchema.safeParse(datosDelForm(formData));
  if (!parsed.success) return { success: false, errors: erroresDeZod(parsed.error) };

  try {
    await actualizarCampana(id, parsed.data);
  } catch (error) {
    return { success: false, message: mensajeDeErrorPrisma(error, "la campaña") };
  }

  revalidatePath("/campanas");
  revalidatePath(`/campanas/${id}`);
  revalidatePath("/");
  return { success: true, message: "Campaña actualizada." };
}

export async function eliminarCampanaAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const id = Number(formData.get("id"));

  try {
    await eliminarCampana(id);
  } catch (error) {
    return { success: false, message: mensajeDeErrorPrisma(error, "la campaña") };
  }

  revalidatePath("/campanas");
  revalidatePath("/");
  return { success: true, message: "Campaña eliminada." };
}
