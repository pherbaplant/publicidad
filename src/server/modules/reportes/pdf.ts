import { PDFDocument, StandardFonts, rgb, type PDFPage, type PDFFont } from "pdf-lib";
import { obtenerCampana } from "@/server/modules/campanas/service";
import { obtenerConfiguracion } from "@/server/modules/configuracion/service";
import { obtenerSemaforo, type Semaforo } from "@/server/modules/calculos/motor";
import { formatFecha, formatMoneda, formatPorcentaje, formatRoas } from "@/lib/format";

const COLOR_SEMAFORO: Record<Semaforo, [number, number, number]> = {
  verde: [0.06, 0.59, 0.53],
  amarillo: [0.85, 0.47, 0.02],
  rojo: [0.86, 0.15, 0.15],
};

const MARGEN = 48;
const ANCHO_PAGINA = 612; // carta
const ALTO_PAGINA = 792;

type Contexto = {
  pdf: PDFDocument;
  page: PDFPage;
  font: PDFFont;
  bold: PDFFont;
  y: number;
};

function nuevaPagina(pdf: PDFDocument): PDFPage {
  return pdf.addPage([ANCHO_PAGINA, ALTO_PAGINA]);
}

function asegurarEspacio(ctx: Contexto, alturaNecesaria: number) {
  if (ctx.y - alturaNecesaria < MARGEN) {
    ctx.page = nuevaPagina(ctx.pdf);
    ctx.y = ALTO_PAGINA - MARGEN;
  }
}

function texto(
  ctx: Contexto,
  valor: string,
  opciones: { x?: number; size?: number; negrita?: boolean; color?: [number, number, number] } = {}
) {
  const { x = MARGEN, size = 10, negrita = false, color = [0.1, 0.1, 0.1] } = opciones;
  ctx.page.drawText(valor, {
    x,
    y: ctx.y,
    size,
    font: negrita ? ctx.bold : ctx.font,
    color: rgb(...color),
  });
}

function truncar(ctx: Contexto, valor: string, anchoMaximo: number, size: number): string {
  if (ctx.font.widthOfTextAtSize(valor, size) <= anchoMaximo) return valor;
  let recortado = valor;
  while (recortado.length > 1 && ctx.font.widthOfTextAtSize(`${recortado}…`, size) > anchoMaximo) {
    recortado = recortado.slice(0, -1);
  }
  return `${recortado}…`;
}

function linea(ctx: Contexto) {
  ctx.page.drawLine({
    start: { x: MARGEN, y: ctx.y },
    end: { x: ANCHO_PAGINA - MARGEN, y: ctx.y },
    thickness: 0.5,
    color: rgb(0.85, 0.85, 0.85),
  });
}

/** Reporte ejecutivo (PDF) de una campaña: KPIs, semáforo y resumen de ejecuciones. */
export async function generarPdfCampana(campanaId: number): Promise<Uint8Array> {
  const [campana, configuracion] = await Promise.all([
    obtenerCampana(campanaId),
    obtenerConfiguracion(),
  ]);
  if (!campana) throw new Error("Campaña no encontrada");

  const semaforo = obtenerSemaforo(campana.indiceDesempeno, configuracion);

  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const page = nuevaPagina(pdf);

  const ctx: Contexto = { pdf, page, font, bold, y: ALTO_PAGINA - MARGEN };

  texto(ctx, "Reporte ejecutivo de campaña", { size: 10, color: [0.4, 0.4, 0.4] });
  ctx.y -= 22;
  texto(ctx, campana.nombre, { size: 20, negrita: true });
  ctx.y -= 18;
  if (campana.objetivo) {
    texto(ctx, campana.objetivo, { size: 10, color: [0.35, 0.35, 0.35] });
    ctx.y -= 16;
  }
  texto(ctx, `${formatFecha(campana.fechaInicio)} — ${formatFecha(campana.fechaFin)}`, {
    size: 10,
    color: [0.35, 0.35, 0.35],
  });
  ctx.y -= 24;
  linea(ctx);
  ctx.y -= 24;

  texto(ctx, "Índice de Desempeño", { size: 11, negrita: true });
  texto(ctx, formatPorcentaje(campana.indiceDesempeno), { x: MARGEN + 160, size: 14, negrita: true });
  if (semaforo) {
    ctx.page.drawRectangle({
      x: MARGEN + 260,
      y: ctx.y - 3,
      width: 70,
      height: 16,
      color: rgb(...COLOR_SEMAFORO[semaforo]),
    });
    texto(ctx, semaforo.toUpperCase(), { x: MARGEN + 268, size: 9, color: [1, 1, 1] });
  }
  ctx.y -= 28;

  const filasKpi: [string, string][] = [
    ["Inversión total", formatMoneda(campana.inversionTotal)],
    ["ROAS", formatRoas(campana.roas)],
    ["Incremento de ventas (40%)", formatPorcentaje(campana.scoreIncrementoVentas)],
    ["Calidad de ejecución (30%)", formatPorcentaje(campana.scoreCalidadEjecucion)],
    ["Cobertura de tiendas (20%)", formatPorcentaje(campana.scoreCoberturaTiendas)],
    ["Cumplimiento de tiempos (10%)", formatPorcentaje(campana.scoreCumplimientoTiempos)],
  ];

  for (const [etiqueta, valor] of filasKpi) {
    texto(ctx, etiqueta, { size: 10, color: [0.3, 0.3, 0.3] });
    texto(ctx, valor, { x: MARGEN + 260, size: 10, negrita: true });
    ctx.y -= 18;
  }

  ctx.y -= 8;
  linea(ctx);
  ctx.y -= 24;

  texto(ctx, `Ejecución en tienda (${campana.ejecuciones.length})`, { size: 12, negrita: true });
  ctx.y -= 20;

  const columnas = [
    { titulo: "Tienda", x: MARGEN, ancho: 128 },
    { titulo: "Producto", x: MARGEN + 132, ancho: 90 },
    { titulo: "Inversión", x: MARGEN + 226, ancho: 65 },
    { titulo: "Ventas", x: MARGEN + 294, ancho: 65 },
    { titulo: "ROAS", x: MARGEN + 362, ancho: 40 },
    { titulo: "Calidad", x: MARGEN + 406, ancho: 55 },
  ];

  asegurarEspacio(ctx, 20);
  for (const columna of columnas) {
    texto(ctx, columna.titulo, { x: columna.x, size: 9, negrita: true, color: [0.3, 0.3, 0.3] });
  }
  ctx.y -= 14;
  linea(ctx);
  ctx.y -= 12;

  for (const ejecucion of campana.ejecuciones) {
    asegurarEspacio(ctx, 16);
    texto(ctx, truncar(ctx, ejecucion.tienda.nombre, columnas[0].ancho, 9), {
      x: columnas[0].x,
      size: 9,
    });
    texto(ctx, truncar(ctx, ejecucion.producto.nombre, columnas[1].ancho, 9), {
      x: columnas[1].x,
      size: 9,
    });
    texto(ctx, formatMoneda(ejecucion.inversionAsignada), { x: columnas[2].x, size: 9 });
    texto(ctx, formatMoneda(ejecucion.ventasAtribuidas), { x: columnas[3].x, size: 9 });
    texto(ctx, formatRoas(ejecucion.roas), { x: columnas[4].x, size: 9 });
    texto(ctx, formatPorcentaje(ejecucion.scoreCalidad), { x: columnas[5].x, size: 9 });
    ctx.y -= 16;
  }

  return pdf.save();
}
