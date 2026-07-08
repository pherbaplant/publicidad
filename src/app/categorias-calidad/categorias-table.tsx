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
import {
  actualizarCategoriaCalidadAction,
  eliminarCategoriaCalidadAction,
} from "./actions";

type Categoria = {
  id: number;
  nombre: string;
  descripcion: string | null;
  peso: number;
  _count: { evaluaciones: number };
};

function CategoriaRow({ categoria }: { categoria: Categoria }) {
  const [editando, setEditando] = useState(false);
  const [state, formAction] = useActionState(
    actualizarCategoriaCalidadAction,
    ESTADO_INICIAL
  );
  const formId = `form-categoria-${categoria.id}`;

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
            <input type="hidden" name="id" value={categoria.id} />
            <Input name="nombre" defaultValue={categoria.nombre} autoFocus />
            {state.errors?.nombre ? (
              <p className="mt-1 text-xs text-destructive">{state.errors.nombre[0]}</p>
            ) : null}
          </form>
        ) : (
          categoria.nombre
        )}
      </TableCell>
      <TableCell className="text-muted-foreground">
        {editando ? (
          <Input form={formId} name="descripcion" defaultValue={categoria.descripcion ?? ""} />
        ) : (
          categoria.descripcion ?? "—"
        )}
      </TableCell>
      <TableCell className="w-24">
        {editando ? (
          <>
            <Input
              form={formId}
              name="peso"
              type="number"
              step="0.1"
              min="0.1"
              defaultValue={categoria.peso}
            />
            {state.errors?.peso ? (
              <p className="mt-1 text-xs text-destructive">{state.errors.peso[0]}</p>
            ) : null}
          </>
        ) : (
          categoria.peso
        )}
      </TableCell>
      <TableCell className="text-muted-foreground">{categoria._count.evaluaciones}</TableCell>
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
              id={categoria.id}
              action={eliminarCategoriaCalidadAction}
              descripcion={`la categoría "${categoria.nombre}"`}
            />
          </div>
        )}
      </TableCell>
    </TableRow>
  );
}

export function CategoriasTable({ categorias }: { categorias: Categoria[] }) {
  if (categorias.length === 0) {
    return (
      <p className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
        Todavía no hay categorías de calidad registradas.
      </p>
    );
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead>Peso</TableHead>
            <TableHead>Evaluaciones</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categorias.map((categoria) => (
            <CategoriaRow key={categoria.id} categoria={categoria} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
