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

export async function createActivity(data: CreateActivityInput) {
  if (!data.name.trim()) {
    throw new Error("El nombre de la actividad es obligatorio.");
  }

  if (data.scores.length === 0) {
    throw new Error("Debe existir al menos un equipo.");
  }

  const activity = await prisma.activity.create({
    data: {
      campId: data.campId,
      name: data.name.trim(),
    },
  });

  await prisma.activityScore.createMany({
    data: data.scores.map((score) => ({
      activityId: activity.id,
      teamId: score.teamId,
      points: Number(score.points) || 0,
    })),
  });

  revalidatePath(`/camp/${data.campId}`);
  revalidatePath(`/camp/${data.campId}/activities`);
  revalidatePath(`/camp/${data.campId}/ranking`);
}

export async function deleteActivity(id: string, campId: string) {
  await prisma.activity.delete({
    where: {
      id,
    },
  });

  revalidatePath(`/camp/${campId}`);
  revalidatePath(`/camp/${campId}/activities`);
  revalidatePath(`/camp/${campId}/ranking`);
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
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}