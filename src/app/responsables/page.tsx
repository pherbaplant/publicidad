import { Users } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { listarResponsables } from "@/server/modules/responsables/service";
import { ResponsablesTable } from "./responsables-table";
import { NuevoResponsableDialog } from "./nuevo-responsable-dialog";

export default async function ResponsablesPage() {
  const responsables = await listarResponsables();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        icon={Users}
        title="Responsables"
        description="Equipo de mercadeo/publicidad a cargo de ejecutar y supervisar campañas."
        actions={<NuevoResponsableDialog />}
      />
      <ResponsablesTable responsables={responsables} />
    </div>
  );
}
