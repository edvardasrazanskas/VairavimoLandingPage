import { NextResponse } from "next/server";
import { createSession } from "@/lib/db";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { password } = body;

        const adminPassword = process.env.ADMIN_PASSWORD || "changeme";

        if (password !== adminPassword) {
            return NextResponse.json(
                { error: "Neteisingas slaptažodis" },
                { status: 401 }
            );
        }

        const token = createSession();

        const response = NextResponse.json({ success: true });
        response.cookies.set("admin_session", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 24, // 24 hours
            path: "/",
        });

        return response;
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            { error: "Prisijungimo klaida" },
            { status: 500 }
        );
    }
}
