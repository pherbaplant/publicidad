import { z } from "zod";

/** Convierte un campo de FormData vacío ("") en `undefined` antes de validar. */
export function optionalString<T extends z.ZodTypeAny>(schema: T) {
  return z.preprocess((v) => (v === "" || v == null ? undefined : v), schema);
}
