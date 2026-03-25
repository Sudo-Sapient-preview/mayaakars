"use client";

import { Suspense, useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { SERVICES } from "@/lib/services-data";
import Philosophy from "@/components/home/Philosophy";
import HoverRevealCards from "@/components/ui/hover-reveal-cards";
import ServiceDetail from "@/components/services/ServiceDetail";

const CARD_ITEMS = SERVICES.map((service) => ({
    id: service.slug,
    title: service.title,
    subtitle: service.subtitle,
    slug: service.slug,
    description: service.description || `Discover our specialized approach to ${service.title}.`,
    imageUrl:
        service.images[0]?.src ??
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=80",
}));

function ServicesContent() {
  const searchParams = useSearchParams();
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const detailRef = useRef<HTMLDivElement>(null);

  // Auto-open service from query param (e.g. ?service=3d-visualisation)
  useEffect(() => {
    const param = searchParams.get("service");
    if (param && SERVICES.some((s) => s.slug === param)) {
      setActiveSlug(param);
    }
  }, [searchParams]);

  const handleCardClick = (slug: string) => {
    setActiveSlug(slug);
  };

  useEffect(() => {
    if (activeSlug && detailRef.current) {
      setTimeout(() => {
        const y = detailRef.current!.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }, 100);
    }
  }, [activeSlug]);

  const activeService = SERVICES.find((s) => s.slug === activeSlug);

  return (
    <main className="bg-[#050505] text-[#E3E4E0]">
      <section className="border-b border-white/[0.08] px-6 py-24 text-center md:py-28">
        <p
          className="mb-5 text-[0.68rem] uppercase tracking-[0.42em] text-[#C49A3A]"
          style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
        >
          Our Services
        </p>
        <h1
          className="mx-auto mb-6 max-w-5xl text-[clamp(1.8rem,5vw,3.5rem)] uppercase leading-[0.92] text-white"
          style={{ fontFamily: "var(--font-cormorant), serif" }}
        >
          Explore What We Design
        </h1>
        <p className="mx-auto max-w-2xl text-sm leading-relaxed text-white/65 md:text-base">
          Select a service to explore scope, process, and examples.
        </p>
      </section>

      <section className="bg-[#0A0A0A] py-16 px-6 md:px-12 lg:px-16 flex justify-center">
        <HoverRevealCards
          items={CARD_ITEMS}
          className="max-w-[1600px] w-full"
          onCardClick={handleCardClick}
        />
      </section>

      <div ref={detailRef} className="w-full">
        {activeService && <ServiceDetail service={activeService} />}
      </div>

      <Philosophy />
    </main>
  );
}

export default function ServicesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050505]" />}>
      <ServicesContent />
    </Suspense>
  );
}
