import { readFile } from "node:fs/promises";
import path from "node:path";

const MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;
  const nombreSeguro = path.basename(filename);
  const extension = path.extname(nombreSeguro).toLowerCase();
  const rutaArchivo = path.join(process.cwd(), "uploads", nombreSeguro);

  try {
    const datos = await readFile(rutaArchivo);
    return new Response(new Uint8Array(datos), {
      headers: {
        "Content-Type": MIME[extension] ?? "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("No encontrado", { status: 404 });
  }
}
