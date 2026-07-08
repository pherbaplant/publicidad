import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { SemaforoBadge } from "@/components/semaforo-badge";
import { ConfirmDeleteButton } from "@/components/confirm-delete-button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { listarCampanas } from "@/server/modules/campanas/service";
import { obtenerConfiguracion } from "@/server/modules/configuracion/service";
import { obtenerSemaforo } from "@/server/modules/calculos/motor";
import { formatFecha, formatMoneda, formatPorcentaje, formatRoas } from "@/lib/format";
import { NuevaCampanaDialog } from "./nueva-campana-dialog";
import { EditarCampanaDialog } from "./editar-campana-dialog";
import { eliminarCampanaAction } from "./actions";

export default async function CampanasPage() {
  const [campanas, configuracion] = await Promise.all([
    listarCampanas(),
    obtenerConfiguracion(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Campañas"
        description="Campañas publicitarias registradas, con su ROAS e Índice de Desempeño."
        actions={<NuevaCampanaDialog />}
      />

      {campanas.length === 0 ? (
        <p className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
          Todavía no hay campañas registradas.
        </p>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Período</TableHead>
                <TableHead>Inversión</TableHead>
                <TableHead>ROAS</TableHead>
                <TableHead>Índice de Desempeño</TableHead>
                <TableHead>Semáforo</TableHead>
                <TableHead>Ejecuciones</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campanas.map((campana) => (
                <TableRow key={campana.id}>
                  <TableCell className="font-medium">
                    <Link
                      href={`/campanas/${campana.id}`}
                      className="hover:underline"
                    >
                      {campana.nombre}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatFecha(campana.fechaInicio)} — {formatFecha(campana.fechaFin)}
                  </TableCell>
                  <TableCell>{formatMoneda(campana.inversionTotal)}</TableCell>
                  <TableCell>{formatRoas(campana.roas)}</TableCell>
                  <TableCell>{formatPorcentaje(campana.indiceDesempeno)}</TableCell>
                  <TableCell>
                    <SemaforoBadge
                      semaforo={obtenerSemaforo(campana.indiceDesempeno, configuracion)}
                    />
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {campana._count.ejecuciones}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <EditarCampanaDialog campana={campana} />
                      <ConfirmDeleteButton
                        id={campana.id}
                        action={eliminarCampanaAction}
                        descripcion={`la campaña "${campana.nombre}"`}
                      />
                    </div>
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
