import { z } from "zod";

export const productoSchema = z.object({
  nombre: z.string().trim().min(2, "El nombre es obligatorio (mínimo 2 caracteres)"),
  marca: z.string().trim().optional(),
});

export type ProductoInput = z.infer<typeof productoSchema>;
