import { NextResponse } from "next/server";
import { upsertVisitor } from "@/lib/db";
import { getDeviceType, getCityFromIP, getClientIP } from "@/lib/geo";

export async function POST(request: Request) {
    try {
        const ip = getClientIP(request);
        const userAgent = request.headers.get("user-agent");
        const deviceType = getDeviceType(userAgent);
        const city = await getCityFromIP(ip);

        upsertVisitor(ip, deviceType, city);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Track error:", error);
        return NextResponse.json(
            { error: "Failed to track visit" },
            { status: 500 }
        );
    }
}
