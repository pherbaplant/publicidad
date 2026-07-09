"use server";

import { revalidatePath } from "next/cache";
import { responsableSchema } from "@/server/modules/responsables/schema";
import {
  crearResponsable,
  actualizarResponsable,
  eliminarResponsable,
} from "@/server/modules/responsables/service";
import {
  erroresDeZod,
  type ActionState,
} from "@/server/modules/shared/action-state";
import { mensajeDeErrorPrisma } from "@/server/modules/shared/errores-prisma";

function datosDelForm(formData: FormData) {
  return {
    nombre: formData.get("nombre"),
    email: formData.get("email"),
    rol: formData.get("rol"),
  };
}

export async function crearResponsableAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = responsableSchema.safeParse(datosDelForm(formData));
  if (!parsed.success) return { success: false, errors: erroresDeZod(parsed.error) };

  try {
    await crearResponsable(parsed.data);
  } catch (error) {
    return { success: false, message: mensajeDeErrorPrisma(error, "un responsable") };
  }

  revalidatePath("/responsables");
  return { success: true, message: "Responsable creado correctamente." };
}

export async function actualizarResponsableAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const id = Number(formData.get("id"));
  const parsed = responsableSchema.safeParse(datosDelForm(formData));
  if (!parsed.success) return { success: false, errors: erroresDeZod(parsed.error) };

  try {
    await actualizarResponsable(id, parsed.data);
  } catch (error) {
    return { success: false, message: mensajeDeErrorPrisma(error, "el responsable") };
  }

  revalidatePath("/responsables");
  return { success: true, message: "Responsable actualizado." };
}

export async function eliminarResponsableAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const id = Number(formData.get("id"));

  try {
    await eliminarResponsable(id);
  } catch (error) {
    return { success: false, message: mensajeDeErrorPrisma(error, "el responsable") };
  }

  revalidatePath("/responsables");
  return { success: true, message: "Responsable eliminado." };
}
