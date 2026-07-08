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
import { actualizarResponsableAction, eliminarResponsableAction } from "./actions";

type Responsable = {
  id: number;
  nombre: string;
  email: string | null;
  rol: string | null;
  _count: { ejecuciones: number };
};

function ResponsableRow({ responsable }: { responsable: Responsable }) {
  const [editando, setEditando] = useState(false);
  const [state, formAction] = useActionState(actualizarResponsableAction, ESTADO_INICIAL);
  const formId = `form-responsable-${responsable.id}`;

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
            <input type="hidden" name="id" value={responsable.id} />
            <Input name="nombre" defaultValue={responsable.nombre} autoFocus />
            {state.errors?.nombre ? (
              <p className="mt-1 text-xs text-destructive">{state.errors.nombre[0]}</p>
            ) : null}
          </form>
        ) : (
          responsable.nombre
        )}
      </TableCell>
      <TableCell className="text-muted-foreground">
        {editando ? (
          <>
            <Input form={formId} name="email" type="email" defaultValue={responsable.email ?? ""} />
            {state.errors?.email ? (
              <p className="mt-1 text-xs text-destructive">{state.errors.email[0]}</p>
            ) : null}
          </>
        ) : (
          responsable.email ?? "—"
        )}
      </TableCell>
      <TableCell className="text-muted-foreground">
        {editando ? (
          <Input form={formId} name="rol" defaultValue={responsable.rol ?? ""} />
        ) : (
          responsable.rol ?? "—"
        )}
      </TableCell>
      <TableCell className="text-muted-foreground">{responsable._count.ejecuciones}</TableCell>
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
              id={responsable.id}
              action={eliminarResponsableAction}
              descripcion={`el responsable "${responsable.nombre}"`}
            />
          </div>
        )}
      </TableCell>
    </TableRow>
  );
}

export function ResponsablesTable({ responsables }: { responsables: Responsable[] }) {
  if (responsables.length === 0) {
    return (
      <p className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
        Todavía no hay responsables registrados.
      </p>
    );
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Correo</TableHead>
            <TableHead>Rol</TableHead>
            <TableHead>Ejecuciones</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {responsables.map((responsable) => (
            <ResponsableRow key={responsable.id} responsable={responsable} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
