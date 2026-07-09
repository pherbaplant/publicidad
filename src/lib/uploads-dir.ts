import path from "node:path";

/**
 * Carpeta donde se guarda la evidencia fotográfica. En producción debe
 * apuntar a un disco persistente (ver UPLOADS_DIR en .env.example) — el
 * filesystem del contenedor en sí no sobrevive a un redeploy.
 */
export function getUploadsDir(): string {
  return process.env.UPLOADS_DIR || path.join(process.cwd(), "uploads");
}
