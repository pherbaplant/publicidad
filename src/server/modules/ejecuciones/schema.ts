import { z } from "zod";
import { optionalString } from "@/server/modules/shared/zod-helpers";

export const ejecucionSchema = z.object({
  campanaId: z.coerce.number().int().positive("Selecciona una campaña"),
  tiendaId: z.coerce.number().int().positive("Selecciona una tienda"),
  productoId: z.coerce.number().int().positive("Selecciona un producto"),
  responsableId: z.coerce.number().int().positive("Selecciona un responsable"),
  inversionAsignada: z.coerce
    .number()
    .nonnegative("La inversión debe ser mayor o igual a 0"),
  ventasAtribuidas: optionalString(z.coerce.number().nonnegative()),
  fechaPlanificada: optionalString(z.coerce.date()),
  fechaEjecucion: optionalString(z.coerce.date()),
});

export type EjecucionInput = z.infer<typeof ejecucionSchema>;
