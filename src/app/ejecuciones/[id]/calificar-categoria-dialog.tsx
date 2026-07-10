"use client";

import { useActionState, useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SubmitButton } from "@/components/submit-button";
import { ESTADO_INICIAL } from "@/server/modules/shared/action-state";
import { guardarEvaluacionAction } from "./calidad-actions";

type EvaluacionExistente = {
  puntaje: number;
  comentario: string | null;
  evidencias: { id: number; rutaArchivo: string }[];
};

export function CalificarCategoriaDialog({
  ejecucionId,
  categoria,
  evaluacionExistente,
}: {
  ejecucionId: number;
  categoria: { id: number; nombre: string; descripcion: string | null };
  evaluacionExistente?: EvaluacionExistente;
}) {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState(guardarEvaluacionAction, ESTADO_INICIAL);

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
      setOpen(false);
    } else if (state.message) {
      toast.error(state.message);
    }
  }, [state]);

  const idBase = `categoria-${categoria.id}`;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant={evaluacionExistente ? "outline" : "default"} size="sm">
            {evaluacionExistente ? "Editar calificación" : "Calificar"}
          </Button>
        }
      />
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{categoria.nombre}</DialogTitle>
        </DialogHeader>
        {categoria.descripcion ? (
          <p className="-mt-2 text-sm text-muted-foreground">{categoria.descripcion}</p>
        ) : null}
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="ejecucionId" value={ejecucionId} />
          <input type="hidden" name="categoriaId" value={categoria.id} />

          <div className="space-y-2">
            <Label htmlFor={`puntaje-${idBase}`}>Puntaje (0-100)</Label>
            <Input
              id={`puntaje-${idBase}`}
              name="puntaje"
              type="number"
              min="0"
              max="100"
              defaultValue={evaluacionExistente?.puntaje}
              required
            />
            {state.errors?.puntaje ? (
              <p className="text-sm text-destructive">{state.errors.puntaje[0]}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor={`comentario-${idBase}`}>Comentario</Label>
            <Textarea
              id={`comentario-${idBase}`}
              name="comentario"
              defaultValue={evaluacionExistente?.comentario ?? ""}
              placeholder="Observaciones sobre el cumplimiento en tienda"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`fotos-${idBase}`}>Evidencia fotográfica</Label>
            <Input
              id={`fotos-${idBase}`}
              name="fotos"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              multiple
            />
          </div>

          {evaluacionExistente && evaluacionExistente.evidencias.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {evaluacionExistente.evidencias.map((evidencia) => (
                <Image
                  key={evidencia.id}
                  src={
                    evidencia.rutaArchivo.startsWith("http")
                      ? evidencia.rutaArchivo
                      : `/api/uploads/${evidencia.rutaArchivo}`
                  }
                  alt="Evidencia de ejecución"
                  width={64}
                  height={64}
                  className="size-16 rounded-md border object-cover"
                  unoptimized
                />
              ))}
            </div>
          ) : null}

          <DialogFooter>
            <SubmitButton>Guardar</SubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
