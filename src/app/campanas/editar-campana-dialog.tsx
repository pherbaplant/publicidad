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
import { actualizarCampanaAction } from "./actions";
import { CampanaCampos } from "./campana-campos";

type Campana = {
  id: number;
  nombre: string;
  objetivo: string | null;
  fechaInicio: Date | string;
  fechaFin: Date | string;
  inversionTotal: number;
  metaVentas: number | null;
  metaTiendas: number | null;
};

export function EditarCampanaDialog({ campana }: { campana: Campana }) {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState(actualizarCampanaAction, ESTADO_INICIAL);

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
          <Button variant="ghost" size="icon" aria-label="Editar campaña">
            <Pencil />
          </Button>
        }
      />
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar campaña</DialogTitle>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="id" value={campana.id} />
          <CampanaCampos
            defaultValues={{
              nombre: campana.nombre,
              objetivo: campana.objetivo,
              fechaInicio: toDateInputValue(campana.fechaInicio),
              fechaFin: toDateInputValue(campana.fechaFin),
              inversionTotal: campana.inversionTotal,
              metaVentas: campana.metaVentas,
              metaTiendas: campana.metaTiendas,
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
