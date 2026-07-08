import type { ZodError } from "zod";

export type ActionState = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

export const ESTADO_INICIAL: ActionState = { success: false };

export function erroresDeZod(error: ZodError<unknown>): Record<string, string[]> {
  const flat = error.flatten((issue) => issue.message) as {
    fieldErrors: Record<string, string[] | undefined>;
    formErrors: string[];
  };

  const errores: Record<string, string[]> = {};
  for (const [campo, mensajes] of Object.entries(flat.fieldErrors)) {
    if (mensajes) errores[campo] = mensajes;
  }
  if (flat.formErrors.length > 0) errores._form = flat.formErrors;
  return errores;
}
