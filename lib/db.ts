import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const DB_PATH =
    process.env.NODE_ENV === "production"
        ? "/app/data/landing.db"
        : path.join(process.cwd(), "data", "landing.db");

// Ensure data directory exists
const dir = path.dirname(DB_PATH);
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}

const db = new Database(DB_PATH);

// Enable WAL mode for better concurrency
db.pragma("journal_mode = WAL");

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS visitors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ip_address TEXT UNIQUE,
    device_type TEXT,
    city TEXT,
    visit_count INTEGER DEFAULT 1,
    first_visited_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_visited_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    phone TEXT,
    message TEXT,
    ip_address TEXT,
    device_type TEXT,
    city TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// --- Visitor helpers ---

export function upsertVisitor(
    ip: string,
    deviceType: string,
    city: string
) {
    const existing = db
        .prepare("SELECT id FROM visitors WHERE ip_address = ?")
        .get(ip) as { id: number } | undefined;

    if (existing) {
        db.prepare(
            `UPDATE visitors
       SET visit_count = visit_count + 1,
           last_visited_at = CURRENT_TIMESTAMP,
           device_type = ?,
           city = ?
       WHERE ip_address = ?`
        ).run(deviceType, city, ip);
    } else {
        db.prepare(
            `INSERT INTO visitors (ip_address, device_type, city)
       VALUES (?, ?, ?)`
        ).run(ip, deviceType, city);
    }
}

export function getVisitors() {
    return db
        .prepare(
            "SELECT * FROM visitors ORDER BY last_visited_at DESC"
        )
        .all();
}

export function getVisitorStats() {
    const totalUnique = db
        .prepare("SELECT COUNT(*) as count FROM visitors")
        .get() as { count: number };

    const totalVisits = db
        .prepare("SELECT COALESCE(SUM(visit_count), 0) as count FROM visitors")
        .get() as { count: number };

    const today = new Date().toISOString().split("T")[0];
    const todayVisitors = db
        .prepare(
            "SELECT COUNT(*) as count FROM visitors WHERE date(last_visited_at) = ?"
        )
        .get(today) as { count: number };

    return {
        totalUnique: totalUnique.count,
        totalVisits: totalVisits.count,
        todayVisitors: todayVisitors.count,
    };
}

// --- Submission helpers ---

export function insertSubmission(
    email: string,
    phone: string | null,
    message: string | null,
    ip: string,
    deviceType: string,
    city: string
) {
    db.prepare(
        `INSERT INTO submissions (email, phone, message, ip_address, device_type, city)
     VALUES (?, ?, ?, ?, ?, ?)`
    ).run(email, phone, message, ip, deviceType, city);
}

export function getSubmissions() {
    return db
        .prepare("SELECT * FROM submissions ORDER BY created_at DESC")
        .all();
}

export function getSubmissionsCSV(): string {
    const rows = db
        .prepare("SELECT * FROM submissions ORDER BY created_at DESC")
        .all() as Record<string, unknown>[];

    if (rows.length === 0) return "No data";

    const headers = Object.keys(rows[0]);
    const csvLines = [
        headers.join(","),
        ...rows.map((row) =>
            headers
                .map((h) => {
                    const val = String(row[h] ?? "");
                    return val.includes(",") ? `"${val}"` : val;
                })
                .join(",")
        ),
    ];
    return csvLines.join("\n");
}

// --- Session helpers ---

const sessions = new Map<string, number>(); // token → expiry timestamp

export function createSession(): string {
    const token = crypto.randomUUID();
    // Session expires in 24 hours
    sessions.set(token, Date.now() + 24 * 60 * 60 * 1000);
    return token;
}

export function validateSession(token: string | undefined): boolean {
    if (!token) return false;
    const expiry = sessions.get(token);
    if (!expiry) return false;
    if (Date.now() > expiry) {
        sessions.delete(token);
        return false;
    }
    return true;
}
