# Despliegue en Vercel + Postgres (Neon o Supabase)

Este proyecto usa Postgres (no SQLite) para poder desplegarse gratis en
Vercel. Vercel es serverless: el filesystem de cada función es efímero, así
que ni la base de datos ni las fotos de evidencia pueden vivir en disco local
— la base de datos vive en un Postgres administrado (Neon o Supabase, ambos
con capa gratuita) y las fotos en Vercel Blob.

## 1. Crear la base de datos (Neon o Supabase)

Cualquiera de las dos funciona igual de bien; ambas exponen dos tipos de
conexión que este proyecto necesita:

- **Pooled** (para la app en runtime): pasa por un pgBouncer/pooler, soporta
  muchas conexiones concurrentes de funciones serverless.
- **Direct** (solo para migraciones): conexión directa a Postgres, sin pooler.

**Neon** (neon.tech):
1. Crea un proyecto → una base de datos.
2. En *Connection Details*, copia la connection string que **incluye
   `-pooler`** en el host → esa es `DATABASE_URL`.
3. Copia la connection string **sin `-pooler`** → esa es `DIRECT_URL`.

**Supabase** (supabase.com):
1. Crea un proyecto.
2. En *Project Settings → Database → Connection string*:
   - Modo **Transaction** (puerto `6543`) → `DATABASE_URL`.
   - Modo **Session** (puerto `5432`) → `DIRECT_URL`.

Ambas deben incluir `?sslmode=require` (Neon lo agrega solo; en Supabase
revisa que esté presente).

## 2. Aplicar el schema a la base de datos nueva

El script `build` (`prisma generate && prisma migrate deploy && next build`,
ver package.json) aplica las migraciones pendientes automáticamente en cada
build de Vercel — no hace falta correr nada a mano para crear las tablas.
`prisma migrate deploy` nunca borra datos ni reaplica migraciones ya
aplicadas; si la conexión falla, el build falla con un error claro
(`P1001: Can't reach database server`) en vez de desplegar algo roto en
silencio.

Si preferís aplicarlas manualmente desde tu máquina antes del primer deploy
(por ejemplo para revisar el resultado vos mismo), con `DATABASE_URL` y
`DIRECT_URL` apuntando a la base real:

```bash
npx prisma migrate deploy
```

Para cargar el set de datos de ejemplo (esto sí es manual, correlo desde tu
máquina apuntando a la base real):

```bash
npm run seed
```

## 3. Crear el Blob Store para evidencia fotográfica

En el dashboard de Vercel: **Storage → Create → Blob**. Conéctalo a este
proyecto — Vercel inyecta automáticamente la variable `BLOB_READ_WRITE_TOKEN`
en producción, no hace falta configurarla a mano.

## 4. Variables de entorno en Vercel

**Project Settings → Environment Variables:**

| Variable | Valor |
|---|---|
| `DATABASE_URL` | connection string **pooled** (Neon `-pooler` / Supabase puerto 6543) |
| `DIRECT_URL` | connection string **directa** (Neon sin `-pooler` / Supabase puerto 5432) |
| `BLOB_READ_WRITE_TOKEN` | la inyecta Vercel solo al conectar el Blob Store (paso 3) — no la agregues a mano |

No hace falta `UPLOADS_DIR` en Vercel (solo aplica al fallback de disco local
en desarrollo).

## 5. Deploy

Conecta el repo en Vercel (Import Project) y despliega — no requiere
configuración de build adicional:

- `postinstall` corre `prisma generate` automáticamente.
- El script `build` corre `prisma migrate deploy` antes de `next build`, así
  que las tablas se crean/actualizan solas en cada deploy (ver paso 2). Para
  esto `DIRECT_URL` (conexión sin pooler) tiene que estar bien configurada en
  Vercel — si no puede conectar, el build falla con un error claro en vez de
  desplegar algo roto.
- `next build` en sí no lee de la base de datos más allá de eso
  (`force-dynamic` en el layout raíz evita el prerenderizado estático de
  páginas que consultan la BD).

## Desarrollo local

Podés usar la misma base Neon/Supabase también en desarrollo (más simple), o
levantar Postgres local. En ambos casos definí `DATABASE_URL` y `DIRECT_URL`
en tu `.env` (ver `.env.example`). Sin `BLOB_READ_WRITE_TOKEN` configurado,
las fotos de evidencia se guardan en `./uploads` y se sirven vía
`/api/uploads/[filename]` — solo para desarrollo, no persiste en Vercel.

## Verificar que quedó bien

- El deploy no debe fallar en `prisma generate` (postinstall) ni en el build.
- Abrí la app y confirmá que el Dashboard carga KPIs (si corriste el seed).
- Creá un registro (por ejemplo una Ciudad) y confirmá que sigue ahí después
  de un redeploy — así confirmás que apunta a la base real, no a una vacía.
- Subí una foto de evidencia en una Ejecución y confirmá que se ve después de
  un redeploy — así confirmás que el Blob Store quedó bien conectado.
