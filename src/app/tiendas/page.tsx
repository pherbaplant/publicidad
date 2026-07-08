import { PageHeader } from "@/components/page-header";
import { listarTiendas } from "@/server/modules/tiendas/service";
import { listarCiudades } from "@/server/modules/ciudades/service";
import { TiendasTable } from "./tiendas-table";
import { NuevaTiendaDialog } from "./nueva-tienda-dialog";

export default async function TiendasPage() {
  const [tiendas, ciudades] = await Promise.all([listarTiendas(), listarCiudades()]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Tiendas"
        description="Catálogo de tiendas Farmatodo por ciudad y formato."
        actions={<NuevaTiendaDialog ciudades={ciudades} />}
      />
      <TiendasTable tiendas={tiendas} ciudades={ciudades} />
    </div>
  );
}
