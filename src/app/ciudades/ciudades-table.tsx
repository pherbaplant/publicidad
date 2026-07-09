"use client";

import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { Pencil, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SubmitButton } from "@/components/submit-button";
import { ConfirmDeleteButton } from "@/components/confirm-delete-button";
import { ESTADO_INICIAL } from "@/server/modules/shared/action-state";
import { actualizarCiudadAction, eliminarCiudadAction } from "./actions";

type Ciudad = {
  id: number;
  nombre: string;
  _count: { tiendas: number };
};

function CiudadRow({ ciudad }: { ciudad: Ciudad }) {
  const [editando, setEditando] = useState(false);
  const [state, formAction] = useActionState(actualizarCiudadAction, ESTADO_INICIAL);
  const formId = `form-ciudad-${ciudad.id}`;

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
      setEditando(false);
    } else if (state.message) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <TableRow>
      <TableCell>
        {editando ? (
          <form id={formId} action={formAction}>
            <input type="hidden" name="id" value={ciudad.id} />
            <Input name="nombre" defaultValue={ciudad.nombre} autoFocus />
            {state.errors?.nombre ? (
              <p className="mt-1 text-xs text-destructive">
                {state.errors.nombre[0]}
              </p>
            ) : null}
          </form>
        ) : (
          ciudad.nombre
        )}
      </TableCell>
      <TableCell className="text-muted-foreground">
        {ciudad._count.tiendas}
      </TableCell>
      <TableCell className="text-right">
        {editando ? (
          <div className="flex justify-end gap-1">
            <SubmitButton form={formId} variant="ghost" size="icon">
              <Pencil className="text-primary" />
            </SubmitButton>
            <Button variant="ghost" size="icon" onClick={() => setEditando(false)}>
              <X />
            </Button>
          </div>
        ) : (
          <div className="flex justify-end gap-1">
            <Button variant="ghost" size="icon" onClick={() => setEditando(true)}>
              <Pencil />
            </Button>
            <ConfirmDeleteButton
              id={ciudad.id}
              action={eliminarCiudadAction}
              descripcion={`la ciudad "${ciudad.nombre}"`}
            />
          </div>
        )}
      </TableCell>
    </TableRow>
  );
}

export function CiudadesTable({ ciudades }: { ciudades: Ciudad[] }) {
  if (ciudades.length === 0) {
    return (
      <p className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
        Todavía no hay ciudades registradas.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Tiendas</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ciudades.map((ciudad) => (
            <CiudadRow key={ciudad.id} ciudad={ciudad} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
