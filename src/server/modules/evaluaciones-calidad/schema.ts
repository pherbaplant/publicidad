import { z } from "zod";
import { optionalString } from "@/server/modules/shared/zod-helpers";

export const evaluacionCalidadSchema = z.object({
  ejecucionId: z.coerce.number().int().positive(),
  categoriaId: z.coerce.number().int().positive("Selecciona una categoría"),
  puntaje: z.coerce
    .number()
    .min(0, "El puntaje mínimo es 0")
    .max(100, "El puntaje máximo es 100"),
  comentario: optionalString(z.string().trim()),
});

export type EvaluacionCalidadInput = z.infer<typeof evaluacionCalidadSchema>;
