import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Plus } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { KpiCard } from "@/components/kpi-card";
import { SemaforoBadge } from "@/components/semaforo-badge";
import { Button } from "@/components/ui/button";
import { ConfirmDeleteButton } from "@/components/confirm-delete-button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { obtenerCampana } from "@/server/modules/campanas/service";
import { obtenerConfiguracion } from "@/server/modules/configuracion/service";
import { obtenerSemaforo } from "@/server/modules/calculos/motor";
import {
  formatFecha,
  formatMoneda,
  formatPorcentaje,
  formatRoas,
} from "@/lib/format";
import { EditarCampanaDialog } from "../editar-campana-dialog";
import { eliminarCampanaAction } from "../actions";

export default async function CampanaDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const campanaId = Number(id);
  const [campana, configuracion] = await Promise.all([
    obtenerCampana(campanaId),
    obtenerConfiguracion(),
  ]);

  if (!campana) notFound();

  const semaforo = obtenerSemaforo(campana.indiceDesempeno, configuracion);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Button
          variant="ghost"
          size="sm"
          className="mb-2 -ml-2"
          render={
            <Link href="/campanas">
              <ArrowLeft /> Volver a campañas
            </Link>
          }
        />
        <PageHeader
          title={campana.nombre}
          description={campana.objetivo ?? undefined}
          actions={
            <>
              <EditarCampanaDialog campana={campana} />
              <ConfirmDeleteButton
                id={campana.id}
                action={eliminarCampanaAction}
                descripcion={`la campaña "${campana.nombre}"`}
                redirectTo="/campanas"
              />
            </>
          }
        />
        <p className="mt-1 text-sm text-muted-foreground">
          {formatFecha(campana.fechaInicio)} — {formatFecha(campana.fechaFin)}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        <KpiCard label="Inversión total" value={formatMoneda(campana.inversionTotal)} />
        <KpiCard label="ROAS" value={formatRoas(campana.roas)} />
        <KpiCard
          label="Incremento de ventas"
          value={formatPorcentaje(campana.scoreIncrementoVentas)}
          hint="vs. meta de ventas (40%)"
        />
        <KpiCard
          label="Calidad de ejecución"
          value={formatPorcentaje(campana.scoreCalidadEjecucion)}
          hint="checklist en tienda (30%)"
        />
        <KpiCard
          label="Cobertura de tiendas"
          value={formatPorcentaje(campana.scoreCoberturaTiendas)}
          hint="vs. meta de tiendas (20%)"
        />
        <KpiCard
          label="Cumplimiento de tiempos"
          value={formatPorcentaje(campana.scoreCumplimientoTiempos)}
          hint="ejecuciones a tiempo (10%)"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <KpiCard
          label="Índice de Desempeño"
          value={formatPorcentaje(campana.indiceDesempeno)}
          action={<SemaforoBadge semaforo={semaforo} />}
        />
        <KpiCard
          label="Metas de la campaña"
          value={`${formatMoneda(campana.metaVentas)} · ${campana.metaTiendas ?? "—"} tiendas`}
          hint="Meta de ventas · Meta de tiendas"
        />
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Ejecución en tienda</h2>
        <Button
          size="sm"
          render={
            <Link href={`/ejecuciones/nueva?campanaId=${campana.id}`}>
              <Plus /> Registrar ejecución
            </Link>
          }
        />
      </div>

      {campana.ejecuciones.length === 0 ? (
        <p className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
          Todavía no hay ejecuciones registradas para esta campaña.
        </p>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tienda</TableHead>
                <TableHead>Ciudad</TableHead>
                <TableHead>Producto</TableHead>
                <TableHead>Responsable</TableHead>
                <TableHead>Inversión</TableHead>
                <TableHead>Ventas</TableHead>
                <TableHead>ROAS</TableHead>
                <TableHead>Calidad</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campana.ejecuciones.map((ejecucion) => (
                <TableRow key={ejecucion.id}>
                  <TableCell>
                    <Link
                      href={`/ejecuciones/${ejecucion.id}`}
                      className="font-medium hover:underline"
                    >
                      {ejecucion.tienda.nombre}
                    </Link>
                  </TableCell>
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
