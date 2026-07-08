import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

function ErrorText({ children }: { children: string }) {
  return <p className="text-sm text-destructive">{children}</p>;
}

export type CampanaDefaultValues = {
  nombre?: string;
  objetivo?: string | null;
  fechaInicio?: string;
  fechaFin?: string;
  inversionTotal?: number;
  metaVentas?: number | null;
  metaTiendas?: number | null;
};

export function CampanaCampos({
  defaultValues,
  errors,
}: {
  defaultValues?: CampanaDefaultValues;
  errors?: Record<string, string[]>;
}) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="nombre">Nombre de la campaña</Label>
        <Input
          id="nombre"
          name="nombre"
          placeholder="Ej. Verano Solar 2026"
          defaultValue={defaultValues?.nombre}
          required
        />
        {errors?.nombre ? <ErrorText>{errors.nombre[0]}</ErrorText> : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="objetivo">Objetivo</Label>
        <Textarea
          id="objetivo"
          name="objetivo"
          placeholder="Ej. Impulsar ventas de protectores solares en temporada alta"
          defaultValue={defaultValues?.objetivo ?? ""}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fechaInicio">Fecha de inicio</Label>
          <Input
            id="fechaInicio"
            name="fechaInicio"
            type="date"
            defaultValue={defaultValues?.fechaInicio}
            required
          />
          {errors?.fechaInicio ? <ErrorText>{errors.fechaInicio[0]}</ErrorText> : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="fechaFin">Fecha de fin</Label>
          <Input
            id="fechaFin"
            name="fechaFin"
            type="date"
            defaultValue={defaultValues?.fechaFin}
            required
          />
          {errors?.fechaFin ? <ErrorText>{errors.fechaFin[0]}</ErrorText> : null}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="inversionTotal">Inversión total (USD)</Label>
        <Input
          id="inversionTotal"
          name="inversionTotal"
          type="number"
          step="0.01"
          min="0"
          defaultValue={defaultValues?.inversionTotal}
          required
        />
        {errors?.inversionTotal ? <ErrorText>{errors.inversionTotal[0]}</ErrorText> : null}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="metaVentas">Meta de ventas (USD)</Label>
          <Input
            id="metaVentas"
            name="metaVentas"
            type="number"
            step="0.01"
            min="0"
            defaultValue={defaultValues?.metaVentas ?? undefined}
          />
          {errors?.metaVentas ? <ErrorText>{errors.metaVentas[0]}</ErrorText> : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="metaTiendas">Meta de tiendas</Label>
          <Input
            id="metaTiendas"
            name="metaTiendas"
            type="number"
            min="1"
            defaultValue={defaultValues?.metaTiendas ?? undefined}
          />
          {errors?.metaTiendas ? <ErrorText>{errors.metaTiendas[0]}</ErrorText> : null}
        </div>
      </div>
    </>
  );
}
