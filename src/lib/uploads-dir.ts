import path from "node:path";

/**
 * Carpeta donde se guarda la evidencia fotográfica cuando no hay Vercel Blob
 * configurado (ver BLOB_READ_WRITE_TOKEN en src/server/modules/shared/upload.ts).
 * Solo pensado para desarrollo local — el filesystem de Vercel es efímero.
 */
export function getUploadsDir(): string {
  return process.env.UPLOADS_DIR || path.join(process.cwd(), "uploads");
}
