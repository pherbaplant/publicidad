"use client";

import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { Pencil, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { itemsDesdeLista } from "@/lib/select-items";
import { actualizarTiendaAction, eliminarTiendaAction } from "./actions";

type Tienda = {
  id: number;
  nombre: string;
  formato: string | null;
  ciudadId: number;
  ciudad: { id: number; nombre: string };
  _count: { ejecuciones: number };
};

function TiendaRow({
  tienda,
  ciudades,
}: {
  tienda: Tienda;
  ciudades: { id: number; nombre: string }[];
}) {
  const [editando, setEditando] = useState(false);
  const [state, formAction] = useActionState(actualizarTiendaAction, ESTADO_INICIAL);
  const formId = `form-tienda-${tienda.id}`;

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
      setEditando(false);
    } else if (state.message) {
      toast.error(state.message);
    }
  }, [state]);

  if (!editando) {
    return (
      <TableRow>
        <TableCell>{tienda.nombre}</TableCell>
        <TableCell className="text-muted-foreground">{tienda.formato ?? "—"}</TableCell>
        <TableCell>{tienda.ciudad.nombre}</TableCell>
        <TableCell className="text-muted-foreground">{tienda._count.ejecuciones}</TableCell>
        <TableCell className="text-right">
          <div className="flex justify-end gap-1">
            <Button variant="ghost" size="icon" onClick={() => setEditando(true)}>
              <Pencil />
            </Button>
            <ConfirmDeleteButton
              id={tienda.id}
              action={eliminarTiendaAction}
              descripcion={`la tienda "${tienda.nombre}"`}
            />
          </div>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <TableRow>
      <TableCell colSpan={4}>
        <form id={formId} action={formAction} className="flex flex-wrap items-start gap-2">
          <input type="hidden" name="id" value={tienda.id} />
          <div className="min-w-40 flex-1">
            <Input name="nombre" defaultValue={tienda.nombre} autoFocus />
            {state.errors?.nombre ? (
              <p className="mt-1 text-xs text-destructive">{state.errors.nombre[0]}</p>
            ) : null}
          </div>
          <div className="min-w-32 flex-1">
            <Input name="formato" defaultValue={tienda.formato ?? ""} placeholder="Formato" />
          </div>
          <div className="min-w-40 flex-1">
            <Select
              name="ciudadId"
              defaultValue={String(tienda.ciudadId)}
              items={itemsDesdeLista(ciudades)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Ciudad" />
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
              <p className="mt-1 text-xs text-destructive">{state.errors.ciudadId[0]}</p>
            ) : null}
          </div>
        </form>
      </TableCell>
      <TableCell className="text-right align-top">
        <div className="flex justify-end gap-1">
          <SubmitButton form={formId} variant="ghost" size="icon">
            <Pencil className="text-primary" />
          </SubmitButton>
          <Button variant="ghost" size="icon" onClick={() => setEditando(false)}>
            <X />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

export function TiendasTable({
  tiendas,
  ciudades,
}: {
  tiendas: Tienda[];
  ciudades: { id: number; nombre: string }[];
}) {
  if (tiendas.length === 0) {
    return (
      <p className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
        Todavía no hay tiendas registradas.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Formato</TableHead>
            <TableHead>Ciudad</TableHead>
            <TableHead>Ejecuciones</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tiendas.map((tienda) => (
            <TiendaRow key={tienda.id} tienda={tienda} ciudades={ciudades} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
