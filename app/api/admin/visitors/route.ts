import { NextRequest, NextResponse } from "next/server";
import { getVisitors, getVisitorStats, validateSession } from "@/lib/db";

export async function GET(request: NextRequest) {
    const token = request.cookies.get("admin_session")?.value;

    if (!validateSession(token)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const visitors = getVisitors();
        const stats = getVisitorStats();

        return NextResponse.json({ visitors, stats });
    } catch (error) {
        console.error("Visitors error:", error);
        return NextResponse.json(
            { error: "Klaida gaunant lankytojų duomenis" },
            { status: 500 }
        );
    }
}
