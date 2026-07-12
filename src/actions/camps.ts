"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export interface CampFormData {
  name: string;
  slug?: string;
}

export async function getCamps() {
  return prisma.camp.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      createdAt: true,
      _count: {
        select: {
          teams: {
            where: {
              active: true,
            },
          },
          activities: true,
        },
      },
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
    select: {
      id: true,
      name: true,
      slug: true,
      createdAt: true,
    },
  });
}

export async function getCampBySlug(slug: string) {
  return prisma.camp.findUnique({
    where: {
      slug,
    },
    select: {
      id: true,
      name: true,
      slug: true,
      createdAt: true,
    },
  });
}

function getValidatedCampInput(data: CampFormData) {
  const name = data.name.trim();
  const rawSlug = data.slug?.trim() || name;
  const slug = slugify(rawSlug);

  if (!name) {
    throw new Error("El nombre es obligatorio.");
  }

  if (!slug) {
    throw new Error("El slug es obligatorio.");
  }

  return {
    name,
    slug,
  };
}

export async function createCamp(data: CampFormData) {
  const input = getValidatedCampInput(data);

  await prisma.camp.create({
    data: {
      name: input.name,
      slug: input.slug,
    },
  });

  revalidatePath("/");
  revalidatePath("/dashboard");
}

export async function updateCamp(id: string, data: CampFormData) {
  const input = getValidatedCampInput(data);

  await prisma.camp.update({
    where: {
      id,
    },
    data: {
      name: input.name,
      slug: input.slug,
    },
  });

  revalidatePath("/");
  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/camp/${id}`);
  revalidatePath(`/public/${input.slug}`);
}

export async function deleteCamp(id: string) {
  const camp = await prisma.camp.findUnique({
    where: {
      id,
    },
    select: {
      slug: true,
    },
  });

  await prisma.camp.delete({
    where: {
      id,
    },
  });

  revalidatePath("/");
  revalidatePath("/dashboard");

  if (camp) {
    revalidatePath(`/public/${camp.slug}`);
  }
}