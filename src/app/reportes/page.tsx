import { FileDown, FileSpreadsheet, FileText } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { SemaforoBadge } from "@/components/semaforo-badge";
import { Button } from "@/components/ui/button";
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
import { formatFecha, formatPorcentaje } from "@/lib/format";

export default async function ReportesPage() {
  const [campanas, configuracion] = await Promise.all([
    listarCampanas(),
    obtenerConfiguracion(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        icon={FileDown}
        title="Reportes"
        description="Exporta reportes ejecutivos en PDF y datos crudos en Excel, por campaña o para todo el dataset."
        actions={
          <Button
            variant="outline"
            nativeButton={false}
            render={
              <a href="/api/reportes/excel">
                <FileSpreadsheet /> Exportar todo (Excel)
              </a>
            }
          />
        }
      />

      {campanas.length === 0 ? (
        <p className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
          Todavía no hay campañas registradas.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaña</TableHead>
                <TableHead>Período</TableHead>
                <TableHead>Índice de Desempeño</TableHead>
                <TableHead>Semáforo</TableHead>
                <TableHead className="text-right">Reportes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campanas.map((campana) => (
                <TableRow key={campana.id}>
                  <TableCell className="font-medium">{campana.nombre}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatFecha(campana.fechaInicio)} — {formatFecha(campana.fechaFin)}
                  </TableCell>
                  <TableCell>{formatPorcentaje(campana.indiceDesempeno)}</TableCell>
                  <TableCell>
                    <SemaforoBadge
                      semaforo={obtenerSemaforo(campana.indiceDesempeno, configuracion)}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        nativeButton={false}
                        render={
                          <a href={`/api/reportes/campanas/${campana.id}/pdf`}>
                            <FileText /> PDF
                          </a>
                        }
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        nativeButton={false}
                        render={
                          <a href={`/api/reportes/campanas/${campana.id}/excel`}>
                            <FileSpreadsheet /> Excel
                          </a>
                        }
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
