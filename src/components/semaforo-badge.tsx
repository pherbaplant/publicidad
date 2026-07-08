import { Badge } from "@/components/ui/badge";
import type { Semaforo } from "@/server/modules/calculos/motor";

const ESTILOS: Record<Semaforo, string> = {
  verde:
    "border-emerald-500/30 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  amarillo:
    "border-amber-500/30 bg-amber-500/15 text-amber-700 dark:text-amber-400",
  rojo: "border-red-500/30 bg-red-500/15 text-red-700 dark:text-red-400",
};

const ETIQUETAS: Record<Semaforo, string> = {
  verde: "Verde",
  amarillo: "Amarillo",
  rojo: "Rojo",
};

export function SemaforoBadge({ semaforo }: { semaforo: Semaforo | null }) {
  if (!semaforo) {
    return (
      <Badge variant="outline" className="text-muted-foreground">
        Sin datos
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className={ESTILOS[semaforo]}>
      {ETIQUETAS[semaforo]}
    </Badge>
  );
}
