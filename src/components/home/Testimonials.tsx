"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";

const TESTIMONIALS = [
  {
    name: "Rohan Mehta",
    role: "Homeowner – Bengaluru",
    initials: "RM",
    quote:
      "We had a rough idea of what we wanted for our home, but the Mayaakars team really helped shape that into something much better than we had imagined. They paid attention to the small details and were always open to discussing ideas. The whole process felt collaborative, and the final space feels very much like \u201cour home.\u201d",
  },
  {
    name: "Sneha Kapoor",
    role: "Apartment Interior Project",
    initials: "SK",
    quote:
      "We were looking for a design that felt modern but still comfortable to live in, and Mayaakars delivered exactly that. The lighting, materials, and layout were all thoughtfully planned. It\u2019s a space we genuinely enjoy spending time in every day.",
  },
  {
    name: "Meera Krishnan",
    role: "Residential Interior",
    initials: "MK",
    quote:
      "Mayaakars has a very refined design sensibility. They helped us create interiors that feel elegant but still comfortable for daily life. Every room feels connected, and the overall design has a calm and cohesive feel to it.",
  },
];

const BRANDS = [
  { name: "Marriott", file: "marriott.webp" },
  { name: "Hyatt Centric", file: "Hyatt Centric.webp" },
  { name: "Lamp Craft", file: "lamp craft.webp" },
  { name: "Reliance", file: "Reliance.webp" },
  { name: "Address Makers", file: "Address_Makers.webp" },
  { name: "Bosch", file: "Bosch Logo.webp" },
  { name: "Hettich", file: "Hettich Logo.webp" },
  { name: "Kohler", file: "Kohler.webp" },
  { name: "Phillips Lighting", file: "Phillips Lighing Logo.webp" },
  { name: "Royal Touche", file: "Royal Touche Logo.webp" },
  { name: "Saint Gobain", file: "Saint Gobain.webp" },
];

const CLIENTS = [
  { name: "Living Walls", file: "Living Walls Logo.webp" },
  { name: "Waverly", file: "Waverly Logo.webp" },
  { name: "Automac", file: "AutoMac Logo .webp" },
  { name: "Agrocorp", file: "agrocorp logo .webp" },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const roleRef = useRef<HTMLParagraphElement>(null);
  const quoteRef = useRef<HTMLParagraphElement>(null);
  const brandsRef = useRef<HTMLDivElement>(null);
  const animatingRef = useRef(false);

  const handleNext = () => {
    if (animatingRef.current) return;
    animatingRef.current = true;

    const card = cardRef.current;
    if (!card) return;

    gsap.to(card, {
      rotationY: "+=360",
      duration: 1.4,
      ease: "expo.inOut",
      onStart: () => {
        gsap.to([nameRef.current, roleRef.current, quoteRef.current], {
          opacity: 0,
          duration: 0.35,
          delay: 0.15,
        });
      },
      onComplete: () => {
        setCurrent((prev) => (prev + 1) % TESTIMONIALS.length);
        gsap.to([nameRef.current, roleRef.current, quoteRef.current], {
          opacity: 1,
          duration: 0.6,
          onComplete: () => {
            animatingRef.current = false;
          },
        });
      },
    });
  };

  useEffect(() => {
    const brands = brandsRef.current;
    if (!brands) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const items = brands.querySelectorAll<HTMLElement>(".brand-item");
          gsap.fromTo(
            items,
            { y: 18, opacity: 0 },
            { y: 0, opacity: 1, stagger: 0.07, duration: 0.9, ease: "power2.out" }
          );
          observer.disconnect();
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(brands);
    return () => observer.disconnect();
  }, []);

  const t = TESTIMONIALS[current];

  return (
    <section className="relative py-16 md:py-28 px-4" style={{ background: "var(--bg-dark)" }}>
      {/* Section header */}
      <div className="text-center mb-12 md:mb-16">
        <p
          className="uppercase mb-3"
          style={{
            letterSpacing: "0.5em",
            fontSize: "9px",
            color: "#C49A3A",
            fontWeight: 600,
          }}
        >
          Testimonials
        </p>
        <h2
          className="font-light italic"
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontSize: "clamp(2.2rem, 5vw, 3.6rem)",
            color: "#E3E4E0",
            letterSpacing: "0.02em",
          }}
        >
          Refined Collaborations
        </h2>
      </div>

      {/* Testimonial card */}
      <div className="w-full max-w-4xl mx-auto mb-24" style={{ perspective: "1200px" }}>
        <div
          ref={cardRef}
          className="relative mx-auto max-w-2xl rounded-[2rem] p-10 md:p-14"
          style={{
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.14)",
          }}
        >
          {/* Decorative quote mark */}
          <span
            aria-hidden
            style={{
              position: "absolute",
              top: "1.5rem",
              left: "2.5rem",
              fontFamily: "var(--font-cormorant), serif",
              fontSize: "7rem",
              lineHeight: 1,
              color: "rgba(255,255,255,0.04)",
              userSelect: "none",
              pointerEvents: "none",
            }}
          >
            &ldquo;
          </span>

          {/* Avatar + name */}
          <div className="flex items-center mb-8">
            <div
              className="flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center text-xs font-semibold mr-4"
              style={{
                background: "rgba(255,255,255,0.12)",
                color: "#E3E4E0",
                letterSpacing: "0.05em",
              }}
            >
              {t.initials}
            </div>
            <div>
              <h4
                ref={nameRef}
                style={{
                  color: "#E3E4E0",
                  fontSize: "0.85rem",
                  fontWeight: 500,
                  letterSpacing: "0.06em",
                }}
              >
                {t.name}
              </h4>
              <p
                ref={roleRef}
                style={{
                  fontSize: "0.68rem",
                  color: "rgba(255,255,255,0.35)",
                  fontStyle: "italic",
                  marginTop: "0.2rem",
                }}
              >
                {t.role}
              </p>
            </div>
          </div>

          {/* Quote */}
          <p
            ref={quoteRef}
            style={{
              fontFamily: "var(--font-cormorant), serif",
              fontSize: "clamp(1.05rem, 1.9vw, 1.25rem)",
              lineHeight: 1.85,
              color: "rgba(255,255,255,0.65)",
              fontStyle: "italic",
            }}
          >
            &ldquo;{t.quote}&rdquo;
          </p>
        </div>

        {/* Next button */}
        <div className="flex justify-center mt-10">
          <button
            onClick={handleNext}
            className="group relative overflow-hidden rounded-full px-10 py-3 text-[10px] uppercase font-medium transition-colors duration-500"
            style={{
              border: "1px solid rgba(255,255,255,0.18)",
              color: "rgba(255,255,255,0.55)",
              letterSpacing: "0.28em",
              background: "transparent",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget;
              el.style.background = "rgba(255,255,255,0.9)";
              el.style.color = "#0A0A0A";
              el.style.borderColor = "rgba(255,255,255,0.9)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget;
              el.style.background = "transparent";
              el.style.color = "rgba(255,255,255,0.55)";
              el.style.borderColor = "rgba(255,255,255,0.18)";
            }}
          >
            Next Story
          </button>
        </div>
      </div>

      {/* Brand partners + Clients wrapper */}
      <div ref={brandsRef}>

      {/* Brand partners */}
      <div
        className="max-w-6xl mx-auto pt-20"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="text-center mb-14">
          <p
            className="uppercase mb-3"
            style={{
              letterSpacing: "0.42em",
              fontSize: "8px",
              color: "rgba(255,255,255,0.25)",
              fontWeight: 600,
            }}
          >
            Our Esteemed Network
          </p>
          <h4
            className="font-light italic"
            style={{
              fontFamily: "var(--font-cormorant), serif",
              fontSize: "1.35rem",
              color: "rgba(227,228,224,0.5)",
              letterSpacing: "0.02em",
            }}
          >
            Partners in Design Excellence
          </h4>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 items-center px-4">
          {[...BRANDS, ...CLIENTS].map((item) => (
            <div
              key={item.name}
              className="brand-item flex flex-col items-center gap-3"
              style={{ opacity: 0 }}
            >
              <div
                className="relative w-full h-16"
                style={{ transition: "opacity 0.3s ease, filter 0.3s ease", opacity: 0.45, filter: "grayscale(100%) brightness(0) invert(1)" }}
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
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, (max-width: 1440px) 20vw, 16vw"
                  className="object-contain"
                />
              </div>
              <span
                style={{
                  fontSize: "11px",
                  textTransform: "uppercase",
                  letterSpacing: "0.14em",
                  color: "rgba(255,255,255,0.45)",
                }}
              >
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      </div>{/* end brandsRef wrapper */}
    </section>
  );
}
