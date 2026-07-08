import { PageHeader } from "@/components/page-header";
import { listarCampanas } from "@/server/modules/campanas/service";
import { listarTiendas } from "@/server/modules/tiendas/service";
import { listarProductos } from "@/server/modules/productos/service";
import { listarResponsables } from "@/server/modules/responsables/service";
import { NuevaEjecucionForm } from "./nueva-ejecucion-form";

export default async function NuevaEjecucionPage({
  searchParams,
}: {
  searchParams: Promise<{ campanaId?: string }>;
}) {
  const { campanaId } = await searchParams;
  const [campanas, tiendas, productos, responsables] = await Promise.all([
    listarCampanas(),
    listarTiendas(),
    listarProductos(),
    listarResponsables(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Registrar ejecución en tienda"
        description="Campaña × tienda × producto: inversión asignada, ventas atribuidas y fechas."
      />
      <NuevaEjecucionForm
        opciones={{ campanas, tiendas, productos, responsables }}
        campanaIdInicial={campanaId ? Number(campanaId) : undefined}
      />
    </div>
  );
}
