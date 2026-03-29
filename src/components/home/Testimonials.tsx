"use client";

import { useRef, useState } from "react";
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


export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const roleRef = useRef<HTMLParagraphElement>(null);
  const quoteRef = useRef<HTMLParagraphElement>(null);
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

  const t = TESTIMONIALS[current];

  return (
    <section className="relative py-24 md:py-36 px-4" style={{ background: "var(--bg-dark)" }}>
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
      <div className="w-full max-w-4xl mx-auto" style={{ perspective: "1200px" }}>
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

    </section>
  );
}
