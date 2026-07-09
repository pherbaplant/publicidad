import { generarExcelGeneral } from "@/server/modules/reportes/excel";

export async function GET() {
  const buffer = await generarExcelGeneral();
  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="ejecuciones.xlsx"`,
    },
  });
}
