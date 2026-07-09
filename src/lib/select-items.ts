/**
 * Base UI's <Select.Value> only renders the raw value unless the Root is given
 * an `items` map of value -> label — this builds that map from a list of
 * `{ id, nombre }` catalog entries.
 */
export function itemsDesdeLista(lista: { id: number; nombre: string }[]) {
  return Object.fromEntries(lista.map((item) => [String(item.id), item.nombre]));
}
