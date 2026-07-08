import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const UPLOADS_DIR = path.join(process.cwd(), "uploads");

const EXTENSIONES_PERMITIDAS = new Set([".jpg", ".jpeg", ".png", ".webp"]);

/** Guarda una foto de evidencia en /uploads y devuelve su ruta relativa. */
export async function guardarEvidencia(file: File): Promise<string> {
  const extension = path.extname(file.name).toLowerCase();
  if (!EXTENSIONES_PERMITIDAS.has(extension)) {
    throw new Error("Formato de imagen no soportado (usa JPG, PNG o WEBP)");
  }

  await mkdir(UPLOADS_DIR, { recursive: true });

  const nombreArchivo = `${randomUUID()}${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(UPLOADS_DIR, nombreArchivo), buffer);

  return nombreArchivo;
}
