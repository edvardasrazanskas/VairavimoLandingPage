// In-memory cache for IP → city lookups
const cityCache = new Map<string, string>();

export function getDeviceType(userAgent: string | null): string {
    if (!userAgent) return "Unknown";
    const ua = userAgent.toLowerCase();

    if (/bot|spider|crawl|slurp|facebook/i.test(ua)) return "Bot";
    if (/iphone/i.test(ua)) return "iPhone";
    if (/ipad/i.test(ua)) return "Tablet";
    if (/android/i.test(ua)) {
        // Android tablets typically don't have "mobile" in their UA
        if (/mobile/i.test(ua)) return "Android";
        return "Tablet";
    }
    return "Desktop";
}

export async function getCityFromIP(ip: string): Promise<string> {
    // Don't look up private/localhost IPs
    if (
        ip === "127.0.0.1" ||
        ip === "::1" ||
        ip.startsWith("192.168.") ||
        ip.startsWith("10.") ||
        ip.startsWith("172.")
    ) {
        return "Localhost";
    }

    // Check cache first
    if (cityCache.has(ip)) {
        return cityCache.get(ip)!;
    }

    try {
        const res = await fetch(`http://ip-api.com/json/${ip}?fields=city,status`, {
            signal: AbortSignal.timeout(3000),
        });

        if (!res.ok) {
            return "Unknown";
        }

        const data = await res.json();

        if (data.status === "success" && data.city) {
            cityCache.set(ip, data.city);
            return data.city;
        }

        return "Unknown";
    } catch {
        return "Unknown";
    }
}

export function getClientIP(request: Request): string {
    // Traefik forwards real IP via x-forwarded-for
    const forwarded = request.headers.get("x-forwarded-for");
    if (forwarded) {
        // Take the first IP in the chain (original client)
        return forwarded.split(",")[0].trim();
    }

    // Fallback
    return "127.0.0.1";
}
