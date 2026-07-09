# Publicidad — Sistema de Evaluación de Desempeño de Campañas Publicitarias (Farmatodo)

## Objetivo del proyecto

Sistema interno para que el equipo de mercadeo/publicidad de Farmatodo registre,
dé seguimiento y evalúe el desempeño de sus campañas publicitarias en tienda.

**El objetivo NO es calcular un ROI financiero perfecto.** El objetivo es producir
una **evaluación ejecutiva, defendible y accionable** del desempeño de cada campaña,
combinando resultado comercial (ROAS) con calidad real de ejecución en punto de venta
(fotos de evidencia, checklist de cumplimiento), para que un gerente pueda decidir
rápido qué campañas/tiendas/responsables funcionaron y cuáles no.

> Nota: Este resumen fue elaborado a partir de los requisitos de diseño y técnicos
> proporcionados. Los puntos marcados como **(propuesta)** son decisiones razonables
> tomadas para completar vacíos de la especificación (p. ej. stack concreto, pesos
> exactos de fórmulas, umbrales de semáforo) y deben confirmarse con el usuario antes
> o durante la implementación.

---

## Stack tecnológico (confirmado)

| Capa | Elección | Motivo |
|---|---|---|
| Frontend | Next.js (React) + TypeScript | SPA moderna tipo SaaS, routing simple, buen soporte responsive |
| UI/estilos | Tailwind CSS + shadcn/ui | Componentes limpios y ejecutivos out-of-the-box (cards, tablas, forms), evita "look de web antigua" |
| Gráficos | Recharts | Gráficos claros para KPIs (barras, líneas, dona) |
| Backend | API routes de Next.js (Node.js) o Express separado | Evita levantar un segundo servicio; todo en un solo proyecto |
| Base de datos | SQLite local persistente (`better-sqlite3` o `prisma` + adapter SQLite) | Requisito explícito: local, persistente, sin servidor externo |
| ORM/queries | Prisma (o SQL directo con better-sqlite3) | Migraciones ordenadas, tipado, mantenibilidad |
| Validación de formularios | Zod + React Hook Form | Validaciones consistentes cliente/servidor |
| Exportación PDF | `pdf-lib` o `@react-pdf/renderer` | Reportes ejecutivos descargables |
| Exportación Excel | `exceljs` o `xlsx` (SheetJS) | Exportar tablas de datos |
| Carga de imágenes | Almacenamiento en filesystem local (`/uploads`) + referencia de ruta en SQLite | Evidencia fotográfica de ejecución en tienda |
| Autenticación (si aplica) | (propuesta) simple, por rol: Admin / Responsable de campaña / Solo lectura | No especificado en el requerimiento original |

---

## Módulos del sistema

1. **Campañas** — CRUD de campañas publicitarias (nombre, período, objetivo, inversión total).
2. **Tiendas** — Catálogo de tiendas Farmatodo (nombre, ciudad, formato).
3. **Ciudades** — Catálogo de ciudades donde operan las tiendas.
4. **Productos** — Catálogo de productos/marcas promocionados en campañas.
5. **Responsables** — Personas del equipo de mercadeo/publicidad a cargo de ejecutar y/o supervisar cada campaña por tienda.
6. **Ejecución en tienda** — Registro por combinación campaña × tienda × producto: inversión asignada, ventas atribuidas, fecha, responsable, evidencia fotográfica.
7. **Categorías de calidad de ejecución** — Checklist/rúbrica de cumplimiento en punto de venta (ej. exhibición correcta, disponibilidad de stock, material POP instalado, cumplimiento de planograma), calificado por categoría, con foto de soporte.
8. **Cálculos automáticos** — Motor que calcula ROAS e Índice de Desempeño en cuanto se ingresan/editan datos de inversión, ventas y calidad de ejecución.
9. **Dashboard / KPIs** — Tarjetas KPI (ROAS promedio, índice de desempeño, campañas en verde/amarillo/rojo, inversión total, etc.), gráficos, filtros (por campaña, tienda, ciudad, producto, responsable, rango de fechas).
10. **Tablas editables** — Vistas tipo grilla para editar registros in-line (campañas, ejecuciones, calidad).
11. **Reportes / Exportación** — Exportación a PDF (reporte ejecutivo) y Excel (datos crudos) por campaña, tienda o período.

---

## Modelo de relaciones (entidades clave)

```
Ciudad (1) ──< Tienda (N)
Campaña (1) ──< Ejecución (N) >── (1) Tienda
Producto (1) ──< Ejecución (N)
Responsable (1) ──< Ejecución (N)
Ejecución (1) ──< Evaluación de Calidad de Ejecución (N)   [una o más categorías por ejecución]
Evaluación de Calidad (1) ──< Evidencia fotográfica (N)
```

- Una **Campaña** se ejecuta en una o más **Tiendas**, para uno o más **Productos**.
- Cada **Tienda** pertenece a una **Ciudad** (permite agregación geográfica de resultados).
- Cada registro de **Ejecución** (campaña + tienda + producto) tiene un **Responsable**
  y recibe una o más calificaciones de **calidad de ejecución** (con evidencia foto).
- El **ROAS** y el **Índice de Desempeño** se calculan a nivel de Ejecución y se
  agregan (promedio ponderado por inversión) a nivel de Campaña, Tienda, Ciudad o Producto
  para el dashboard.

---

## Fórmulas

### ROAS (Return on Ad Spend)

```
ROAS = Ventas atribuidas a la campaña / Inversión publicitaria de la campaña
```

- Se calcula por **Ejecución** (campaña × tienda × producto) y se agrega hacia arriba
  (suma de ventas / suma de inversión, no promedio simple de ROAS) para evitar distorsión
  por ejecuciones de bajo monto.
- "Ventas atribuidas" es la venta incremental estimada durante el período de campaña en
  esa tienda/producto (dato que ingresa el equipo, no se pretende un modelo de atribución
  financiero perfecto — de ahí el objetivo "ejecutivo, defendible y accionable").

### Índice de Desempeño (fórmula confirmada)

Combina resultado comercial con calidad real de ejecución y disciplina operativa, para que
una campaña con buen resultado de ventas pero mala ejecución en tienda (o viceversa) no se
evalúe solo por una dimensión:

```
Índice de Desempeño = (0.40 × Score_Incremento_Ventas)
                     + (0.30 × Score_Calidad_Ejecución)
                     + (0.20 × Score_Cobertura_Tiendas)
                     + (0.10 × Score_Cumplimiento_Tiempos)
```

- **Score_Incremento_Ventas** (0–100): normalización del incremento/crecimiento de ventas
  atribuido a la campaña (ventas atribuidas vs. meta de ventas de la campaña).
- **Score_Calidad_Ejecución** (0–100): promedio de las categorías de calidad de ejecución
  calificadas (checklist ponderado), a nivel de Ejecución.
- **Score_Cobertura_Tiendas** (0–100): % de tiendas planificadas para la campaña que
  efectivamente registraron ejecución (tiendas ejecutadas / tiendas meta).
- **Score_Cumplimiento_Tiempos** (0–100): % de ejecuciones registradas dentro del período
  planificado de la campaña (sin atrasos respecto a la fecha planificada).
- Pesos **confirmados por el usuario**: 40% / 30% / 20% / 10%. Deben ser configurables desde
  el sistema (tabla de configuración), no fijos en código, para permitir ajustes futuros sin
  redeploy.

### Semáforo visual (propuesta de umbrales)

| Índice de Desempeño | Semáforo |
|---|---|
| ≥ 80 | 🟢 Verde |
| 60–79 | 🟡 Amarillo |
| < 60 | 🔴 Rojo |

(Umbrales configurables, no deben quedar hardcodeados.)

---

## Requisitos de diseño (UI/UX)

- Interfaz moderna tipo SaaS/dashboard (no "web antigua").
- Menú lateral de navegación.
- Tarjetas KPI en la vista principal.
- Gráficos claros (no sobrecargados).
- Tablas editables in-line.
- Formularios simples, con validación clara y mensajes de error legibles.
- Semáforos visuales (verde/amarillo/rojo) para desempeño.
- Filtros visibles y accesibles (no ocultos en menús secundarios).
- Diseño profesional, limpio, ejecutivo.
- 100% responsive (desktop y tablet como mínimo).

## Requisitos técnicos

- Base de datos SQLite local persistente (no en memoria).
- CRUD completo en todos los módulos (Campañas, Tiendas, Productos, Ciudades, Responsables, Ejecuciones, Calidad de ejecución).
- Validaciones de formularios en cliente y servidor.
- Cálculos automáticos de ROAS e Índice de Desempeño (no manuales).
- Exportación a PDF.
- Exportación a Excel.
- Carga de imágenes como evidencia de ejecución en tienda.
- Código ordenado, escalable y mantenible (separación por módulos/dominios, sin lógica de negocio mezclada en la UI).

---

## Estructura técnica del proyecto (Paso 1 — completado)

Proyecto base creado con `create-next-app` (App Router, TypeScript, Tailwind v4) +
`shadcn/ui` + Prisma 7 con driver adapter `@prisma/adapter-better-sqlite3` (SQLite local
persistente en `dev.db`, no committeado; se recrea con `npx prisma migrate dev`).

```
prisma/
  schema.prisma       # modelos: Ciudad, Tienda, Producto, Responsable, Campana,
                      # Ejecucion, CategoriaCalidad, EvaluacionCalidad,
                      # EvidenciaFotografica, Configuracion (pesos/umbrales editables)
  migrations/
prisma.config.ts      # datasource + adapter better-sqlite3 para `prisma migrate`
src/
  app/                # rutas Next.js (páginas + futuras API routes)
  components/ui/      # primitivos shadcn/ui
  lib/
    prisma.ts          # singleton de PrismaClient con el adapter better-sqlite3
    utils.ts            # helper de shadcn (cn)
  generated/prisma/     # cliente Prisma generado (gitignored)
  server/modules/<dominio>/   # (a crear por módulo: campanas, tiendas, ciudades,
                              # productos, responsables, ejecuciones, calidad —
                              # lógica de negocio y acceso a datos separada de la UI)
uploads/               # evidencia fotográfica (gitignored salvo .gitkeep)
```

Convención: la lógica de negocio (cálculo de ROAS, Índice de Desempeño, agregaciones)
vive en `src/server/modules/<dominio>`, nunca directamente en componentes de UI ni en
route handlers — estos últimos solo orquestan la llamada al módulo correspondiente.

## Decisiones confirmadas

- **Stack**: Next.js + TypeScript + Tailwind/shadcn + Prisma + SQLite — **aprobado**.
- **Pesos del Índice de Desempeño**: 40% incremento de ventas, 30% calidad de ejecución,
  20% cobertura de tiendas ejecutadas, 10% cumplimiento de tiempos — **confirmado**.

## Puntos abiertos a confirmar con el usuario

1. Umbrales exactos del semáforo (se mantiene la propuesta ≥80 verde / 60–79 amarillo / <60 rojo salvo indicación contraria).
2. Lista definitiva de categorías de calidad de ejecución a evaluar.
3. ¿Se requiere manejo de usuarios/roles y autenticación, o es de un solo usuario/equipo sin login?
4. ¿Cómo se define exactamente "ventas atribuidas" (dato manual ingresado por el responsable, o integración con otro sistema)?
