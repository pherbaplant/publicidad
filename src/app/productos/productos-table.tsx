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
import { actualizarProductoAction, eliminarProductoAction } from "./actions";

type Producto = {
  id: number;
  nombre: string;
  marca: string | null;
  _count: { ejecuciones: number };
};

function ProductoRow({ producto }: { producto: Producto }) {
  const [editando, setEditando] = useState(false);
  const [state, formAction] = useActionState(actualizarProductoAction, ESTADO_INICIAL);
  const formId = `form-producto-${producto.id}`;

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
            <input type="hidden" name="id" value={producto.id} />
            <Input name="nombre" defaultValue={producto.nombre} autoFocus />
            {state.errors?.nombre ? (
              <p className="mt-1 text-xs text-destructive">{state.errors.nombre[0]}</p>
            ) : null}
          </form>
        ) : (
          producto.nombre
        )}
      </TableCell>
      <TableCell className="text-muted-foreground">
        {editando ? (
          <Input form={formId} name="marca" defaultValue={producto.marca ?? ""} />
        ) : (
          producto.marca ?? "—"
        )}
      </TableCell>
      <TableCell className="text-muted-foreground">{producto._count.ejecuciones}</TableCell>
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
              id={producto.id}
              action={eliminarProductoAction}
              descripcion={`el producto "${producto.nombre}"`}
            />
          </div>
        )}
      </TableCell>
    </TableRow>
  );
}

export function ProductosTable({ productos }: { productos: Producto[] }) {
  if (productos.length === 0) {
    return (
      <p className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
        Todavía no hay productos registrados.
      </p>
    );
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Marca</TableHead>
            <TableHead>Ejecuciones</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {productos.map((producto) => (
            <ProductoRow key={producto.id} producto={producto} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
