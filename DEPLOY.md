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

Desde tu máquina, con `DATABASE_URL` y `DIRECT_URL` apuntando a la base real
(puedes ponerlas en tu `.env` local temporalmente, o exportarlas en la shell):

```bash
npx prisma migrate deploy
```

Esto crea todas las tablas (`prisma/migrations/20260709000000_init_postgres`).
Es seguro correrlo varias veces — no reaplica migraciones ya aplicadas.

Para cargar el set de datos de ejemplo:

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
- El build (`next build`) no toca la base de datos (`force-dynamic` en el
  layout raíz evita el prerenderizado estático de páginas que leen de la BD).
- Las migraciones **no** corren en el build de Vercel — se aplican una vez
  manualmente (paso 2) o desde tu máquina cada vez que agregues una migración
  nueva, apuntando `DIRECT_URL` a producción.

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
