"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

interface TeamScore {
  teamId: string;
  points: number;
}

interface CreateActivityInput {
  campId: string;
  name: string;
  scores: TeamScore[];
}

async function revalidateCampViews(campId: string) {
  const camp = await prisma.camp.findUnique({
    where: {
      id: campId,
    },
    select: {
      slug: true,
    },
  });

  revalidatePath(`/dashboard/camp/${campId}`);
  revalidatePath(`/dashboard/camp/${campId}/activities`);
  revalidatePath(`/dashboard/camp/${campId}/ranking`);

  if (camp) {
    revalidatePath(`/public/${camp.slug}`);
  }
}

export async function createActivity(data: CreateActivityInput) {
  const name = data.name.trim();

  if (!name) {
    throw new Error("El nombre de la actividad es obligatorio.");
  }

  const teams = await prisma.team.findMany({
    where: {
      campId: data.campId,
      active: true,
    },
    select: {
      id: true,
    },
    orderBy: {
      displayOrder: "asc",
    },
  });

  if (teams.length === 0) {
    throw new Error("Debe existir al menos un equipo activo.");
  }

  const pointsByTeamId = new Map(
    data.scores.map((score) => [score.teamId, Number(score.points) || 0])
  );

  await prisma.$transaction(async (tx) => {
    const activity = await tx.activity.create({
      data: {
        campId: data.campId,
        name,
      },
    });

    await tx.activityScore.createMany({
      data: teams.map((team) => ({
        activityId: activity.id,
        teamId: team.id,
        points: pointsByTeamId.get(team.id) ?? 0,
      })),
    });
  });

  await revalidateCampViews(data.campId);
}

export async function deleteActivity(id: string, campId: string) {
  await prisma.activity.delete({
    where: {
      id,
    },
  });

  await revalidateCampViews(campId);
}

export async function getActivities(campId: string) {
  return prisma.activity.findMany({
    where: {
      campId,
    },
    include: {
      scores: {
        include: {
          team: true,
        },
        orderBy: {
          team: {
            displayOrder: "asc",
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}