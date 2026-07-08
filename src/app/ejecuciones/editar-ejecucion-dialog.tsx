"use client";

import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { toDateInputValue } from "@/lib/format";
import { actualizarEjecucionAction } from "./actions";
import { EjecucionCampos, type EjecucionOpciones } from "./ejecucion-campos";

type Ejecucion = {
  id: number;
  campanaId: number;
  tiendaId: number;
  productoId: number;
  responsableId: number;
  inversionAsignada: number;
  ventasAtribuidas: number | null;
  fechaPlanificada: Date | string | null;
  fechaEjecucion: Date | string | null;
};

export function EditarEjecucionDialog({
  ejecucion,
  opciones,
}: {
  ejecucion: Ejecucion;
  opciones: EjecucionOpciones;
}) {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState(actualizarEjecucionAction, ESTADO_INICIAL);

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
      setOpen(false);
    } else if (state.message) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="ghost" size="icon" aria-label="Editar ejecución">
            <Pencil />
          </Button>
        }
      />
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar ejecución</DialogTitle>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="id" value={ejecucion.id} />
          <EjecucionCampos
            opciones={opciones}
            defaultValues={{
              campanaId: ejecucion.campanaId,
              tiendaId: ejecucion.tiendaId,
              productoId: ejecucion.productoId,
              responsableId: ejecucion.responsableId,
              inversionAsignada: ejecucion.inversionAsignada,
              ventasAtribuidas: ejecucion.ventasAtribuidas,
              fechaPlanificada: toDateInputValue(ejecucion.fechaPlanificada),
              fechaEjecucion: toDateInputValue(ejecucion.fechaEjecucion),
            }}
            errors={state.errors}
          />
          <DialogFooter>
            <SubmitButton>Guardar cambios</SubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
