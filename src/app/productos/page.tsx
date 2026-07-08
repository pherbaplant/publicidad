import { PageHeader } from "@/components/page-header";
import { listarProductos } from "@/server/modules/productos/service";
import { ProductosTable } from "./productos-table";
import { NuevoProductoDialog } from "./nuevo-producto-dialog";

export default async function ProductosPage() {
  const productos = await listarProductos();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Productos"
        description="Productos y marcas promocionados en campañas."
        actions={<NuevoProductoDialog />}
      />
      <ProductosTable productos={productos} />
    </div>
  );
}
