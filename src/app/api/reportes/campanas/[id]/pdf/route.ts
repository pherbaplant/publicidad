import { generarPdfCampana } from "@/server/modules/reportes/pdf";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const campanaId = Number(id);

  try {
    const bytes = await generarPdfCampana(campanaId);
    return new Response(new Uint8Array(bytes), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="campana-${campanaId}-reporte.pdf"`,
      },
    });
  } catch {
    return new Response("Campaña no encontrada", { status: 404 });
  }
}
