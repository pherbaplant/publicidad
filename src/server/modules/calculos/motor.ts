// Motor de cálculos automáticos: ROAS e Índice de Desempeño.
// Funciones puras — ver /CLAUDE.md para el detalle de las fórmulas.

export type Semaforo = "verde" | "amarillo" | "rojo";

export function calcularRoas(
  ventas: number | null | undefined,
  inversion: number | null | undefined
): number | null {
  if (!inversion || inversion <= 0 || ventas == null) return null;
  return ventas / inversion;
}

/** % de cumplimiento de una meta, acotado a [0, 100]. */
export function normalizarScore(
  valor: number | null | undefined,
  meta: number | null | undefined
): number | null {
  if (valor == null || !meta || meta <= 0) return null;
  return Math.max(0, Math.min(100, (valor / meta) * 100));
}

export function promedioPonderado(
  items: { puntaje: number; peso: number }[]
): number | null {
  if (items.length === 0) return null;
  const pesoTotal = items.reduce((acc, i) => acc + i.peso, 0);
  if (pesoTotal <= 0) return null;
  return items.reduce((acc, i) => acc + i.puntaje * i.peso, 0) / pesoTotal;
}

export type PesosIndiceDesempeno = {
  pesoIncrementoVentas: number;
  pesoCalidadEjecucion: number;
  pesoCoberturaTiendas: number;
  pesoCumplimientoTiempos: number;
};

export type ScoresIndiceDesempeno = {
  scoreIncrementoVentas: number | null;
  scoreCalidadEjecucion: number | null;
  scoreCoberturaTiendas: number | null;
  scoreCumplimientoTiempos: number | null;
};

/**
 * Índice de Desempeño = suma ponderada de los 4 scores.
 * Un componente sin datos suficientes (null) se trata como 0 en la suma,
 * para no premiar con puntaje alto a campañas con información incompleta.
 */
export function calcularIndiceDesempeno(
  scores: ScoresIndiceDesempeno,
  pesos: PesosIndiceDesempeno
): number {
  const {
    scoreIncrementoVentas,
    scoreCalidadEjecucion,
    scoreCoberturaTiendas,
    scoreCumplimientoTiempos,
  } = scores;

  return (
    (scoreIncrementoVentas ?? 0) * pesos.pesoIncrementoVentas +
    (scoreCalidadEjecucion ?? 0) * pesos.pesoCalidadEjecucion +
    (scoreCoberturaTiendas ?? 0) * pesos.pesoCoberturaTiendas +
    (scoreCumplimientoTiempos ?? 0) * pesos.pesoCumplimientoTiempos
  );
}

export function obtenerSemaforo(
  indiceDesempeno: number | null | undefined,
  umbrales: { umbralVerde: number; umbralAmarillo: number }
): Semaforo | null {
  if (indiceDesempeno == null) return null;
  if (indiceDesempeno >= umbrales.umbralVerde) return "verde";
  if (indiceDesempeno >= umbrales.umbralAmarillo) return "amarillo";
  return "rojo";
}
