"use client";

import { useEffect } from "react";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";

export default function Home() {
  useEffect(() => {
    // Track visitor on page load
    fetch("/api/track", { method: "POST" }).catch(() => {
      // Silently fail — tracking is non-critical
    });
  }, []);

  return (
    <main className="min-h-screen">
      <Hero />
      <Features />
      <ContactForm />
      <Footer />
    </main>
  );
}
