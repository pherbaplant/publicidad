import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PaginationLinks({
  pagina,
  totalPaginas,
  basePath,
}: {
  pagina: number;
  totalPaginas: number;
  basePath: string;
}) {
  if (totalPaginas <= 1) return null;

  const hrefPagina = (p: number) => `${basePath}?pagina=${p}`;
  const esPrimera = pagina <= 1;
  const esUltima = pagina >= totalPaginas;

  return (
    <div className="flex items-center justify-between gap-4">
      <p className="text-sm text-muted-foreground">
        Página {pagina} de {totalPaginas}
      </p>
      <div className="flex items-center gap-2">
        {esPrimera ? (
          <Button variant="outline" size="sm" disabled>
            <ChevronLeft /> Anterior
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            nativeButton={false}
            render={
              <Link href={hrefPagina(pagina - 1)}>
                <ChevronLeft /> Anterior
              </Link>
            }
          />
        )}
        {esUltima ? (
          <Button variant="outline" size="sm" disabled>
            Siguiente <ChevronRight />
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            nativeButton={false}
            render={
              <Link href={hrefPagina(pagina + 1)}>
                Siguiente <ChevronRight />
              </Link>
            }
          />
        )}
      </div>
    </div>
  );
}
