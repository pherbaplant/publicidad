import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { KpiCard } from "@/components/kpi-card";
import { SemaforoBadge } from "@/components/semaforo-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { listarCampanas } from "@/server/modules/campanas/service";
import { listarCiudades } from "@/server/modules/ciudades/service";
import { listarProductos } from "@/server/modules/productos/service";
import { listarResponsables } from "@/server/modules/responsables/service";
import { obtenerDatosDashboard } from "@/server/modules/dashboard/service";
import { formatMoneda, formatPorcentaje, formatRoas } from "@/lib/format";
import { DashboardFiltros } from "./dashboard-filtros";
import { ChartCard, IndiceDesempenoChart, SemaforoDonutChart } from "./dashboard-charts";

const TODAS = "todas";

function parseFiltro(valor?: string) {
  return valor && valor !== TODAS ? Number(valor) : undefined;
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;

  const filtros = {
    campanaId: parseFiltro(params.campanaId),
    ciudadId: parseFiltro(params.ciudadId),
    productoId: parseFiltro(params.productoId),
    responsableId: parseFiltro(params.responsableId),
    desde: params.desde ? new Date(params.desde) : undefined,
    hasta: params.hasta ? new Date(params.hasta) : undefined,
  };

  const [campanas, ciudades, productos, responsables, datos] = await Promise.all([
    listarCampanas(),
    listarCiudades(),
    listarProductos(),
    listarResponsables(),
    obtenerDatosDashboard(filtros),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Dashboard"
        description="Evaluación ejecutiva del desempeño de campañas publicitarias en tienda."
      />

      <DashboardFiltros
        campanas={campanas}
        ciudades={ciudades}
        productos={productos}
        responsables={responsables}
        valores={params}
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <KpiCard label="Inversión total" value={formatMoneda(datos.inversionTotal)} />
        <KpiCard label="ROAS promedio" value={formatRoas(datos.roasPromedio)} />
        <KpiCard
          label="Índice de Desempeño promedio"
          value={formatPorcentaje(datos.indicePromedio)}
        />
        <KpiCard
          label="Campañas evaluadas"
          value={String(datos.campanas.length)}
          hint={`🟢 ${datos.conteoSemaforo.verde} · 🟡 ${datos.conteoSemaforo.amarillo} · 🔴 ${datos.conteoSemaforo.rojo}`}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard
          title="Índice de Desempeño por campaña"
          description="Verde ≥ umbral alto, amarillo intermedio, rojo bajo umbral"
        >
          <IndiceDesempenoChart data={datos.campanas} />
        </ChartCard>
        <ChartCard title="Distribución de semáforo" description="Cantidad de campañas por estado">
          <SemaforoDonutChart data={datos.conteoSemaforo} />
        </ChartCard>
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold">Campañas</h2>
        {datos.campanas.length === 0 ? (
          <p className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
            No hay campañas con datos para los filtros seleccionados.
          </p>
        ) : (
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaña</TableHead>
                  <TableHead>Inversión</TableHead>
                  <TableHead>Ventas atribuidas</TableHead>
                  <TableHead>ROAS</TableHead>
                  <TableHead>Índice de Desempeño</TableHead>
                  <TableHead>Semáforo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {datos.campanas.map((campana) => (
                  <TableRow key={campana.campanaId}>
                    <TableCell className="font-medium">
                      <Link href={`/campanas/${campana.campanaId}`} className="hover:underline">
                        {campana.nombre}
                      </Link>
                    </TableCell>
                    <TableCell>{formatMoneda(campana.inversion)}</TableCell>
                    <TableCell>{formatMoneda(campana.ventas)}</TableCell>
                    <TableCell>{formatRoas(campana.roas)}</TableCell>
                    <TableCell>{formatPorcentaje(campana.indiceDesempeno)}</TableCell>
                    <TableCell>
                      <SemaforoBadge semaforo={campana.semaforo} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
