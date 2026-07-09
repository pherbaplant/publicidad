import { z } from "zod";

export const tiendaSchema = z.object({
  nombre: z.string().trim().min(2, "El nombre es obligatorio (mínimo 2 caracteres)"),
  formato: z.string().trim().optional(),
  ciudadId: z.coerce.number().int().positive("Selecciona una ciudad"),
});

export type TiendaInput = z.infer<typeof tiendaSchema>;
