"use client";

import { useState, useRef, useEffect } from "react";

export default function ContactForm() {
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState<
        "idle" | "loading" | "success" | "error"
    >("idle");
    const [errorMsg, setErrorMsg] = useState("");
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.2 }
        );

        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");
        setErrorMsg("");

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, phone, message }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Klaida siunčiant žinutę");
            }

            setStatus("success");
            setEmail("");
            setPhone("");
            setMessage("");
        } catch (err) {
            setStatus("error");
            setErrorMsg(
                err instanceof Error ? err.message : "Klaida siunčiant žinutę"
            );
        }
    };

    return (
        <section
            id="contact"
            ref={sectionRef}
            className="relative py-24 px-4"
        >
            {/* Background accent */}
            <div
                className="gradient-blob w-[600px] h-[400px] bg-[var(--color-primary)] top-[10%] left-[-200px] opacity-20"
                style={{ position: "absolute" }}
            />

            <div
                className={`max-w-xl mx-auto transition-all duration-700 ${isVisible
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-8"
                    }`}
            >
                {/* Header */}
                <div className="text-center mb-10">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                        Susidomėjote?{" "}
                        <span className="gradient-text">Susisiekite</span>
                    </h2>
                    <p className="text-[var(--color-muted)] text-lg">
                        Palikite savo kontaktus ir mes su jumis susisieksime
                    </p>
                </div>

                {/* Success state */}
                {status === "success" ? (
                    <div className="glass-card rounded-2xl p-8 text-center pulse-success">
                        <div className="text-5xl mb-4">✅</div>
                        <h3 className="text-xl font-semibold mb-2 text-[var(--color-success)]">
                            Ačiū! Susisieksime su jumis netrukus.
                        </h3>
                        <p className="text-[var(--color-muted)]">
                            Patikrinkite savo el. paštą
                        </p>
                        <button
                            onClick={() => setStatus("idle")}
                            className="mt-6 px-6 py-2 rounded-lg border border-[var(--color-border)] text-sm text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:border-[var(--color-primary)] transition-all"
                        >
                            Siųsti dar vieną žinutę
                        </button>
                    </div>
                ) : (
                    /* Form */
                    <form
                        onSubmit={handleSubmit}
                        className="glass-card rounded-2xl p-8 space-y-5"
                    >
                        {/* Email */}
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium mb-2 text-[var(--color-muted)]"
                            >
                                El. paštas <span className="text-[var(--color-error)]">*</span>
                            </label>
                            <input
                                id="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="jusu@paštas.lt"
                                className="w-full px-4 py-3 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-foreground)] placeholder:text-[var(--color-muted)]/50 focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all"
                            />
                        </div>

                        {/* Phone */}
                        <div>
                            <label
                                htmlFor="phone"
                                className="block text-sm font-medium mb-2 text-[var(--color-muted)]"
                            >
                                Telefono numeris{" "}
                                <span className="text-[var(--color-muted)]/50">(neprivaloma)</span>
                            </label>
                            <input
                                id="phone"
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="+370 6XX XXXXX"
                                className="w-full px-4 py-3 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-foreground)] placeholder:text-[var(--color-muted)]/50 focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all"
                            />
                        </div>

                        {/* Message */}
                        <div>
                            <label
                                htmlFor="message"
                                className="block text-sm font-medium mb-2 text-[var(--color-muted)]"
                            >
                                Žinutė{" "}
                                <span className="text-[var(--color-muted)]/50">(neprivaloma)</span>
                            </label>
                            <textarea
                                id="message"
                                rows={4}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Parašykite mums..."
                                className="w-full px-4 py-3 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-foreground)] placeholder:text-[var(--color-muted)]/50 focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all resize-none"
                            />
                        </div>

                        {/* Error message */}
                        {status === "error" && (
                            <div className="text-[var(--color-error)] text-sm bg-[var(--color-error)]/10 px-4 py-3 rounded-xl">
                                {errorMsg}
                            </div>
                        )}

                        {/* Submit button */}
                        <button
                            type="submit"
                            disabled={status === "loading"}
                            className="w-full py-4 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white font-semibold text-lg hover:opacity-90 transition-all duration-300 hover:shadow-[0_10px_40px_rgba(99,102,241,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {status === "loading" ? (
                                <>
                                    <svg
                                        className="animate-spin w-5 h-5"
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
                                    Siunčiama...
                                </>
                            ) : (
                                "Noriu išbandyti"
                            )}
                        </button>
                    </form>
                )}
            </div>
        </section>
    );
}
