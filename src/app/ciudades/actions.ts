"use server";

import { revalidatePath } from "next/cache";
import { ciudadSchema } from "@/server/modules/ciudades/schema";
import {
  crearCiudad,
  actualizarCiudad,
  eliminarCiudad,
} from "@/server/modules/ciudades/service";
import {
  erroresDeZod,
  type ActionState,
} from "@/server/modules/shared/action-state";
import { mensajeDeErrorPrisma } from "@/server/modules/shared/errores-prisma";

export async function crearCiudadAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = ciudadSchema.safeParse({ nombre: formData.get("nombre") });
  if (!parsed.success) {
    return { success: false, errors: erroresDeZod(parsed.error) };
  }

  try {
    await crearCiudad(parsed.data);
  } catch (error) {
    return { success: false, message: mensajeDeErrorPrisma(error, "una ciudad") };
  }

  revalidatePath("/ciudades");
  return { success: true, message: "Ciudad creada correctamente." };
}

export async function actualizarCiudadAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const id = Number(formData.get("id"));
  const parsed = ciudadSchema.safeParse({ nombre: formData.get("nombre") });
  if (!parsed.success) {
    return { success: false, errors: erroresDeZod(parsed.error) };
  }

  try {
    await actualizarCiudad(id, parsed.data);
  } catch (error) {
    return { success: false, message: mensajeDeErrorPrisma(error, "la ciudad") };
  }

  revalidatePath("/ciudades");
  return { success: true, message: "Ciudad actualizada." };
}

export async function eliminarCiudadAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const id = Number(formData.get("id"));

  try {
    await eliminarCiudad(id);
  } catch (error) {
    return { success: false, message: mensajeDeErrorPrisma(error, "la ciudad") };
  }

  revalidatePath("/ciudades");
  return { success: true, message: "Ciudad eliminada." };
}
