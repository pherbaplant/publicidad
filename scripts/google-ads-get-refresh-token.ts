import "dotenv/config";
import http from "node:http";
import { OAuth2Client } from "google-auth-library";

// Genera un refresh token de Google Ads OAuth2 usando el flujo de aplicación
// de escritorio (RFC 8252, redirect a loopback). DEBE ejecutarse en tu propia
// máquina local (no en un entorno remoto/CI): el navegador redirige a
// http://localhost, así que el servidor que recibe el código tiene que estar
// escuchando en el mismo equipo donde abres el navegador.
//
// Uso:
//   1. En Google Cloud Console, tu cliente OAuth debe ser de tipo "Desktop app".
//   2. Define GOOGLE_ADS_CLIENT_ID y GOOGLE_ADS_CLIENT_SECRET en .env.local.
//   3. npm run google-ads:auth
//   4. Abre la URL impresa, inicia sesión y autoriza.
//   5. El refresh token se imprime en esta terminal. Guárdalo en
//      GOOGLE_ADS_REFRESH_TOKEN dentro de .env.local (nunca lo commitees).

const PORT = 8080;
const REDIRECT_URI = `http://localhost:${PORT}/oauth2callback`;
const SCOPE = "https://www.googleapis.com/auth/adwords";

const clientId = process.env.GOOGLE_ADS_CLIENT_ID;
const clientSecret = process.env.GOOGLE_ADS_CLIENT_SECRET;

if (!clientId || !clientSecret) {
  console.error(
    "Faltan GOOGLE_ADS_CLIENT_ID y/o GOOGLE_ADS_CLIENT_SECRET en el entorno.\n" +
      "Defínelos en .env.local (no los pegues directamente en este archivo).",
  );
  process.exit(1);
}

const oauth2Client = new OAuth2Client({ clientId, clientSecret, redirectUri: REDIRECT_URI });

const authUrl = oauth2Client.generateAuthUrl({
  access_type: "offline",
  prompt: "consent",
  scope: [SCOPE],
});

console.log("\nAbre esta URL en tu navegador e inicia sesión con la cuenta de Google Ads:\n");
console.log(authUrl + "\n");
console.log(`Esperando el redirect en ${REDIRECT_URI} ...\n`);

const server = http.createServer(async (req, res) => {
  if (!req.url?.startsWith("/oauth2callback")) {
    res.writeHead(404).end();
    return;
  }

  const url = new URL(req.url, REDIRECT_URI);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");

  if (error) {
    res.writeHead(400, { "Content-Type": "text/html; charset=utf-8" });
    res.end(`<h1>Autorización rechazada</h1><p>${error}</p>`);
    console.error(`Autorización rechazada: ${error}`);
    server.close();
    process.exit(1);
  }

  if (!code) {
    res.writeHead(400).end("Falta el parámetro 'code'.");
    return;
  }

  try {
    const { tokens } = await oauth2Client.getToken({ code, redirect_uri: REDIRECT_URI });
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end("<h1>Listo, ya puedes cerrar esta pestaña.</h1>");

    console.log("Refresh token obtenido:\n");
    console.log(tokens.refresh_token ?? "(no se recibió refresh_token — revisa que prompt=consent y access_type=offline estén activos, y que no exista ya un consentimiento previo sin revocar)");
    console.log("\nGuárdalo como GOOGLE_ADS_REFRESH_TOKEN en tu .env.local. No lo commitees.\n");
  } catch (err) {
    res.writeHead(500).end("Error intercambiando el código por tokens.");
    console.error("Error intercambiando el código por tokens:", err);
  } finally {
    server.close();
  }
});

server.listen(PORT);
