"use client";

import { Suspense } from "react";
import { SERVICES } from "@/lib/services-data";
import Philosophy from "@/components/home/Philosophy";
import HoverRevealCards from "@/components/ui/hover-reveal-cards";
import { useRouteTransition } from "@/components/navigation/RouteTransitionProvider";

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
  const { navigate } = useRouteTransition();

  const handleCardClick = (slug: string) => {
    navigate(`/services/${slug}`);
  };

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

      <section className="py-16 px-6 md:px-12 lg:px-16 flex justify-center">
        <HoverRevealCards
          items={CARD_ITEMS}
          className="max-w-[1600px] w-full"
          onCardClick={handleCardClick}
        />
      </section>

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
