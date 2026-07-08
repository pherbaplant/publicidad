import "dotenv/config";
import { prisma } from "@/lib/prisma";
import { recalcularCampana } from "@/server/modules/calculos/recompute";

async function main() {
  console.log("Sembrando datos de ejemplo...");

  const [caracas, valencia, maracaibo] = await Promise.all([
    prisma.ciudad.create({ data: { nombre: "Caracas" } }),
    prisma.ciudad.create({ data: { nombre: "Valencia" } }),
    prisma.ciudad.create({ data: { nombre: "Maracaibo" } }),
  ]);

  const [t1, t2, t3, t4, t5, t6] = await Promise.all([
    prisma.tienda.create({ data: { nombre: "Farmatodo Sabana Grande", formato: "Estándar", ciudadId: caracas.id } }),
    prisma.tienda.create({ data: { nombre: "Farmatodo Las Mercedes", formato: "Express", ciudadId: caracas.id } }),
    prisma.tienda.create({ data: { nombre: "Farmatodo San Diego", formato: "Estándar", ciudadId: valencia.id } }),
    prisma.tienda.create({ data: { nombre: "Farmatodo La Viña", formato: "Express", ciudadId: valencia.id } }),
    prisma.tienda.create({ data: { nombre: "Farmatodo Bella Vista", formato: "Estándar", ciudadId: maracaibo.id } }),
    prisma.tienda.create({ data: { nombre: "Farmatodo El Milagro", formato: "Express", ciudadId: maracaibo.id } }),
  ]);

  const [protectorSolar, multivitaminico, shampoo, analgesico] = await Promise.all([
    prisma.producto.create({ data: { nombre: "Protector Solar FPS50", marca: "La Roche-Posay" } }),
    prisma.producto.create({ data: { nombre: "Multivitamínico", marca: "Centrum" } }),
    prisma.producto.create({ data: { nombre: "Shampoo Anticaspa", marca: "Head & Shoulders" } }),
    prisma.producto.create({ data: { nombre: "Analgésico", marca: "Panadol" } }),
  ]);

  const [maria, carlos, ana] = await Promise.all([
    prisma.responsable.create({ data: { nombre: "María Pérez", email: "maria.perez@farmatodo.com", rol: "Coordinadora de mercadeo" } }),
    prisma.responsable.create({ data: { nombre: "Carlos Gómez", email: "carlos.gomez@farmatodo.com", rol: "Ejecutivo de trade marketing" } }),
    prisma.responsable.create({ data: { nombre: "Ana Rodríguez", email: "ana.rodriguez@farmatodo.com", rol: "Supervisora de tienda" } }),
  ]);

  const [exhibicion, stock, pop, planograma] = await Promise.all([
    prisma.categoriaCalidad.create({ data: { nombre: "Exhibición correcta", descripcion: "El producto está exhibido según lo acordado", peso: 1.5 } }),
    prisma.categoriaCalidad.create({ data: { nombre: "Disponibilidad de stock", descripcion: "Hay inventario suficiente en anaquel", peso: 1.5 } }),
    prisma.categoriaCalidad.create({ data: { nombre: "Material POP instalado", descripcion: "Afiches, cenefas y exhibidores instalados", peso: 1 } }),
    prisma.categoriaCalidad.create({ data: { nombre: "Cumplimiento de planograma", descripcion: "Ubicación conforme al planograma", peso: 1 } }),
  ]);

  // --- Campaña 1: buen desempeño ---------------------------------------
  const solar = await prisma.campana.create({
    data: {
      nombre: "Verano Solar 2026",
      objetivo: "Impulsar ventas de protectores solares en temporada alta",
      fechaInicio: new Date("2026-06-01"),
      fechaFin: new Date("2026-07-15"),
      inversionTotal: 15000,
      metaVentas: 45000,
      metaTiendas: 4,
    },
  });

  const ejecucionesSolar = await Promise.all([
    prisma.ejecucion.create({
      data: {
        campanaId: solar.id,
        tiendaId: t1.id,
        productoId: protectorSolar.id,
        responsableId: maria.id,
        inversionAsignada: 4000,
        ventasAtribuidas: 13500,
        fechaPlanificada: new Date("2026-06-05"),
        fechaEjecucion: new Date("2026-06-04"),
      },
    }),
    prisma.ejecucion.create({
      data: {
        campanaId: solar.id,
        tiendaId: t2.id,
        productoId: protectorSolar.id,
        responsableId: maria.id,
        inversionAsignada: 3500,
        ventasAtribuidas: 11800,
        fechaPlanificada: new Date("2026-06-05"),
        fechaEjecucion: new Date("2026-06-06"),
      },
    }),
    prisma.ejecucion.create({
      data: {
        campanaId: solar.id,
        tiendaId: t3.id,
        productoId: protectorSolar.id,
        responsableId: carlos.id,
        inversionAsignada: 3500,
        ventasAtribuidas: 12200,
        fechaPlanificada: new Date("2026-06-08"),
        fechaEjecucion: new Date("2026-06-07"),
      },
    }),
    prisma.ejecucion.create({
      data: {
        campanaId: solar.id,
        tiendaId: t5.id,
        productoId: protectorSolar.id,
        responsableId: ana.id,
        inversionAsignada: 4000,
        ventasAtribuidas: 9800,
        fechaPlanificada: new Date("2026-06-10"),
        fechaEjecucion: new Date("2026-06-12"),
      },
    }),
  ]);

  for (const ejecucion of ejecucionesSolar) {
    await Promise.all([
      prisma.evaluacionCalidad.create({ data: { ejecucionId: ejecucion.id, categoriaId: exhibicion.id, puntaje: 92 } }),
      prisma.evaluacionCalidad.create({ data: { ejecucionId: ejecucion.id, categoriaId: stock.id, puntaje: 88 } }),
      prisma.evaluacionCalidad.create({ data: { ejecucionId: ejecucion.id, categoriaId: pop.id, puntaje: 95 } }),
      prisma.evaluacionCalidad.create({ data: { ejecucionId: ejecucion.id, categoriaId: planograma.id, puntaje: 90 } }),
    ]);
  }

  // --- Campaña 2: desempeño medio ---------------------------------------
  const defensas = await prisma.campana.create({
    data: {
      nombre: "Refuerza tus Defensas",
      objetivo: "Aumentar ventas de multivitamínicos en temporada de gripe",
      fechaInicio: new Date("2026-05-01"),
      fechaFin: new Date("2026-06-15"),
      inversionTotal: 8000,
      metaVentas: 20000,
      metaTiendas: 4,
    },
  });

  const ejecucionesDefensas = await Promise.all([
    prisma.ejecucion.create({
      data: {
        campanaId: defensas.id,
        tiendaId: t1.id,
        productoId: multivitaminico.id,
        responsableId: carlos.id,
        inversionAsignada: 2500,
        ventasAtribuidas: 5200,
        fechaPlanificada: new Date("2026-05-05"),
        fechaEjecucion: new Date("2026-05-10"),
      },
    }),
    prisma.ejecucion.create({
      data: {
        campanaId: defensas.id,
        tiendaId: t4.id,
        productoId: multivitaminico.id,
        responsableId: ana.id,
        inversionAsignada: 2500,
        ventasAtribuidas: 4600,
        fechaPlanificada: new Date("2026-05-05"),
        fechaEjecucion: null,
      },
    }),
    prisma.ejecucion.create({
      data: {
        campanaId: defensas.id,
        tiendaId: t6.id,
        productoId: multivitaminico.id,
        responsableId: maria.id,
        inversionAsignada: 3000,
        ventasAtribuidas: 6100,
        fechaPlanificada: new Date("2026-05-10"),
        fechaEjecucion: new Date("2026-05-20"),
      },
    }),
  ]);

  const puntajesMedios = [70, 65, 75, 60];
  for (const ejecucion of ejecucionesDefensas) {
    await Promise.all([
      prisma.evaluacionCalidad.create({ data: { ejecucionId: ejecucion.id, categoriaId: exhibicion.id, puntaje: puntajesMedios[0] } }),
      prisma.evaluacionCalidad.create({ data: { ejecucionId: ejecucion.id, categoriaId: stock.id, puntaje: puntajesMedios[1] } }),
      prisma.evaluacionCalidad.create({ data: { ejecucionId: ejecucion.id, categoriaId: pop.id, puntaje: puntajesMedios[2] } }),
      prisma.evaluacionCalidad.create({ data: { ejecucionId: ejecucion.id, categoriaId: planograma.id, puntaje: puntajesMedios[3] } }),
    ]);
  }

  // --- Campaña 3: bajo desempeño ------------------------------------------
  const capilar = await prisma.campana.create({
    data: {
      nombre: "Cuidado Capilar Total",
      objetivo: "Impulsar la línea de shampoos anticaspa",
      fechaInicio: new Date("2026-04-01"),
      fechaFin: new Date("2026-04-30"),
      inversionTotal: 5000,
      metaVentas: 12000,
      metaTiendas: 3,
    },
  });

  const ejecucionesCapilar = await Promise.all([
    prisma.ejecucion.create({
      data: {
        campanaId: capilar.id,
        tiendaId: t2.id,
        productoId: shampoo.id,
        responsableId: ana.id,
        inversionAsignada: 2500,
        ventasAtribuidas: 2100,
        fechaPlanificada: new Date("2026-04-02"),
        fechaEjecucion: new Date("2026-04-18"),
      },
    }),
    prisma.ejecucion.create({
      data: {
        campanaId: capilar.id,
        tiendaId: t5.id,
        productoId: shampoo.id,
        responsableId: carlos.id,
        inversionAsignada: 2500,
        ventasAtribuidas: 1900,
        fechaPlanificada: new Date("2026-04-02"),
        fechaEjecucion: new Date("2026-04-25"),
      },
    }),
  ]);

  const puntajesBajos = [45, 50, 40, 55];
  for (const ejecucion of ejecucionesCapilar) {
    await Promise.all([
      prisma.evaluacionCalidad.create({ data: { ejecucionId: ejecucion.id, categoriaId: exhibicion.id, puntaje: puntajesBajos[0] } }),
      prisma.evaluacionCalidad.create({ data: { ejecucionId: ejecucion.id, categoriaId: stock.id, puntaje: puntajesBajos[1] } }),
      prisma.evaluacionCalidad.create({ data: { ejecucionId: ejecucion.id, categoriaId: pop.id, puntaje: puntajesBajos[2] } }),
      prisma.evaluacionCalidad.create({ data: { ejecucionId: ejecucion.id, categoriaId: planograma.id, puntaje: puntajesBajos[3] } }),
    ]);
  }

  // --- Campaña 4: recién creada, sin ejecuciones aún ----------------------
  await prisma.campana.create({
    data: {
      nombre: "Analgésicos: Alivio Rápido",
      objetivo: "Posicionar la marca Panadol como primera opción de alivio",
      fechaInicio: new Date("2026-08-01"),
      fechaFin: new Date("2026-08-31"),
      inversionTotal: 6000,
      metaVentas: 15000,
      metaTiendas: 3,
    },
  });
  void analgesico;

  await Promise.all([
    recalcularCampana(solar.id),
    recalcularCampana(defensas.id),
    recalcularCampana(capilar.id),
  ]);

  console.log("Datos de ejemplo creados correctamente.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
