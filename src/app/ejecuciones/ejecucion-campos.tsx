import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { itemsDesdeLista } from "@/lib/select-items";

function ErrorText({ children }: { children: string }) {
  return <p className="text-sm text-destructive">{children}</p>;
}

export type EjecucionOpciones = {
  campanas: { id: number; nombre: string }[];
  tiendas: { id: number; nombre: string }[];
  productos: { id: number; nombre: string }[];
  responsables: { id: number; nombre: string }[];
};

export type EjecucionDefaultValues = {
  campanaId?: number;
  tiendaId?: number;
  productoId?: number;
  responsableId?: number;
  inversionAsignada?: number;
  ventasAtribuidas?: number | null;
  fechaPlanificada?: string;
  fechaEjecucion?: string;
};

export function EjecucionCampos({
  opciones,
  defaultValues,
  errors,
  bloquearCampana = false,
}: {
  opciones: EjecucionOpciones;
  defaultValues?: EjecucionDefaultValues;
  errors?: Record<string, string[]>;
  bloquearCampana?: boolean;
}) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="campanaId">Campaña</Label>
        <Select
          name="campanaId"
          defaultValue={
            defaultValues?.campanaId ? String(defaultValues.campanaId) : undefined
          }
          disabled={bloquearCampana}
          items={itemsDesdeLista(opciones.campanas)}
        >
          <SelectTrigger id="campanaId" className="w-full">
            <SelectValue placeholder="Selecciona una campaña" />
          </SelectTrigger>
          <SelectContent>
            {opciones.campanas.map((campana) => (
              <SelectItem key={campana.id} value={String(campana.id)}>
                {campana.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors?.campanaId ? <ErrorText>{errors.campanaId[0]}</ErrorText> : null}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="tiendaId">Tienda</Label>
          <Select
            name="tiendaId"
            defaultValue={
              defaultValues?.tiendaId ? String(defaultValues.tiendaId) : undefined
            }
            items={itemsDesdeLista(opciones.tiendas)}
          >
            <SelectTrigger id="tiendaId" className="w-full">
              <SelectValue placeholder="Selecciona una tienda" />
            </SelectTrigger>
            <SelectContent>
              {opciones.tiendas.map((tienda) => (
                <SelectItem key={tienda.id} value={String(tienda.id)}>
                  {tienda.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors?.tiendaId ? <ErrorText>{errors.tiendaId[0]}</ErrorText> : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="productoId">Producto</Label>
          <Select
            name="productoId"
            defaultValue={
              defaultValues?.productoId ? String(defaultValues.productoId) : undefined
            }
            items={itemsDesdeLista(opciones.productos)}
          >
            <SelectTrigger id="productoId" className="w-full">
              <SelectValue placeholder="Selecciona un producto" />
            </SelectTrigger>
            <SelectContent>
              {opciones.productos.map((producto) => (
                <SelectItem key={producto.id} value={String(producto.id)}>
                  {producto.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors?.productoId ? <ErrorText>{errors.productoId[0]}</ErrorText> : null}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="responsableId">Responsable</Label>
        <Select
          name="responsableId"
          defaultValue={
            defaultValues?.responsableId ? String(defaultValues.responsableId) : undefined
          }
          items={itemsDesdeLista(opciones.responsables)}
        >
          <SelectTrigger id="responsableId" className="w-full">
            <SelectValue placeholder="Selecciona un responsable" />
          </SelectTrigger>
          <SelectContent>
            {opciones.responsables.map((responsable) => (
              <SelectItem key={responsable.id} value={String(responsable.id)}>
                {responsable.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors?.responsableId ? <ErrorText>{errors.responsableId[0]}</ErrorText> : null}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="inversionAsignada">Inversión asignada (USD)</Label>
          <Input
            id="inversionAsignada"
            name="inversionAsignada"
            type="number"
            step="0.01"
            min="0"
            defaultValue={defaultValues?.inversionAsignada}
            required
          />
          {errors?.inversionAsignada ? (
            <ErrorText>{errors.inversionAsignada[0]}</ErrorText>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="ventasAtribuidas">Ventas atribuidas (USD)</Label>
          <Input
            id="ventasAtribuidas"
            name="ventasAtribuidas"
            type="number"
            step="0.01"
            min="0"
            defaultValue={defaultValues?.ventasAtribuidas ?? undefined}
          />
          {errors?.ventasAtribuidas ? (
            <ErrorText>{errors.ventasAtribuidas[0]}</ErrorText>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fechaPlanificada">Fecha planificada</Label>
          <Input
            id="fechaPlanificada"
            name="fechaPlanificada"
            type="date"
            defaultValue={defaultValues?.fechaPlanificada}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fechaEjecucion">Fecha de ejecución real</Label>
          <Input
            id="fechaEjecucion"
            name="fechaEjecucion"
            type="date"
            defaultValue={defaultValues?.fechaEjecucion}
          />
        </div>
      </div>
    </>
  );
}
