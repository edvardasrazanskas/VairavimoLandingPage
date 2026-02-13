"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

function useIntersection(ref: React.RefObject<HTMLDivElement | null>) {
    const [isVisible, setIsVisible] = useState(false);
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setIsVisible(true);
            },
            { threshold: 0.2 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [ref]);
    return isVisible;
}

interface ShowcaseSectionProps {
    title: string;
    description: string;
    badge: string;
    badgeColor: string;
    imageSrc: string;
    imageAlt: string;
    imagePosition: "left" | "right";
    isMobile?: boolean;
    features?: string[];
}

function ShowcaseSection({
    title,
    description,
    badge,
    badgeColor,
    imageSrc,
    imageAlt,
    imagePosition,
    isMobile,
    features
}: ShowcaseSectionProps) {
    const ref = useRef<HTMLDivElement>(null);
    const isVisible = useIntersection(ref);

    const imageContent = isMobile ? (
        <div className="relative w-64 md:w-72 rounded-[2.5rem] border-[8px] border-gray-900 overflow-hidden shadow-2xl bg-gray-900 mx-auto">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-xl z-20"></div>
            <Image
                src={imageSrc}
                alt={imageAlt}
                width={400}
                height={850}
                className="w-full h-auto"
            />
        </div>
    ) : (
        <div className="rounded-xl overflow-hidden shadow-2xl border border-[var(--color-border)] bg-gray-900">
            {/* Browser Bar */}
            <div className="h-8 bg-gray-800 flex items-center px-4 gap-2 border-b border-gray-700">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <Image
                src={imageSrc}
                alt={imageAlt}
                width={1200}
                height={800}
                className="w-full h-auto"
            />
        </div>
    );

    // Dynamic color classes map
    const colorClasses: Record<string, string> = {
        indigo: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
        purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
        pink: "bg-pink-500/10 text-pink-400 border-pink-500/20",
        blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    };

    const badgeClass = `inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-4 border ${colorClasses[badgeColor] || colorClasses.indigo}`;

    return (
        <section ref={ref} className={`max-w-7xl mx-auto flex flex-col ${imagePosition === "left" ? "md:flex-row-reverse" : "md:flex-row"} items-center gap-12 md:gap-16`}>
            {/* Text Content */}
            <div className={`md:w-1/2 transition-all duration-1000 transform ${isVisible ? "opacity-100 translate-x-0" : `opacity-0 ${imagePosition === "left" ? "translate-x-20" : "-translate-x-20"}`}`}>
                <div className={badgeClass}>
                    {badge}
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                    {title}
                </h2>
                <p className="text-lg text-[var(--color-muted)] mb-8 leading-relaxed">
                    {description}
                </p>
                {features && (
                    <ul className="space-y-3 text-[var(--color-muted)]">
                        {features.map((feature, i) => (
                            <li key={i} className="flex items-center gap-3">
                                <span className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 text-sm">✓</span>
                                {feature}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Image Content */}
            <div className={`md:w-1/2 transition-all duration-1000 delay-200 transform ${isVisible ? "opacity-100 translate-x-0" : `opacity-0 ${imagePosition === "left" ? "-translate-x-20" : "translate-x-20"}`}`}>
                {imageContent}
            </div>
        </section>
    );
}

export default function Showcase() {
    return (
        <div className="py-24 space-y-32 overflow-hidden px-4 md:px-8">
            <ShowcaseSection
                title="Viskas vienoje vietoje"
                description="Stebėkite visus svarbiausius duomenis viename ekrane. Pamokų grafikai, registracijos ir finansų apžvalga – pasiekiama akimirksniu."
                badge="Valdymo skydelis"
                badgeColor="indigo"
                imageSrc="/imgs/img_pc.jpeg"
                imageAlt="Pagrindinis skydelis"
                imagePosition="right"
                features={["Intuityvus dizainas", "Greita duomenų analizė"]}
            />

            <ShowcaseSection
                title="Planuokite pamokas telefone"
                description="Instruktoriai gali matyti ir redaguoti savo tvarkaraštį tiesiogiai iš telefono. Jokių popierinių grafikų – viskas sinchronizuota realiu laiku."
                badge="Mobilus valdymas"
                badgeColor="purple"
                imageSrc="/imgs/img_phone.png"
                imageAlt="Mobilus tvarkaraštis"
                imagePosition="left"
                isMobile={true}
            />

            <ShowcaseSection
                title="Visa informacija apie mokinius"
                description="Kontaktiniai duomenys, vairavimo istorija ir apmokėjimai. Raskite tai, ko reikia, vos keliais paspaudimais."
                badge="Jūsų mokiniai"
                badgeColor="pink"
                imageSrc="/imgs/img_phone2.png"
                imageAlt="Mokinių sąrašas"
                imagePosition="right"
                isMobile={true}
            />

            <ShowcaseSection
                title="Verslo statistika"
                description="Stebėkite pajamas, išlaidas ir instruktorių užimtumą. Priimkite duomenimis paremtus sprendimus."
                badge="Išsamios ataskaitos"
                badgeColor="blue"
                imageSrc="/imgs/img_pc.png"
                imageAlt="Detali statistika"
                imagePosition="left"
                isMobile={false}
            />
        </div>
    );
}
