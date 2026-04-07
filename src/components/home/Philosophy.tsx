"use client";

import { useEffect, useMemo, useRef } from "react";

const PHILOSOPHY_TEXT =
  "We believe architecture and interiors are not separate disciplines, but a continuous process of shaping vision into form.\nAt Mayaakars, every space begins as an idea — evolving through light, material, and proportion into environments that are both lived and felt.";

export default function Philosophy() {
  const sectionRef = useRef<HTMLElement>(null);
  const tokens = useMemo(() => PHILOSOPHY_TEXT.split(/(\s+)/), []);
  const segments = useMemo(() => {
    return tokens.reduce<{
      charCount: number;
      items: Array<
        | { type: "space"; key: string; value: string }
        | { type: "word"; key: string; letters: Array<{ key: string; value: string; delay: number }> }
      >;
    }>(
      (acc, token, tokenIndex) => {
        if (/^\s+$/.test(token)) {
          acc.items.push({
            type: "space",
            key: `space-${tokenIndex}`,
            value: token,
          });
          return acc;
        }

        const letters = token.split("").map((char, letterIndex) => ({
          key: `${tokenIndex}-${letterIndex}`,
          value: char,
          delay: (acc.charCount + letterIndex) * 0.018,
        }));

        acc.items.push({
          type: "word",
          key: `word-${tokenIndex}`,
          letters,
        });
        acc.charCount += token.length;
        return acc;
      },
      { charCount: 0, items: [] }
    ).items;
  }, [tokens]);

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
      className="philosophy-section relative z-[2] flex min-h-[60vh] items-center justify-center px-6 py-32 md:min-h-[70vh]"
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

        .philosophy-section .phil-word {
          display: inline-block;
          white-space: nowrap;
        }

        .philosophy-section .phil-space {
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
          {segments.map((segment) =>
            segment.type === "space" ? (
              <span key={segment.key} className="phil-space" aria-hidden="true">
                {segment.value}
              </span>
            ) : (
              <span key={segment.key} className="phil-word">
                {segment.letters.map((letter) => (
                  <span
                    key={letter.key}
                    className="phil-char"
                    style={{ animationDelay: `${letter.delay}s` }}
                  >
                    {letter.value}
                  </span>
                ))}
              </span>
            )
          )}
        </p>
      </div>
    </section>
  );
}
