import { ListChecks } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { listarCategoriasCalidad } from "@/server/modules/categorias-calidad/service";
import { CategoriasTable } from "./categorias-table";
import { NuevaCategoriaDialog } from "./nueva-categoria-dialog";

export default async function CategoriasCalidadPage() {
  const categorias = await listarCategoriasCalidad();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        icon={ListChecks}
        title="Categorías de calidad de ejecución"
        description="Checklist de cumplimiento en punto de venta (exhibición, stock, POP, planograma, etc.)."
        actions={<NuevaCategoriaDialog />}
      />
      <CategoriasTable categorias={categorias} />
    </div>
  );
}
