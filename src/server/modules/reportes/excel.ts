import ExcelJS from "exceljs";
import { obtenerCampana } from "@/server/modules/campanas/service";
import { listarEjecuciones } from "@/server/modules/ejecuciones/service";

const COLUMNAS_EJECUCION = [
  { header: "Campaña", key: "campana", width: 28 },
  { header: "Tienda", key: "tienda", width: 24 },
  { header: "Ciudad", key: "ciudad", width: 16 },
  { header: "Producto", key: "producto", width: 22 },
  { header: "Responsable", key: "responsable", width: 22 },
  { header: "Inversión asignada (USD)", key: "inversion", width: 20 },
  { header: "Ventas atribuidas (USD)", key: "ventas", width: 20 },
  { header: "ROAS", key: "roas", width: 10 },
  { header: "Calidad de ejecución (%)", key: "calidad", width: 20 },
  { header: "Fecha planificada", key: "fechaPlanificada", width: 16 },
  { header: "Fecha de ejecución", key: "fechaEjecucion", width: 16 },
] as const;

function estilarEncabezado(worksheet: ExcelJS.Worksheet) {
  worksheet.getRow(1).font = { bold: true };
  worksheet.getRow(1).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFE0F5F3" },
  };
  worksheet.views = [{ state: "frozen", ySplit: 1 }];
}

/** Datos crudos de todas las ejecuciones registradas (para análisis en Excel). */
export async function generarExcelGeneral(): Promise<ExcelJS.Buffer> {
  const ejecuciones = await listarEjecuciones();

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Sistema de Evaluación de Desempeño de Campañas — Farmatodo";
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet("Ejecuciones");
  worksheet.columns = [...COLUMNAS_EJECUCION];

  for (const ejecucion of ejecuciones) {
    worksheet.addRow({
      campana: ejecucion.campana.nombre,
      tienda: ejecucion.tienda.nombre,
      ciudad: ejecucion.tienda.ciudad.nombre,
      producto: ejecucion.producto.nombre,
      responsable: ejecucion.responsable.nombre,
      inversion: ejecucion.inversionAsignada,
      ventas: ejecucion.ventasAtribuidas,
      roas: ejecucion.roas,
      calidad: ejecucion.scoreCalidad,
      fechaPlanificada: ejecucion.fechaPlanificada,
      fechaEjecucion: ejecucion.fechaEjecucion,
    });
  }

  estilarEncabezado(worksheet);

  return workbook.xlsx.writeBuffer();
}

/** Datos crudos de las ejecuciones de una campaña específica. */
export async function generarExcelCampana(campanaId: number): Promise<ExcelJS.Buffer> {
  const campana = await obtenerCampana(campanaId);
  if (!campana) throw new Error("Campaña no encontrada");

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Sistema de Evaluación de Desempeño de Campañas — Farmatodo";
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet("Ejecuciones");
  worksheet.columns = COLUMNAS_EJECUCION.filter((c) => c.key !== "campana");

  for (const ejecucion of campana.ejecuciones) {
    worksheet.addRow({
      tienda: ejecucion.tienda.nombre,
      ciudad: ejecucion.tienda.ciudad.nombre,
      producto: ejecucion.producto.nombre,
      responsable: ejecucion.responsable.nombre,
      inversion: ejecucion.inversionAsignada,
      ventas: ejecucion.ventasAtribuidas,
      roas: ejecucion.roas,
      calidad: ejecucion.scoreCalidad,
      fechaPlanificada: ejecucion.fechaPlanificada,
      fechaEjecucion: ejecucion.fechaEjecucion,
    });
  }

  estilarEncabezado(worksheet);

  return workbook.xlsx.writeBuffer();
}
