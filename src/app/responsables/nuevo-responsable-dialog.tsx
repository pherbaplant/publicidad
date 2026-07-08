"use client";

import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { crearResponsableAction } from "./actions";

export function NuevoResponsableDialog() {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState(crearResponsableAction, ESTADO_INICIAL);

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
            <Plus /> Nuevo responsable
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nuevo responsable</DialogTitle>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre</Label>
            <Input id="nombre" name="nombre" placeholder="Ej. María Pérez" required />
            {state.errors?.nombre ? (
              <p className="text-sm text-destructive">{state.errors.nombre[0]}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Correo</Label>
            <Input id="email" name="email" type="email" placeholder="maria.perez@farmatodo.com" />
            {state.errors?.email ? (
              <p className="text-sm text-destructive">{state.errors.email[0]}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="rol">Rol</Label>
            <Input id="rol" name="rol" placeholder="Ej. Coordinador de mercadeo" />
          </div>
          <DialogFooter>
            <SubmitButton>Crear</SubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
