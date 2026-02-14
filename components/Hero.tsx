"use client";

import { useEffect, useRef, useState } from "react";

export default function Hero() {
    const heroRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <section
            ref={heroRef}
            className="relative min-h-screen flex items-center justify-center overflow-hidden px-4"
        >
            {/* Background gradient blobs */}
            <div
                className="gradient-blob w-[500px] h-[500px] bg-[var(--color-primary)] top-[-100px] left-[-100px]"
                style={{ position: "absolute" }}
            />
            <div
                className="gradient-blob w-[400px] h-[400px] bg-[var(--color-accent)] bottom-[-50px] right-[-50px]"
                style={{ position: "absolute" }}
            />
            <div
                className="gradient-blob w-[300px] h-[300px] bg-[var(--color-primary-dark)] top-[40%] right-[20%]"
                style={{ position: "absolute" }}
            />

            {/* Grid pattern overlay */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                    backgroundSize: "60px 60px",
                }}
            />

            <div
                className={`relative z-10 text-center max-w-4xl mx-auto transition-all duration-1000 ${isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                    }`}
            >
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--color-border)] bg-[var(--color-card)] text-sm text-[var(--color-muted)] mb-8">
                    <span className="w-2 h-2 rounded-full bg-[var(--color-success)] animate-pulse" />
                    Nauja platforma vairavimo mokykloms
                </div>

                {/* Headline */}
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
                    Vairavimo mokyklos valdymas{" "}
                    <span className="gradient-text">
                        — paprastai ir patogiai
                    </span>
                </h1>

                {/* Description */}
                <p className="text-lg sm:text-xl text-[var(--color-muted)] max-w-2xl mx-auto mb-10 leading-relaxed">
                    Valdykite pamokas, instruktorius, mokėjimus ir ataskaitas vienoje
                    modernioje platformoje. Sutaupykite laiką ir susikoncentruokite į
                    tai, kas svarbiausia.
                </p>

                {/* CTA Button */}
                <a
                    href="#contact"
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white font-semibold text-lg hover:opacity-90 transition-all duration-300 hover:scale-105 hover:shadow-[0_10px_40px_rgba(99,102,241,0.4)]"
                >
                    Būkite pirmieji
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                    </svg>
                </a>

                {/* Stats row */}
                <div className="flex items-center justify-center gap-8 sm:gap-12 mt-16 text-sm text-[var(--color-muted)]">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-[var(--color-foreground)]">
                            24/7
                        </div>
                        <div>Prieinama</div>
                    </div>
                    <div className="w-px h-10 bg-[var(--color-border)]" />
                    <div className="text-center">
                        <div className="text-2xl font-bold text-[var(--color-foreground)]">
                            &lt;1 min
                        </div>
                        <div>Registracija</div>
                    </div>
                </div>
            </div>

            {/* Bottom gradient fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--color-background)] to-transparent" />
        </section>
    );
}
