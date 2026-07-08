import { z } from "zod";

export const responsableSchema = z.object({
  nombre: z.string().trim().min(2, "El nombre es obligatorio (mínimo 2 caracteres)"),
  email: z
    .union([z.string().trim().email("Correo inválido"), z.literal("")])
    .optional(),
  rol: z.string().trim().optional(),
});

export type ResponsableInput = z.infer<typeof responsableSchema>;
