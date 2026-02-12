import { NextResponse } from "next/server";
import { insertSubmission } from "@/lib/db";
import { getDeviceType, getCityFromIP, getClientIP } from "@/lib/geo";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, phone, message } = body;

        // Validate email
        if (!email || typeof email !== "string" || !email.includes("@")) {
            return NextResponse.json(
                { error: "Prašome įvesti teisingą el. pašto adresą" },
                { status: 400 }
            );
        }

        const ip = getClientIP(request);
        const userAgent = request.headers.get("user-agent");
        const deviceType = getDeviceType(userAgent);
        const city = await getCityFromIP(ip);

        insertSubmission(
            email.trim(),
            phone?.trim() || null,
            message?.trim() || null,
            ip,
            deviceType,
            city
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Contact error:", error);
        return NextResponse.json(
            { error: "Nepavyko išsiųsti žinutės" },
            { status: 500 }
        );
    }
}
