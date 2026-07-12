"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export interface CampFormData {
  name: string;
}

export async function getCamps() {
  return prisma.camp.findMany({
    include: {
      teams: {
        where: {
          active: true,
        },
      },
      activities: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getCamp(id: string) {
  return prisma.camp.findUnique({
    where: {
      id,
    },
  });
}

export async function createCamp(data: CampFormData) {
  const name = data.name.trim();

  if (!name) {
    throw new Error("El nombre es obligatorio.");
  }

  const slug = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, "-");

  await prisma.camp.create({
    data: {
      name,
      slug,
    },
  });

  revalidatePath("/");
}

export async function deleteCamp(id: string) {
  await prisma.camp.delete({
    where: {
      id,
    },
  });

  revalidatePath("/");
}