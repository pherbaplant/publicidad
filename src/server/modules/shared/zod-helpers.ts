import { z } from "zod";

/**
 * Convierte un campo de FormData vacío ("") en `undefined` antes de validar,
 * y marca el schema resultante como opcional — necesario porque `z.preprocess`
 * aplica el schema interno directamente sobre `undefined` (p. ej. `z.coerce.date()`
 * intentaría parsear `undefined` y fallaría) en vez de saltarse la validación.
 */
export function optionalString<T extends z.ZodTypeAny>(schema: T) {
  return z.preprocess((v) => (v === "" || v == null ? undefined : v), schema.optional());
}
