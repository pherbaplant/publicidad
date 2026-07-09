import { Store } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { listarTiendas } from "@/server/modules/tiendas/service";
import { listarCiudadesOpciones } from "@/server/modules/ciudades/service";
import { TiendasTable } from "./tiendas-table";
import { NuevaTiendaDialog } from "./nueva-tienda-dialog";

export default async function TiendasPage() {
  const [tiendas, ciudades] = await Promise.all([listarTiendas(), listarCiudadesOpciones()]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        icon={Store}
        title="Tiendas"
        description="Catálogo de tiendas Farmatodo por ciudad y formato."
        actions={<NuevaTiendaDialog ciudades={ciudades} />}
      />
      <TiendasTable tiendas={tiendas} ciudades={ciudades} />
    </div>
  );
}
