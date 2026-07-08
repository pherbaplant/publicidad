import { z } from "zod";

export const ciudadSchema = z.object({
  nombre: z.string().trim().min(2, "El nombre es obligatorio (mínimo 2 caracteres)"),
});

export type CiudadInput = z.infer<typeof ciudadSchema>;
