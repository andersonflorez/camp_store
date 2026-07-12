import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Limpiar la base de datos
  await prisma.activityScore.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.team.deleteMany();
  await prisma.camp.deleteMany();

  // Crear campamento
  const camp = await prisma.camp.create({
    data: {
      name: "Campamento Jóvenes 2027",
      slug: "campamento-jovenes-2027",
    },
  });

  // Crear equipos
  const teams = await Promise.all([
    prisma.team.create({
      data: {
        campId: camp.id,
        name: "Logos",
        color: "#D32F2F",
        displayOrder: 1,
      },
    }),
    prisma.team.create({
      data: {
        campId: camp.id,
        name: "Anastrofé",
        color: "#000000",
        displayOrder: 2,
      },
    }),
    prisma.team.create({
      data: {
        campId: camp.id,
        name: "Pistis",
        color: "#FFFFFF",
        displayOrder: 3,
      },
    }),
    prisma.team.create({
      data: {
        campId: camp.id,
        name: "Ágape",
        color: "#D9C6A5",
        displayOrder: 4,
      },
    }),
    prisma.team.create({
      data: {
        campId: camp.id,
        name: "Hagneia",
        color: "#9E9E9E",
        displayOrder: 5,
      },
    }),
  ]);

  const activities = [
    {
      name: "Carrera de Relevos",
      points: [100, 80, 60, 40, 20],
    },
    {
      name: "Trivia Bíblica",
      points: [40, 100, 80, 60, 20],
    },
    {
      name: "Construcción",
      points: [20, 40, 100, 80, 60],
    },
    {
      name: "Búsqueda del Tesoro",
      points: [80, 20, 40, 100, 60],
    },
    {
      name: "Penalización",
      points: [0, -20, 0, 0, -10],
    },
  ];

  for (const activityData of activities) {
    const activity = await prisma.activity.create({
      data: {
        campId: camp.id,
        name: activityData.name,
      },
    });

    await prisma.activityScore.createMany({
      data: teams.map((team, index) => ({
        activityId: activity.id,
        teamId: team.id,
        points: activityData.points[index] ?? 0,
      })),
    });
  }

  console.log("✅ Seed ejecutado correctamente.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });