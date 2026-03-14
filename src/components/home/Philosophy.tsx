"use client";

import { useEffect, useMemo, useRef } from "react";

const PHILOSOPHY_TEXT =
  "We believe architecture is not just structure - it is the art of shaping how people live, feel, and dream. Every space we create is a conversation between light, material, and emotion.";

export default function Philosophy() {
  const sectionRef = useRef<HTMLElement>(null);
  const chars = useMemo(() => PHILOSOPHY_TEXT.split(""), []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          section.classList.add("is-visible");
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "-20% 0px -20% 0px" }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="philosophy-section relative z-[2] flex min-h-[60vh] items-center justify-center px-6 py-24 md:min-h-[70vh]"
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .philosophy-section .phil-char {
          display: inline-block;
          opacity: 0;
          transform: translateY(20px);
          white-space: pre;
        }

        .philosophy-section.is-visible .phil-char {
          animation: philFade 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) both;
        }

        @keyframes philFade {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `,
        }}
      />

      <div className="relative z-10 max-w-4xl text-center">
        <p
          className="text-[clamp(1.25rem,3.5vw,2.5rem)] leading-[1.4] text-[#E3E4E0]/80"
          style={{ fontFamily: "var(--font-cormorant), serif", fontStyle: "italic" }}
        >
          {chars.map((char, index) => (
            <span
              key={`${char}-${index}`}
              className="phil-char"
              style={{ animationDelay: `${index * 0.018}s` }}
            >
              {char}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
