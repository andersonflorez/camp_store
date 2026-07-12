"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

interface TeamInput {
    campId: string;
    name: string;
    color: string;
    displayOrder: number;
    active: boolean;
}

function parseDisplayOrder(value: number) {
    if (!Number.isFinite(value)) {
        return 0;
    }

    return Math.max(0, Math.trunc(value));
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
    revalidatePath(`/dashboard/camp/${campId}/teams`);
    revalidatePath(`/dashboard/camp/${campId}/activities`);
    revalidatePath(`/dashboard/camp/${campId}/ranking`);

    if (camp) {
        revalidatePath(`/public/${camp.slug}`);
    }
}

export async function getTeams(campId: string) {
    return prisma.team.findMany({
        where: {
            campId,
        },
        orderBy: [
            {
                displayOrder: "asc",
            },
            {
                createdAt: "asc",
            },
        ],
    });
}

export async function createTeam(input: TeamInput) {
    const name = input.name.trim();

    if (!name) {
        throw new Error("El nombre del equipo es obligatorio.");
    }

    await prisma.team.create({
        data: {
            campId: input.campId,
            name,
            color: input.color,
            displayOrder: parseDisplayOrder(input.displayOrder),
            active: input.active,
        },
    });

    await revalidateCampViews(input.campId);
}

export async function updateTeam(id: string, input: Omit<TeamInput, "campId">) {
    const name = input.name.trim();

    if (!name) {
        throw new Error("El nombre del equipo es obligatorio.");
    }

    const updated = await prisma.team.update({
        where: {
            id,
        },
        data: {
            name,
            color: input.color,
            displayOrder: parseDisplayOrder(input.displayOrder),
            active: input.active,
        },
        select: {
            campId: true,
        },
    });

    await revalidateCampViews(updated.campId);
}

export async function deleteTeam(id: string) {
    const team = await prisma.team.findUnique({
        where: {
            id,
        },
        select: {
            campId: true,
        },
    });

    if (!team) {
        return;
    }

    await prisma.team.delete({
        where: {
            id,
        },
    });

    await revalidateCampViews(team.campId);
}
