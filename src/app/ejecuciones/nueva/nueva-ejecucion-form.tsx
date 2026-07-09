"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { SubmitButton } from "@/components/submit-button";
import { ESTADO_INICIAL } from "@/server/modules/shared/action-state";
import { crearEjecucionAction } from "../actions";
import { EjecucionCampos, type EjecucionOpciones } from "../ejecucion-campos";

export function NuevaEjecucionForm({
  opciones,
  campanaIdInicial,
}: {
  opciones: EjecucionOpciones;
  campanaIdInicial?: number;
}) {
  const [state, formAction] = useActionState(crearEjecucionAction, ESTADO_INICIAL);

  useEffect(() => {
    if (!state.success && state.message) toast.error(state.message);
  }, [state]);

  return (
    <Card className="max-w-2xl">
      <CardContent className="pt-6">
        <form action={formAction} className="space-y-4">
          <EjecucionCampos
            opciones={opciones}
            defaultValues={{ campanaId: campanaIdInicial }}
            errors={state.errors}
          />
          {state.message && !state.success ? (
            <p className="text-sm text-destructive">{state.message}</p>
          ) : null}
          <SubmitButton>Registrar ejecución</SubmitButton>
        </form>
      </CardContent>
    </Card>
  );
}
