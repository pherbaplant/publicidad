# Despliegue en un host con disco persistente (Railway / Render)

Este proyecto usa SQLite en un archivo local (`better-sqlite3`) para persistencia,
tal como pide `CLAUDE.md` ("base de datos local, sin servidor externo"). Eso
**no funciona en plataformas serverless como Vercel** (filesystem efímero de
solo lectura), pero funciona perfecto en cualquier host que te dé un proceso
persistente + un disco/volumen persistente — como Railway o Render.

El repo ya incluye un `Dockerfile` listo para ambas plataformas. Los pasos son
casi idénticos; solo cambia dónde configuras el volumen y las variables de entorno.

## Qué hace el proyecto al arrancar

`npm run start` corre `prisma migrate deploy && next start`: aplica las
migraciones pendientes contra la base de datos indicada en `DATABASE_URL` y
luego levanta el servidor. Es seguro correrlo en cada arranque del contenedor
(no re-aplica migraciones ya aplicadas).

## Variables de entorno requeridas

Configura estas dos apuntando a rutas **dentro del volumen persistente** que
montes (no a rutas relativas del proyecto — el resto del filesystem del
contenedor se descarta en cada redeploy):

| Variable | Valor recomendado |
|---|---|
| `DATABASE_URL` | `file:/data/prod.db` |
| `UPLOADS_DIR` | `/data/uploads` |

`/data` es el punto de montaje que se usa en los pasos de abajo; puedes usar
otro nombre siempre que sea consistente entre el volumen y estas dos variables.

---

## Railway

1. **New Project → Deploy from GitHub repo**, elige este repositorio.
2. Railway detecta el `Dockerfile` automáticamente y lo usa para el build
   (no hace falta configurar nada del build command).
3. **Agrega un Volume**: en el servicio, pestaña *Settings → Volumes → New Volume*.
   Móntalo en `/data`.
4. **Variables de entorno**: pestaña *Variables*, agrega:
   - `DATABASE_URL=file:/data/prod.db`
   - `UPLOADS_DIR=/data/uploads`
5. Railway expone el puerto automáticamente (el contenedor escucha en `3000`,
   ver `EXPOSE 3000` en el Dockerfile) — no necesitas configurar el puerto manualmente.
6. Deploy. En los logs deberías ver `Applying migration ...` seguido de
   `Ready in ...ms`.

## Render

1. **New → Web Service**, conecta este repositorio.
2. **Runtime**: elige *Docker* (Render detecta el `Dockerfile`).
3. **Agrega un Disk**: pestaña *Disks → Add Disk*. Móntalo en `/data`
   (elige el tamaño según cuántas fotos de evidencia esperas acumular).
4. **Environment**: agrega las mismas dos variables:
   - `DATABASE_URL=file:/data/prod.db`
   - `UPLOADS_DIR=/data/uploads`
5. Render detecta el puerto expuesto automáticamente. Deploy.

---

## Primera carga de datos

Después del primer deploy la base queda vacía (las migraciones crean las
tablas, pero no hay datos). Para cargar el set de ejemplo, corre el seed
**desde tu máquina apuntando a la base remota**, o agrega un paso manual desde
la consola/shell de la plataforma (ambas ofrecen un "Shell"/"Run command"
sobre el servicio ya desplegado):

```bash
npm run seed
```

Esto usa el mismo `DATABASE_URL` configurado en el entorno donde lo corras.

## Verificar que quedó bien

- Los logs de arranque deben mostrar `All migrations have been successfully applied.`
  seguido de `Ready in ...ms` — si ves un error de SQLite ahí, revisa que
  `DATABASE_URL` apunte dentro del volumen montado (no a una ruta que no existe).
- Crea un registro (por ejemplo una Ciudad), luego fuerza un redeploy manual
  sin cambiar código — si el registro sigue ahí, el volumen persistente está
  bien configurado. Si desapareció, el volumen no se montó donde `DATABASE_URL`
  espera.
- Sube una foto de evidencia en una Ejecución y confirma que se ve después de
  un redeploy (mismo chequeo, pero para `UPLOADS_DIR`).
