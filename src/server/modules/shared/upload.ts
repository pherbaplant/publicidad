import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { getUploadsDir } from "@/lib/uploads-dir";

const EXTENSIONES_PERMITIDAS = new Set([".jpg", ".jpeg", ".png", ".webp"]);

/** Guarda una foto de evidencia en el directorio de uploads y devuelve su ruta relativa. */
export async function guardarEvidencia(file: File): Promise<string> {
  const extension = path.extname(file.name).toLowerCase();
  if (!EXTENSIONES_PERMITIDAS.has(extension)) {
    throw new Error("Formato de imagen no soportado (usa JPG, PNG o WEBP)");
  }

  const uploadsDir = getUploadsDir();
  await mkdir(uploadsDir, { recursive: true });

  const nombreArchivo = `${randomUUID()}${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadsDir, nombreArchivo), buffer);

  return nombreArchivo;
}
