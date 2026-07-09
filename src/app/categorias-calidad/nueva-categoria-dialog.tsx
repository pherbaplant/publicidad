"use client";

import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
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
import { crearCategoriaCalidadAction } from "./actions";

export function NuevaCategoriaDialog() {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState(
    crearCategoriaCalidadAction,
    ESTADO_INICIAL
  );

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
          <Button>
            <Plus /> Nueva categoría
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nueva categoría de calidad</DialogTitle>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre</Label>
            <Input id="nombre" name="nombre" placeholder="Ej. Exhibición correcta" required />
            {state.errors?.nombre ? (
              <p className="text-sm text-destructive">{state.errors.nombre[0]}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              name="descripcion"
              placeholder="Qué se evalúa en esta categoría"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="peso">Peso dentro del checklist</Label>
            <Input id="peso" name="peso" type="number" step="0.1" min="0.1" defaultValue="1" required />
            {state.errors?.peso ? (
              <p className="text-sm text-destructive">{state.errors.peso[0]}</p>
            ) : null}
          </div>
          <DialogFooter>
            <SubmitButton>Crear</SubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
