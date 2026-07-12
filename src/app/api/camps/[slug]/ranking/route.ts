import { NextResponse } from "next/server";
import { getRankingBySlug } from "@/lib/ranking";

interface Context {
    params: Promise<{
        slug: string;
    }>;
}

export async function GET(_: Request, context: Context) {
    const { slug } = await context.params;
    const payload = await getRankingBySlug(slug);

    if (!payload) {
        return NextResponse.json({ message: "Campamento no encontrado." }, { status: 404 });
    }

    return NextResponse.json(payload, {
        status: 200,
        headers: {
            "Cache-Control": "no-store",
        },
    });
}
