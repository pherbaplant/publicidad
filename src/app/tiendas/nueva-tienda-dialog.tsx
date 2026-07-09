"use client";

import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { itemsDesdeLista } from "@/lib/select-items";
import { crearTiendaAction } from "./actions";

export function NuevaTiendaDialog({
  ciudades,
}: {
  ciudades: { id: number; nombre: string }[];
}) {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState(crearTiendaAction, ESTADO_INICIAL);

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
            <Plus /> Nueva tienda
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nueva tienda</DialogTitle>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre</Label>
            <Input id="nombre" name="nombre" placeholder="Ej. Farmatodo Sabana Grande" required />
            {state.errors?.nombre ? (
              <p className="text-sm text-destructive">{state.errors.nombre[0]}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="formato">Formato</Label>
            <Input id="formato" name="formato" placeholder="Ej. Estándar, Express" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ciudadId">Ciudad</Label>
            <Select name="ciudadId" required items={itemsDesdeLista(ciudades)}>
              <SelectTrigger id="ciudadId" className="w-full">
                <SelectValue placeholder="Selecciona una ciudad" />
              </SelectTrigger>
              <SelectContent>
                {ciudades.map((ciudad) => (
                  <SelectItem key={ciudad.id} value={String(ciudad.id)}>
                    {ciudad.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {state.errors?.ciudadId ? (
              <p className="text-sm text-destructive">{state.errors.ciudadId[0]}</p>
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
