"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { SubmitButton } from "@/components/submit-button";
import { ESTADO_INICIAL, type ActionState } from "@/server/modules/shared/action-state";

export function ConfirmDeleteButton({
  id,
  action,
  descripcion,
  redirectTo,
  extraFields,
}: {
  id: number;
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  descripcion: string;
  /** Ruta a la que navegar tras eliminar exitosamente (p. ej. al borrar desde una página de detalle). */
  redirectTo?: string;
  /** Campos ocultos adicionales que la acción necesite (p. ej. el id de la entidad padre para revalidar). */
  extraFields?: Record<string, string | number>;
}) {
  const [state, formAction] = useActionState(action, ESTADO_INICIAL);
  const closeRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (state.success && state.message) {
      toast.success(state.message);
      closeRef.current?.click();
      if (redirectTo) router.push(redirectTo);
    } else if (!state.success && state.message) {
      toast.error(state.message);
    }
  }, [state, redirectTo, router]);

  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <Button variant="ghost" size="icon" aria-label="Eliminar">
            <Trash2 className="text-destructive" />
          </Button>
        }
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Eliminar {descripcion}?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel ref={closeRef}>Cancelar</AlertDialogCancel>
          <form action={formAction}>
            <input type="hidden" name="id" value={id} />
            {Object.entries(extraFields ?? {}).map(([name, value]) => (
              <input key={name} type="hidden" name={name} value={value} />
            ))}
            <SubmitButton variant="destructive">Eliminar</SubmitButton>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
