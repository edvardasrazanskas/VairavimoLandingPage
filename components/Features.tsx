"use client";

import { useEffect, useRef, useState } from "react";

const features = [
    {
        icon: "📅",
        title: "Pamokų planavimas",
        description:
            "Lengvai kurkite ir valdykite vairavimo pamokų tvarkaraštį. Automatinis laikų suderinamumas ir priminimų sistema.",
    },
    {
        icon: "👨‍🏫",
        title: "Instruktorių valdymas",
        description:
            "Tvarkykite instruktorių darbo grafikus, priskirkite mokinius ir sekite jų darbo rezultatus.",
    },
    {
        icon: "💳",
        title: "Mokėjimų sekimas",
        description:
            "Aiški mokėjimų apskaita kiekvienam mokiniui. Automatiniai priminimai apie laukiančius mokėjimus.",
    },
    {
        icon: "📊",
        title: "Ataskaitos",
        description:
            "Išsamios ataskaitos apie mokyklos veiklą — pajamos, pamokų statistika ir mokyklos augimas.",
    },
];

export default function Features() {
    const [visibleCards, setVisibleCards] = useState<boolean[]>(
        new Array(features.length).fill(false)
    );
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const index = Number(entry.target.getAttribute("data-index"));
                        setVisibleCards((prev) => {
                            const next = [...prev];
                            next[index] = true;
                            return next;
                        });
                    }
                });
            },
            { threshold: 0.2 }
        );

        cardsRef.current.forEach((card) => {
            if (card) observer.observe(card);
        });

        return () => observer.disconnect();
    }, []);

    return (
        <section className="relative py-24 px-4">
            {/* Section header */}
            <div className="text-center mb-16 max-w-2xl mx-auto">
                <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                    Viskas, ko reikia{" "}
                    <span className="gradient-text">vairavimo mokyklai</span>
                </h2>
                <p className="text-[var(--color-muted)] text-lg">
                    Platforma sukurta supaprastinti kasdienę mokyklos veiklą
                </p>
            </div>

            {/* Cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                {features.map((feature, index) => (
                    <div
                        key={feature.title}
                        ref={(el) => { cardsRef.current[index] = el; }}
                        data-index={index}
                        className={`glass-card rounded-2xl p-6 transition-all duration-700 ${visibleCards[index]
                                ? "opacity-100 translate-y-0"
                                : "opacity-0 translate-y-8"
                            }`}
                        style={{ transitionDelay: `${index * 100}ms` }}
                    >
                        <div className="text-4xl mb-4">{feature.icon}</div>
                        <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                        <p className="text-[var(--color-muted)] leading-relaxed text-sm">
                            {feature.description}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}
