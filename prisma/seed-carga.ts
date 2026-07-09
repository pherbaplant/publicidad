import "dotenv/config";
import { prisma } from "@/lib/prisma";
import { recalcularCampana } from "@/server/modules/calculos/recompute";

const PREFIJO = "PERF-";

const N_CIUDADES = 20;
const TIENDAS_POR_CIUDAD = 4;
const N_PRODUCTOS = 30;
const N_RESPONSABLES = 40;
const N_CATEGORIAS = 10;
const N_CAMPANAS = 60;
const EJECUCIONES_POR_CAMPANA_MIN = 10;
const EJECUCIONES_POR_CAMPANA_MAX = 40;

function aleatorio(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function elegir<T>(lista: T[]): T {
  return lista[aleatorio(0, lista.length - 1)];
}

async function main() {
  const inicio = Date.now();
  console.log(`Sembrando dataset de carga (prefijo "${PREFIJO}")...`);

  const ciudades = await Promise.all(
    Array.from({ length: N_CIUDADES }, (_, i) =>
      prisma.ciudad.create({ data: { nombre: `${PREFIJO}Ciudad ${i + 1}` } })
    )
  );

  const tiendas = await Promise.all(
    ciudades.flatMap((ciudad, ci) =>
      Array.from({ length: TIENDAS_POR_CIUDAD }, (_, ti) =>
        prisma.tienda.create({
          data: {
            nombre: `${PREFIJO}Tienda ${ci + 1}-${ti + 1}`,
            formato: ti % 2 === 0 ? "Estándar" : "Express",
            ciudadId: ciudad.id,
          },
        })
      )
    )
  );

  const productos = await Promise.all(
    Array.from({ length: N_PRODUCTOS }, (_, i) =>
      prisma.producto.create({ data: { nombre: `${PREFIJO}Producto ${i + 1}` } })
    )
  );

  const responsables = await Promise.all(
    Array.from({ length: N_RESPONSABLES }, (_, i) =>
      prisma.responsable.create({
        data: { nombre: `${PREFIJO}Responsable ${i + 1}` },
      })
    )
  );

  const categorias = await Promise.all(
    Array.from({ length: N_CATEGORIAS }, (_, i) =>
      prisma.categoriaCalidad.create({
        data: { nombre: `${PREFIJO}Categoría ${i + 1}`, peso: aleatorio(1, 3) },
      })
    )
  );

  console.log(
    `Catálogos creados: ${ciudades.length} ciudades, ${tiendas.length} tiendas, ${productos.length} productos, ${responsables.length} responsables, ${categorias.length} categorías (${Date.now() - inicio}ms)`
  );

  let totalEjecuciones = 0;
  let totalEvaluaciones = 0;

  for (let c = 0; c < N_CAMPANAS; c++) {
    const fechaInicio = new Date(2025, aleatorio(0, 11), aleatorio(1, 28));
    const fechaFin = new Date(fechaInicio);
    fechaFin.setDate(fechaFin.getDate() + aleatorio(20, 60));

    const inversionTotal = aleatorio(2000, 30000);

    const campana = await prisma.campana.create({
      data: {
        nombre: `${PREFIJO}Campaña ${c + 1}`,
        objetivo: "Dataset sintético para prueba de rendimiento",
        fechaInicio,
        fechaFin,
        inversionTotal,
        metaVentas: inversionTotal * aleatorio(2, 4),
        metaTiendas: aleatorio(5, 15),
      },
    });

    const nEjecuciones = aleatorio(EJECUCIONES_POR_CAMPANA_MIN, EJECUCIONES_POR_CAMPANA_MAX);
    const combinacionesUsadas = new Set<string>();

    for (let e = 0; e < nEjecuciones; e++) {
      const tienda = elegir(tiendas);
      const producto = elegir(productos);
      const clave = `${tienda.id}-${producto.id}`;
      if (combinacionesUsadas.has(clave)) continue;
      combinacionesUsadas.add(clave);

      const inversionAsignada = aleatorio(100, 2000);
      const fechaPlanificada = new Date(
        fechaInicio.getTime() + aleatorio(0, 10) * 24 * 60 * 60 * 1000
      );
      const fechaEjecucion = new Date(
        fechaPlanificada.getTime() + aleatorio(-2, 5) * 24 * 60 * 60 * 1000
      );

      const ejecucion = await prisma.ejecucion.create({
        data: {
          campanaId: campana.id,
          tiendaId: tienda.id,
          productoId: producto.id,
          responsableId: elegir(responsables).id,
          inversionAsignada,
          ventasAtribuidas: inversionAsignada * (aleatorio(5, 40) / 10),
          fechaPlanificada,
          fechaEjecucion,
        },
      });
      totalEjecuciones++;

      const nCategoriasEvaluadas = aleatorio(1, categorias.length);
      const categoriasElegidas = [...categorias]
        .sort(() => Math.random() - 0.5)
        .slice(0, nCategoriasEvaluadas);

      await prisma.evaluacionCalidad.createMany({
        data: categoriasElegidas.map((categoria) => ({
          ejecucionId: ejecucion.id,
          categoriaId: categoria.id,
          puntaje: aleatorio(40, 100),
        })),
      });
      totalEvaluaciones += categoriasElegidas.length;
    }

    if ((c + 1) % 10 === 0) {
      console.log(`  ...${c + 1}/${N_CAMPANAS} campañas (${Date.now() - inicio}ms)`);
    }
  }

  console.log(
    `Ejecuciones: ${totalEjecuciones}, evaluaciones: ${totalEvaluaciones} (${Date.now() - inicio}ms)`
  );

  const inicioRecalculo = Date.now();
  const campanas = await prisma.campana.findMany({
    where: { nombre: { startsWith: PREFIJO } },
    select: { id: true },
  });
  for (const { id } of campanas) {
    await recalcularCampana(id);
  }
  console.log(
    `Recalculadas ${campanas.length} campañas en ${Date.now() - inicioRecalculo}ms`
  );

  console.log(`Listo. Tiempo total: ${Date.now() - inicio}ms`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
