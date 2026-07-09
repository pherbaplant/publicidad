"use server";

import { revalidatePath } from "next/cache";
import { categoriaCalidadSchema } from "@/server/modules/categorias-calidad/schema";
import {
  crearCategoriaCalidad,
  actualizarCategoriaCalidad,
  eliminarCategoriaCalidad,
} from "@/server/modules/categorias-calidad/service";
import {
  erroresDeZod,
  type ActionState,
} from "@/server/modules/shared/action-state";
import { mensajeDeErrorPrisma } from "@/server/modules/shared/errores-prisma";

function datosDelForm(formData: FormData) {
  return {
    nombre: formData.get("nombre"),
    descripcion: formData.get("descripcion"),
    peso: formData.get("peso"),
  };
}

export async function crearCategoriaCalidadAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = categoriaCalidadSchema.safeParse(datosDelForm(formData));
  if (!parsed.success) return { success: false, errors: erroresDeZod(parsed.error) };

  try {
    await crearCategoriaCalidad(parsed.data);
  } catch (error) {
    return {
      success: false,
      message: mensajeDeErrorPrisma(error, "una categoría de calidad"),
    };
  }

  revalidatePath("/categorias-calidad");
  return { success: true, message: "Categoría creada correctamente." };
}

export async function actualizarCategoriaCalidadAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const id = Number(formData.get("id"));
  const parsed = categoriaCalidadSchema.safeParse(datosDelForm(formData));
  if (!parsed.success) return { success: false, errors: erroresDeZod(parsed.error) };

  try {
    await actualizarCategoriaCalidad(id, parsed.data);
  } catch (error) {
    return {
      success: false,
      message: mensajeDeErrorPrisma(error, "la categoría de calidad"),
    };
  }

  revalidatePath("/categorias-calidad");
  return { success: true, message: "Categoría actualizada." };
}

export async function eliminarCategoriaCalidadAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const id = Number(formData.get("id"));

  try {
    await eliminarCategoriaCalidad(id);
  } catch (error) {
    return {
      success: false,
      message: mensajeDeErrorPrisma(error, "la categoría de calidad"),
    };
  }

  revalidatePath("/categorias-calidad");
  return { success: true, message: "Categoría eliminada." };
}
