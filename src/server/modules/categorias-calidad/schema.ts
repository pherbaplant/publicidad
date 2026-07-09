import { z } from "zod";

export const categoriaCalidadSchema = z.object({
  nombre: z.string().trim().min(2, "El nombre es obligatorio (mínimo 2 caracteres)"),
  descripcion: z.string().trim().optional(),
  peso: z.coerce.number().positive("El peso debe ser mayor a 0"),
});

export type CategoriaCalidadInput = z.infer<typeof categoriaCalidadSchema>;
