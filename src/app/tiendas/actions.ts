"use server";

import { revalidatePath } from "next/cache";
import { tiendaSchema } from "@/server/modules/tiendas/schema";
import {
  crearTienda,
  actualizarTienda,
  eliminarTienda,
} from "@/server/modules/tiendas/service";
import {
  erroresDeZod,
  type ActionState,
} from "@/server/modules/shared/action-state";
import { mensajeDeErrorPrisma } from "@/server/modules/shared/errores-prisma";

function datosDelForm(formData: FormData) {
  return {
    nombre: formData.get("nombre"),
    formato: formData.get("formato"),
    ciudadId: formData.get("ciudadId"),
  };
}

export async function crearTiendaAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = tiendaSchema.safeParse(datosDelForm(formData));
  if (!parsed.success) return { success: false, errors: erroresDeZod(parsed.error) };

  try {
    await crearTienda(parsed.data);
  } catch (error) {
    return { success: false, message: mensajeDeErrorPrisma(error, "una tienda") };
  }

  revalidatePath("/tiendas");
  return { success: true, message: "Tienda creada correctamente." };
}

export async function actualizarTiendaAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const id = Number(formData.get("id"));
  const parsed = tiendaSchema.safeParse(datosDelForm(formData));
  if (!parsed.success) return { success: false, errors: erroresDeZod(parsed.error) };

  try {
    await actualizarTienda(id, parsed.data);
  } catch (error) {
    return { success: false, message: mensajeDeErrorPrisma(error, "la tienda") };
  }

  revalidatePath("/tiendas");
  return { success: true, message: "Tienda actualizada." };
}

export async function eliminarTiendaAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const id = Number(formData.get("id"));

  try {
    await eliminarTienda(id);
  } catch (error) {
    return { success: false, message: mensajeDeErrorPrisma(error, "la tienda") };
  }

  revalidatePath("/tiendas");
  return { success: true, message: "Tienda eliminada." };
}
