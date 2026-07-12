import { NextResponse } from "next/server";
import { getTeams } from "@/actions/teams";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const campId = searchParams.get("campId");

    if (!campId) {
        return NextResponse.json({ message: "campId es obligatorio." }, { status: 400 });
    }

    const teams = await getTeams(campId);

    return NextResponse.json(teams, {
        status: 200,
        headers: {
            "Cache-Control": "no-store",
        },
    });
}
