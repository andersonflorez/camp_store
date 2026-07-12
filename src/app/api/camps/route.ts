import { NextResponse } from "next/server";
import { getCamps } from "@/actions/camps";

export async function GET() {
    const camps = await getCamps();

    return NextResponse.json(camps, {
        status: 200,
        headers: {
            "Cache-Control": "no-store",
        },
    });
}
