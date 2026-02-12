import { NextRequest, NextResponse } from "next/server";
import { getSubmissions, validateSession } from "@/lib/db";

export async function GET(request: NextRequest) {
    const token = request.cookies.get("admin_session")?.value;

    if (!validateSession(token)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const submissions = getSubmissions();
        return NextResponse.json({ submissions });
    } catch (error) {
        console.error("Submissions error:", error);
        return NextResponse.json(
            { error: "Klaida gaunant žinučių duomenis" },
            { status: 500 }
        );
    }
}
