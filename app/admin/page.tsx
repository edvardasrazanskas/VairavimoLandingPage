"use client";

import { useState, useEffect } from "react";

interface Visitor {
    id: number;
    ip_address: string;
    device_type: string;
    city: string;
    visit_count: number;
    first_visited_at: string;
    last_visited_at: string;
}

interface Submission {
    id: number;
    email: string;
    phone: string | null;
    message: string | null;
    device_type: string;
    city: string;
    created_at: string;
}

interface VisitorStats {
    totalUnique: number;
    totalVisits: number;
    todayVisitors: number;
}

export default function AdminPage() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState("");
    const [loginLoading, setLoginLoading] = useState(false);

    const [activeTab, setActiveTab] = useState<"visitors" | "submissions">(
        "visitors"
    );

    const [visitors, setVisitors] = useState<Visitor[]>([]);
    const [stats, setStats] = useState<VisitorStats>({
        totalUnique: 0,
        totalVisits: 0,
        todayVisitors: 0,
    });
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [dataLoading, setDataLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginLoading(true);
        setLoginError("");

        try {
            const res = await fetch("/api/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Prisijungimo klaida");
            }

            setIsLoggedIn(true);
            setPassword("");
        } catch (err) {
            setLoginError(
                err instanceof Error ? err.message : "Prisijungimo klaida"
            );
        } finally {
            setLoginLoading(false);
        }
    };

    const fetchData = async () => {
        setDataLoading(true);
        try {
            if (activeTab === "visitors") {
                const res = await fetch("/api/admin/visitors");
                if (res.status === 401) {
                    setIsLoggedIn(false);
                    return;
                }
                const data = await res.json();
                setVisitors(data.visitors || []);
                setStats(data.stats || { totalUnique: 0, totalVisits: 0, todayVisitors: 0 });
            } else {
                const res = await fetch("/api/admin/submissions");
                if (res.status === 401) {
                    setIsLoggedIn(false);
                    return;
                }
                const data = await res.json();
                setSubmissions(data.submissions || []);
            }
        } catch {
            console.error("Failed to fetch data");
        } finally {
            setDataLoading(false);
        }
    };

    useEffect(() => {
        if (isLoggedIn) {
            fetchData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoggedIn, activeTab]);

    const handleExport = async () => {
        try {
            const res = await fetch("/api/admin/export");
            if (res.status === 401) {
                setIsLoggedIn(false);
                return;
            }
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "submissions.csv";
            a.click();
            URL.revokeObjectURL(url);
        } catch {
            console.error("Failed to export");
        }
    };

    const formatDate = (dateStr: string) => {
        try {
            return new Date(dateStr + "Z").toLocaleString("lt-LT");
        } catch {
            return dateStr;
        }
    };

    // --- Login Screen ---
    if (!isLoggedIn) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="glass-card rounded-2xl p-8 w-full max-w-md">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold gradient-text mb-2">
                            Administravimas
                        </h1>
                        <p className="text-[var(--color-muted)] text-sm">
                            Prisijunkite prie administratoriaus skydelio
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label
                                htmlFor="admin-password"
                                className="block text-sm font-medium mb-2 text-[var(--color-muted)]"
                            >
                                Slaptažodis
                            </label>
                            <input
                                id="admin-password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Įveskite slaptažodį"
                                className="w-full px-4 py-3 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-foreground)] placeholder:text-[var(--color-muted)]/50 focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all"
                            />
                        </div>

                        {loginError && (
                            <div className="text-[var(--color-error)] text-sm bg-[var(--color-error)]/10 px-4 py-3 rounded-xl">
                                {loginError}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loginLoading}
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white font-semibold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loginLoading ? "Jungiamasi..." : "Prisijungti"}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // --- Dashboard ---
    return (
        <div className="min-h-screen p-4 sm:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold gradient-text">
                            Administratoriaus skydelis 0.2
                        </h1>
                        <p className="text-[var(--color-muted)] text-sm mt-1">
                            Vairavimas Landing Page statistika
                        </p>
                    </div>
                    <button
                        onClick={() => {
                            setIsLoggedIn(false);
                            document.cookie =
                                "admin_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                        }}
                        className="px-4 py-2 rounded-lg border border-[var(--color-border)] text-sm text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:border-[var(--color-error)] transition-all"
                    >
                        Atsijungti
                    </button>
                </div>

                {/* Stats cards (show always) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <div className="glass-card rounded-xl p-5">
                        <div className="text-sm text-[var(--color-muted)] mb-1">
                            Unikalūs lankytojai
                        </div>
                        <div className="text-3xl font-bold">{stats.totalUnique}</div>
                    </div>
                    <div className="glass-card rounded-xl p-5">
                        <div className="text-sm text-[var(--color-muted)] mb-1">
                            Viso apsilankymų
                        </div>
                        <div className="text-3xl font-bold">{stats.totalVisits}</div>
                    </div>
                    <div className="glass-card rounded-xl p-5">
                        <div className="text-sm text-[var(--color-muted)] mb-1">
                            Šiandienos lankytojai
                        </div>
                        <div className="text-3xl font-bold">{stats.todayVisitors}</div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 mb-6 bg-[var(--color-card)] rounded-xl p-1 w-fit">
                    <button
                        onClick={() => setActiveTab("visitors")}
                        className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === "visitors"
                            ? "bg-[var(--color-primary)] text-white"
                            : "text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
                            }`}
                    >
                        Lankytojai
                    </button>
                    <button
                        onClick={() => setActiveTab("submissions")}
                        className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === "submissions"
                            ? "bg-[var(--color-primary)] text-white"
                            : "text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
                            }`}
                    >
                        Žinutės
                    </button>
                </div>

                {/* Data loading */}
                {dataLoading ? (
                    <div className="text-center py-12 text-[var(--color-muted)]">
                        <svg
                            className="animate-spin w-8 h-8 mx-auto mb-4"
                            viewBox="0 0 24 24"
                            fill="none"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                            />
                        </svg>
                        Kraunama...
                    </div>
                ) : activeTab === "visitors" ? (
                    /* Visitors Tab */
                    <div className="glass-card rounded-xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-[var(--color-border)]">
                                        <th className="text-left px-4 py-3 text-[var(--color-muted)] font-medium">
                                            IP adresas
                                        </th>
                                        <th className="text-left px-4 py-3 text-[var(--color-muted)] font-medium">
                                            Įrenginys
                                        </th>
                                        <th className="text-left px-4 py-3 text-[var(--color-muted)] font-medium">
                                            Miestas
                                        </th>
                                        <th className="text-left px-4 py-3 text-[var(--color-muted)] font-medium">
                                            Apsilankymai
                                        </th>
                                        <th className="text-left px-4 py-3 text-[var(--color-muted)] font-medium">
                                            Pirmas vizitas
                                        </th>
                                        <th className="text-left px-4 py-3 text-[var(--color-muted)] font-medium">
                                            Paskutinis vizitas
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {visitors.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={6}
                                                className="px-4 py-8 text-center text-[var(--color-muted)]"
                                            >
                                                Dar nėra lankytojų
                                            </td>
                                        </tr>
                                    ) : (
                                        visitors.map((v) => (
                                            <tr
                                                key={v.id}
                                                className="border-b border-[var(--color-border)]/50 hover:bg-[var(--color-card-hover)] transition-colors"
                                            >
                                                <td className="px-4 py-3 font-mono text-xs">
                                                    {v.ip_address}
                                                </td>
                                                <td className="px-4 py-3">{v.device_type}</td>
                                                <td className="px-4 py-3">{v.city}</td>
                                                <td className="px-4 py-3">
                                                    <span className="px-2 py-0.5 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs font-medium">
                                                        {v.visit_count}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-[var(--color-muted)]">
                                                    {formatDate(v.first_visited_at)}
                                                </td>
                                                <td className="px-4 py-3 text-[var(--color-muted)]">
                                                    {formatDate(v.last_visited_at)}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    /* Submissions Tab */
                    <div>
                        <div className="flex justify-end mb-4">
                            <button
                                onClick={handleExport}
                                className="px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white text-sm font-medium hover:bg-[var(--color-primary-hover)] transition-all flex items-center gap-2"
                            >
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    />
                                </svg>
                                Eksportuoti CSV
                            </button>
                        </div>
                        <div className="glass-card rounded-xl overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-[var(--color-border)]">
                                            <th className="text-left px-4 py-3 text-[var(--color-muted)] font-medium">
                                                El. paštas
                                            </th>
                                            <th className="text-left px-4 py-3 text-[var(--color-muted)] font-medium">
                                                Telefonas
                                            </th>
                                            <th className="text-left px-4 py-3 text-[var(--color-muted)] font-medium">
                                                Žinutė
                                            </th>
                                            <th className="text-left px-4 py-3 text-[var(--color-muted)] font-medium">
                                                Įrenginys
                                            </th>
                                            <th className="text-left px-4 py-3 text-[var(--color-muted)] font-medium">
                                                Miestas
                                            </th>
                                            <th className="text-left px-4 py-3 text-[var(--color-muted)] font-medium">
                                                Data
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {submissions.length === 0 ? (
                                            <tr>
                                                <td
                                                    colSpan={6}
                                                    className="px-4 py-8 text-center text-[var(--color-muted)]"
                                                >
                                                    Dar nėra žinučių
                                                </td>
                                            </tr>
                                        ) : (
                                            submissions.map((s) => (
                                                <tr
                                                    key={s.id}
                                                    className="border-b border-[var(--color-border)]/50 hover:bg-[var(--color-card-hover)] transition-colors"
                                                >
                                                    <td className="px-4 py-3 font-medium">
                                                        {s.email}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        {s.phone || "—"}
                                                    </td>
                                                    <td className="px-4 py-3 max-w-xs truncate">
                                                        {s.message || "—"}
                                                    </td>
                                                    <td className="px-4 py-3">{s.device_type}</td>
                                                    <td className="px-4 py-3">{s.city}</td>
                                                    <td className="px-4 py-3 text-[var(--color-muted)]">
                                                        {formatDate(s.created_at)}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
