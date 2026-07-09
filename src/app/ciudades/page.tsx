import { MapPin } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { listarCiudades } from "@/server/modules/ciudades/service";
import { CiudadesTable } from "./ciudades-table";
import { NuevaCiudadDialog } from "./nueva-ciudad-dialog";

export default async function CiudadesPage() {
  const ciudades = await listarCiudades();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        icon={MapPin}
        title="Ciudades"
        description="Ciudades donde operan las tiendas Farmatodo."
        actions={<NuevaCiudadDialog />}
      />
      <CiudadesTable ciudades={ciudades} />
    </div>
  );
}
