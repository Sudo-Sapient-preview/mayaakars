"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";

const CLIENTS = [
  { name: "Marriott", file: "marriott.webp" },
  { name: "Hyatt Centric", file: "Hyatt Centric.webp" },
  { name: "Lamp Craft", file: "lamp craft.webp" },
  { name: "Reliance", file: "Reliance.webp" },
  { name: "Address Makers", file: "Address_Makers.webp" },
  { name: "Living Walls", file: "Living Walls Logo.webp" },
  { name: "Waverly", file: "Waverly Logo.webp" },
  { name: "Automac", file: "AutoMac Logo .webp" },
  { name: "Agrocorp", file: "agrocorp logo .webp" },
];

function LogoItem({ item }: { item: { name: string; file: string } }) {
  return (
    <div className="client-item flex flex-col items-center gap-3" style={{ opacity: 0 }}>
      <div
        style={{
          position: "relative",
          width: "clamp(80px, 12vw, 140px)",
          height: "52px",
          transition: "opacity 0.3s ease, filter 0.3s ease",
          opacity: 0.45,
          filter: "grayscale(100%) brightness(0) invert(1)",
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.opacity = "1";
          el.style.filter = "brightness(0) invert(1) brightness(4)";
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.opacity = "0.45";
          el.style.filter = "grayscale(100%) brightness(0) invert(1)";
        }}
      >
        <Image
          src={`/brands/${encodeURIComponent(item.file)}`}
          alt={item.name}
          fill
          sizes="(max-width: 640px) 40vw, (max-width: 1024px) 20vw, 140px"
          className="object-contain"
        />
      </div>
      <span style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(255,255,255,0.45)", textAlign: "center", lineHeight: 1.3 }}>
        {item.name}
      </span>
    </div>
  );
}

export default function OurClients() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const items = section.querySelectorAll<HTMLElement>(".client-item");
          gsap.fromTo(
            items,
            { y: 18, opacity: 0 },
            { y: 0, opacity: 1, stagger: 0.04, duration: 0.8, ease: "power2.out" }
          );
          observer.disconnect();
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative py-24 md:py-32 px-4" style={{ background: "var(--bg-dark)" }}>
      <div ref={sectionRef} className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p
            className="uppercase mb-3"
            style={{ letterSpacing: "0.42em", fontSize: "8px", color: "rgba(255,255,255,0.25)", fontWeight: 600 }}
          >
            Our Clients
          </p>
          <h4
            className="font-light italic"
            style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "1.35rem", color: "rgba(227,228,224,0.5)", letterSpacing: "0.02em" }}
          >
            Trusted by Leading Names
          </h4>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 items-center px-4">
          {CLIENTS.map((item) => (
            <LogoItem key={item.name} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
