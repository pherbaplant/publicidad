import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { listarEjecuciones } from "@/server/modules/ejecuciones/service";
import { formatFecha, formatMoneda, formatPorcentaje, formatRoas } from "@/lib/format";

export default async function EjecucionesPage() {
  const ejecuciones = await listarEjecuciones();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Ejecución en tienda"
        description="Registro de campaña × tienda × producto, con inversión, ventas y evidencia de calidad."
        actions={
          <Button
            render={
              <Link href="/ejecuciones/nueva">
                <Plus /> Registrar ejecución
              </Link>
            }
          />
        }
      />

      {ejecuciones.length === 0 ? (
        <p className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
          Todavía no hay ejecuciones registradas.
        </p>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaña</TableHead>
                <TableHead>Tienda</TableHead>
                <TableHead>Ciudad</TableHead>
                <TableHead>Producto</TableHead>
                <TableHead>Responsable</TableHead>
                <TableHead>Inversión</TableHead>
                <TableHead>Ventas</TableHead>
                <TableHead>ROAS</TableHead>
                <TableHead>Calidad</TableHead>
                <TableHead>Fecha ejecución</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ejecuciones.map((ejecucion) => (
                <TableRow key={ejecucion.id}>
                  <TableCell className="font-medium">
                    <Link href={`/ejecuciones/${ejecucion.id}`} className="hover:underline">
                      {ejecucion.campana.nombre}
                    </Link>
                  </TableCell>
                  <TableCell>{ejecucion.tienda.nombre}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {ejecucion.tienda.ciudad.nombre}
                  </TableCell>
                  <TableCell>{ejecucion.producto.nombre}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {ejecucion.responsable.nombre}
                  </TableCell>
                  <TableCell>{formatMoneda(ejecucion.inversionAsignada)}</TableCell>
                  <TableCell>{formatMoneda(ejecucion.ventasAtribuidas)}</TableCell>
                  <TableCell>{formatRoas(ejecucion.roas)}</TableCell>
                  <TableCell>{formatPorcentaje(ejecucion.scoreCalidad)}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatFecha(ejecucion.fechaEjecucion)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
