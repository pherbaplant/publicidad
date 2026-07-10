import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { put } from "@vercel/blob";
import { getUploadsDir } from "@/lib/uploads-dir";

const EXTENSIONES_PERMITIDAS = new Set([".jpg", ".jpeg", ".png", ".webp"]);

/**
 * Guarda una foto de evidencia y devuelve la referencia a almacenar en
 * `EvidenciaFotografica.rutaArchivo`.
 *
 * En Vercel el filesystem es efímero (no sobrevive entre invocaciones ni
 * redeploys), así que si hay token de Vercel Blob configurado subimos ahí y
 * guardamos la URL pública completa. En desarrollo local (sin token) caemos
 * al disco local, servido por /api/uploads/[filename].
 */
export async function guardarEvidencia(file: File): Promise<string> {
  const extension = path.extname(file.name).toLowerCase();
  if (!EXTENSIONES_PERMITIDAS.has(extension)) {
    throw new Error("Formato de imagen no soportado (usa JPG, PNG o WEBP)");
  }

  const nombreArchivo = `${randomUUID()}${extension}`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { url } = await put(nombreArchivo, file, { access: "public" });
    return url;
  }

  const uploadsDir = getUploadsDir();
  await mkdir(uploadsDir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadsDir, nombreArchivo), buffer);

  return nombreArchivo;
}
