import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { KpiCard } from "@/components/kpi-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConfirmDeleteButton } from "@/components/confirm-delete-button";
import { obtenerEjecucion } from "@/server/modules/ejecuciones/service";
import { listarCategoriasCalidad } from "@/server/modules/categorias-calidad/service";
import { listarCampanas } from "@/server/modules/campanas/service";
import { listarTiendas } from "@/server/modules/tiendas/service";
import { listarProductos } from "@/server/modules/productos/service";
import { listarResponsables } from "@/server/modules/responsables/service";
import { formatFecha, formatMoneda, formatPorcentaje, formatRoas } from "@/lib/format";
import { EditarEjecucionDialog } from "../editar-ejecucion-dialog";
import { eliminarEjecucionAction } from "../actions";
import { eliminarEvaluacionAction } from "./calidad-actions";
import { CalificarCategoriaDialog } from "./calificar-categoria-dialog";

export default async function EjecucionDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ejecucionId = Number(id);

  const [ejecucion, categorias, campanas, tiendas, productos, responsables] =
    await Promise.all([
      obtenerEjecucion(ejecucionId),
      listarCategoriasCalidad(),
      listarCampanas(),
      listarTiendas(),
      listarProductos(),
      listarResponsables(),
    ]);

  if (!ejecucion) notFound();

  const evaluacionesPorCategoria = new Map(
    ejecucion.evaluaciones.map((evaluacion) => [evaluacion.categoriaId, evaluacion])
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Button
          variant="ghost"
          size="sm"
          className="mb-2 -ml-2"
          nativeButton={false}
          render={
            <Link href={`/campanas/${ejecucion.campanaId}`}>
              <ArrowLeft /> Volver a la campaña
            </Link>
          }
        />
        <PageHeader
          title={`${ejecucion.tienda.nombre} · ${ejecucion.producto.nombre}`}
          description={`Campaña: ${ejecucion.campana.nombre} · Responsable: ${ejecucion.responsable.nombre}`}
          actions={
            <>
              <EditarEjecucionDialog
                ejecucion={ejecucion}
                opciones={{ campanas, tiendas, productos, responsables }}
              />
              <ConfirmDeleteButton
                id={ejecucion.id}
                action={eliminarEjecucionAction}
                descripcion="esta ejecución"
                redirectTo={`/campanas/${ejecucion.campanaId}`}
              />
            </>
          }
        />
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <KpiCard label="Inversión asignada" value={formatMoneda(ejecucion.inversionAsignada)} />
        <KpiCard label="Ventas atribuidas" value={formatMoneda(ejecucion.ventasAtribuidas)} />
        <KpiCard label="ROAS" value={formatRoas(ejecucion.roas)} />
        <KpiCard label="Calidad de ejecución" value={formatPorcentaje(ejecucion.scoreCalidad)} />
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground md:grid-cols-4">
        <div>
          <p className="font-medium text-foreground">Fecha planificada</p>
          {formatFecha(ejecucion.fechaPlanificada)}
        </div>
        <div>
          <p className="font-medium text-foreground">Fecha de ejecución</p>
          {formatFecha(ejecucion.fechaEjecucion)}
        </div>
        <div>
          <p className="font-medium text-foreground">Ciudad</p>
          {ejecucion.tienda.ciudad.nombre}
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold">Calidad de ejecución en tienda</h2>
        <div className="flex flex-col gap-3">
          {categorias.map((categoria) => {
            const evaluacion = evaluacionesPorCategoria.get(categoria.id);
            return (
              <div
                key={categoria.id}
                className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{categoria.nombre}</p>
                    <Badge variant="secondary">peso {categoria.peso}</Badge>
                    {evaluacion ? (
                      <Badge variant="outline">{evaluacion.puntaje} / 100</Badge>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground">
                        Sin calificar
                      </Badge>
                    )}
                  </div>
                  {categoria.descripcion ? (
                    <p className="text-sm text-muted-foreground">{categoria.descripcion}</p>
                  ) : null}
                  {evaluacion?.comentario ? (
                    <p className="mt-1 text-sm italic text-muted-foreground">
                      &ldquo;{evaluacion.comentario}&rdquo;
                    </p>
                  ) : null}
                  {evaluacion && evaluacion.evidencias.length > 0 ? (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {evaluacion.evidencias.length} foto(s) de evidencia
                    </p>
                  ) : null}
                </div>
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <CalificarCategoriaDialog
                    ejecucionId={ejecucion.id}
                    categoria={categoria}
                    evaluacionExistente={evaluacion}
                  />
                  {evaluacion ? (
                    <ConfirmDeleteButton
                      id={evaluacion.id}
                      action={eliminarEvaluacionAction}
                      descripcion={`la calificación de "${categoria.nombre}"`}
                      extraFields={{ ejecucionId: ejecucion.id }}
                    />
                  ) : null}
                </div>
              </div>
            );
          })}
          {categorias.length === 0 ? (
            <p className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
              Todavía no hay categorías de calidad configuradas.{" "}
              <Link href="/categorias-calidad" className="underline">
                Crea la primera aquí.
              </Link>
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
