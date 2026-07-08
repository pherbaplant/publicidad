"use server";

import { revalidatePath } from "next/cache";
import { productoSchema } from "@/server/modules/productos/schema";
import {
  crearProducto,
  actualizarProducto,
  eliminarProducto,
} from "@/server/modules/productos/service";
import {
  erroresDeZod,
  type ActionState,
} from "@/server/modules/shared/action-state";
import { mensajeDeErrorPrisma } from "@/server/modules/shared/errores-prisma";

function datosDelForm(formData: FormData) {
  return {
    nombre: formData.get("nombre"),
    marca: formData.get("marca"),
  };
}

export async function crearProductoAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = productoSchema.safeParse(datosDelForm(formData));
  if (!parsed.success) return { success: false, errors: erroresDeZod(parsed.error) };

  try {
    await crearProducto(parsed.data);
  } catch (error) {
    return { success: false, message: mensajeDeErrorPrisma(error, "un producto") };
  }

  revalidatePath("/productos");
  return { success: true, message: "Producto creado correctamente." };
}

export async function actualizarProductoAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const id = Number(formData.get("id"));
  const parsed = productoSchema.safeParse(datosDelForm(formData));
  if (!parsed.success) return { success: false, errors: erroresDeZod(parsed.error) };

  try {
    await actualizarProducto(id, parsed.data);
  } catch (error) {
    return { success: false, message: mensajeDeErrorPrisma(error, "el producto") };
  }

  revalidatePath("/productos");
  return { success: true, message: "Producto actualizado." };
}

export async function eliminarProductoAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const id = Number(formData.get("id"));

  try {
    await eliminarProducto(id);
  } catch (error) {
    return { success: false, message: mensajeDeErrorPrisma(error, "el producto") };
  }

  revalidatePath("/productos");
  return { success: true, message: "Producto eliminado." };
}
