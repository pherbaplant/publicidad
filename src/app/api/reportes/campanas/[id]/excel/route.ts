import { generarExcelCampana } from "@/server/modules/reportes/excel";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const campanaId = Number(id);

  try {
    const buffer = await generarExcelCampana(campanaId);
    return new Response(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="campana-${campanaId}-ejecuciones.xlsx"`,
      },
    });
  } catch {
    return new Response("Campaña no encontrada", { status: 404 });
  }
}
