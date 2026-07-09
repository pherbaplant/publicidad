import { ClipboardCheck } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { listarCampanasOpciones } from "@/server/modules/campanas/service";
import { listarTiendasOpciones } from "@/server/modules/tiendas/service";
import { listarProductosOpciones } from "@/server/modules/productos/service";
import { listarResponsablesOpciones } from "@/server/modules/responsables/service";
import { NuevaEjecucionForm } from "./nueva-ejecucion-form";

export default async function NuevaEjecucionPage({
  searchParams,
}: {
  searchParams: Promise<{ campanaId?: string }>;
}) {
  const { campanaId } = await searchParams;
  const [campanas, tiendas, productos, responsables] = await Promise.all([
    listarCampanasOpciones(),
    listarTiendasOpciones(),
    listarProductosOpciones(),
    listarResponsablesOpciones(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        icon={ClipboardCheck}
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
