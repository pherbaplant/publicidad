import Link from "next/link";
import { X } from "lucide-react";
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
import { itemsDesdeLista } from "@/lib/select-items";

const TODAS = "todas";

export function DashboardFiltros({
  campanas,
  ciudades,
  productos,
  responsables,
  valores,
}: {
  campanas: { id: number; nombre: string }[];
  ciudades: { id: number; nombre: string }[];
  productos: { id: number; nombre: string }[];
  responsables: { id: number; nombre: string }[];
  valores: {
    campanaId?: string;
    ciudadId?: string;
    productoId?: string;
    responsableId?: string;
    desde?: string;
    hasta?: string;
  };
}) {
  const hayFiltros = Object.values(valores).some(Boolean);

  return (
    <form className="flex flex-wrap items-end gap-3 rounded-lg border p-4">
      <div className="space-y-1">
        <Label htmlFor="campanaId">Campaña</Label>
        <Select
          name="campanaId"
          defaultValue={valores.campanaId ?? TODAS}
          items={{ [TODAS]: "Todas", ...itemsDesdeLista(campanas) }}
        >
          <SelectTrigger id="campanaId" className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={TODAS}>Todas</SelectItem>
            {campanas.map((campana) => (
              <SelectItem key={campana.id} value={String(campana.id)}>
                {campana.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <Label htmlFor="ciudadId">Ciudad</Label>
        <Select
          name="ciudadId"
          defaultValue={valores.ciudadId ?? TODAS}
          items={{ [TODAS]: "Todas", ...itemsDesdeLista(ciudades) }}
        >
          <SelectTrigger id="ciudadId" className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={TODAS}>Todas</SelectItem>
            {ciudades.map((ciudad) => (
              <SelectItem key={ciudad.id} value={String(ciudad.id)}>
                {ciudad.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <Label htmlFor="productoId">Producto</Label>
        <Select
          name="productoId"
          defaultValue={valores.productoId ?? TODAS}
          items={{ [TODAS]: "Todos", ...itemsDesdeLista(productos) }}
        >
          <SelectTrigger id="productoId" className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={TODAS}>Todos</SelectItem>
            {productos.map((producto) => (
              <SelectItem key={producto.id} value={String(producto.id)}>
                {producto.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <Label htmlFor="responsableId">Responsable</Label>
        <Select
          name="responsableId"
          defaultValue={valores.responsableId ?? TODAS}
          items={{ [TODAS]: "Todos", ...itemsDesdeLista(responsables) }}
        >
          <SelectTrigger id="responsableId" className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={TODAS}>Todos</SelectItem>
            {responsables.map((responsable) => (
              <SelectItem key={responsable.id} value={String(responsable.id)}>
                {responsable.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <Label htmlFor="desde">Desde</Label>
        <Input id="desde" name="desde" type="date" defaultValue={valores.desde} className="w-36" />
      </div>

      <div className="space-y-1">
        <Label htmlFor="hasta">Hasta</Label>
        <Input id="hasta" name="hasta" type="date" defaultValue={valores.hasta} className="w-36" />
      </div>

      <Button type="submit">Aplicar filtros</Button>
      {hayFiltros ? (
        <Button
          type="button"
          variant="ghost"
          nativeButton={false}
          render={
            <Link href="/">
              <X /> Limpiar
            </Link>
          }
        />
      ) : null}
    </form>
  );
}
