import { z } from "zod";
import { optionalString } from "@/server/modules/shared/zod-helpers";

export const campanaSchema = z
  .object({
    nombre: z.string().trim().min(2, "El nombre es obligatorio (mínimo 2 caracteres)"),
    objetivo: z.string().trim().optional(),
    fechaInicio: z.coerce.date({ message: "Fecha de inicio inválida" }),
    fechaFin: z.coerce.date({ message: "Fecha de fin inválida" }),
    inversionTotal: z.coerce
      .number()
      .nonnegative("La inversión debe ser mayor o igual a 0"),
    metaVentas: optionalString(z.coerce.number().nonnegative()),
    metaTiendas: optionalString(z.coerce.number().int().positive()),
  })
  .refine((data) => data.fechaFin >= data.fechaInicio, {
    message: "La fecha de fin debe ser posterior o igual a la fecha de inicio",
    path: ["fechaFin"],
  });

export type CampanaInput = z.infer<typeof campanaSchema>;
