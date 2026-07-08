const moneda = new Intl.NumberFormat("es-VE", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const numero = new Intl.NumberFormat("es-VE", { maximumFractionDigits: 1 });

const fecha = new Intl.DateTimeFormat("es-VE", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

export function formatMoneda(valor: number | null | undefined): string {
  if (valor == null) return "—";
  return moneda.format(valor);
}

export function formatNumero(valor: number | null | undefined): string {
  if (valor == null) return "—";
  return numero.format(valor);
}

export function formatRoas(valor: number | null | undefined): string {
  if (valor == null) return "—";
  return `${numero.format(valor)}x`;
}

export function formatPorcentaje(valor: number | null | undefined): string {
  if (valor == null) return "—";
  return `${numero.format(valor)}%`;
}

export function formatFecha(valor: Date | string | null | undefined): string {
  if (!valor) return "—";
  return fecha.format(new Date(valor));
}

/** Convierte una fecha a formato "yyyy-MM-dd" para <input type="date">. */
export function toDateInputValue(valor: Date | string | null | undefined): string {
  if (!valor) return "";
  return new Date(valor).toISOString().slice(0, 10);
}
