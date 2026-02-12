import { NextRequest, NextResponse } from "next/server";
import { getSubmissionsCSV, validateSession } from "@/lib/db";

export async function GET(request: NextRequest) {
    const token = request.cookies.get("admin_session")?.value;

    if (!validateSession(token)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const csv = getSubmissionsCSV();

        return new NextResponse(csv, {
            headers: {
                "Content-Type": "text/csv; charset=utf-8",
                "Content-Disposition":
                    'attachment; filename="submissions.csv"',
            },
        });
    } catch (error) {
        console.error("Export error:", error);
        return NextResponse.json(
            { error: "Klaida eksportuojant duomenis" },
            { status: 500 }
        );
    }
}
