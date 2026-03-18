"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

const CONTACT_PHONE = "+91 97318 47847";
const CONTACT_EMAIL = "mail@ordientgroup.com";

const IMAGES = {
  hero:        "/Mayaakars/interior-residencial/panorama-house/living-room-.webp",
  philosophy:  "/Mayaakars/architect-residence/panorama-house/title-photo.webp",
  integrated:  "/Mayaakars/architect-residence/panorama-house/22.webp",
  journey:     "/Mayaakars/interior-residencial/kumar-residence/living-area.webp",
  approach:    "/Mayaakars/interior-residencial/panorama-house/drawing-room-.webp",
  cta:         "/Mayaakars/interior-residencial/house-of-13-arches/living-area.webp",
};

const STATS = [
  { value: "7+", label: "Years of Practice" },
  { value: "80+", label: "Projects Delivered" },
  { value: "2",   label: "Design Disciplines" },
  { value: "1",   label: "Integrated Studio" },
];

const DEFINES = [
  "A holistic approach to architecture and interior design",
  "Design solutions rooted in context and functionality",
  "Strong emphasis on materiality, light, and detail",
  "Clear communication and transparent processes",
  "Commitment to delivering spaces that age gracefully",
];

function useReveal(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("ab-visible"); observer.disconnect(); } },
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);
}

function RevealSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("ab-visible"); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className={`ab-reveal ${className}`}>{children}</div>;
}

export default function AboutPage() {
  const heroRef = useRef<HTMLElement>(null);
  const textureCanvasRef = useRef<HTMLCanvasElement>(null);
  const ctaSectionRef = useRef<HTMLElement>(null);
  useReveal(heroRef);

  // Animated dot texture
  useEffect(() => {
    const canvas = textureCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let rafId = 0;
    let time = 0;
    const spacing = 45;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);
    const draw = () => {
      ctx.fillStyle = "#050505";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const cols = Math.ceil(canvas.width / spacing) + 2;
      const rows = Math.ceil(canvas.height / spacing) + 2;
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * spacing + Math.sin(time * 0.9 + i * 0.5 + j * 0.5) * 12;
          const y = j * spacing + Math.cos(time * 0.9 + i * 0.5 + j * 0.5) * 12;
          const alpha = 0.1 + ((Math.sin(time * 0.5 + (i + j) * 0.3) + 1) / 2) * 0.3;
          ctx.beginPath();
          ctx.arc(x, y, 0.7, 0, Math.PI * 2);
          ctx.fillStyle = (i + j) % 7 === 0 ? `rgba(212,175,55,${alpha + 0.2})` : `rgba(255,255,255,${alpha})`;
          ctx.fill();
        }
      }
      time += 0.005;
      rafId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(rafId); window.removeEventListener("resize", resize); };
  }, []);

  // White scroll-blend CTA (mirrors homepage)
  useEffect(() => {
    const section = ctaSectionRef.current;
    if (!section) return;
    const body = document.body;
    const hexToRgb = (hex: string) => { const n = parseInt(hex.replace("#",""), 16); return { r: (n>>16)&255, g: (n>>8)&255, b: n&255 }; };
    const mix = (from: string, to: string, t: number) => {
      const a = hexToRgb(from), b = hexToRgb(to);
      const l = (s: number, e: number) => Math.round(s + (e - s) * t);
      return `rgb(${l(a.r,b.r)},${l(a.g,b.g)},${l(a.b,b.b)})`;
    };
    const smooth = (t: number) => t*t*t*(t*(t*6-15)+10);
    const clamp = (v: number) => Math.max(0, Math.min(1, v));
    const faucet = (t: number) => 1 - Math.pow(1 - clamp(t), 4);
    const map = (v: number, s: number, e: number) => faucet(clamp((v - s) / (e - s)));
    const thresholds = Array.from({ length: 21 }, (_, i) => i / 20);
    const prevBg = body.style.getPropertyValue("--bg-color");
    const prevText = body.style.getPropertyValue("--text-color");
    const prevVariant = body.getAttribute("data-navbar-variant");
    const observer = new IntersectionObserver(([entry]) => {
      const ratio = Math.max(0, Math.min(1, entry?.intersectionRatio ?? 0));
      const eased = smooth(ratio);
      const blend = map(eased, 0.3, 1);
      const title = map(eased, 0.3, 0.9);
      const copy = map(eased, 0.4, 0.94);
      const actions = map(eased, 0.5, 1);
      section.style.setProperty("--cta-title-progress", `${title}`);
      section.style.setProperty("--cta-copy-progress", `${copy}`);
      section.style.setProperty("--cta-actions-progress", `${actions}`);
      section.classList.toggle("is-visible", ratio > 0.03);
      body.style.setProperty("--bg-color", mix("#050505", "#e3e4e0", blend));
      body.style.setProperty("--text-color", mix("#f2f2f2", "#0a0a0a", blend));
      if (blend > 0.62) body.setAttribute("data-navbar-variant", "light");
      else if (prevVariant === null) body.removeAttribute("data-navbar-variant");
      else body.setAttribute("data-navbar-variant", prevVariant);
    }, { threshold: thresholds, rootMargin: "0px 0px -2% 0px" });
    observer.observe(section);
    return () => {
      observer.disconnect();
      section.style.removeProperty("--cta-title-progress");
      section.style.removeProperty("--cta-copy-progress");
      section.style.removeProperty("--cta-actions-progress");
      section.classList.remove("is-visible");
      if (prevBg) body.style.setProperty("--bg-color", prevBg); else body.style.removeProperty("--bg-color");
      if (prevText) body.style.setProperty("--text-color", prevText); else body.style.removeProperty("--text-color");
      if (prevVariant === null) body.removeAttribute("data-navbar-variant"); else body.setAttribute("data-navbar-variant", prevVariant);
    };
  }, []);

  return (
    <>
      <style>{`
        .ab-reveal { opacity: 0; transform: translateY(28px); transition: opacity 0.9s cubic-bezier(0.22,1,0.36,1), transform 0.9s cubic-bezier(0.22,1,0.36,1); }
        .ab-reveal.ab-visible { opacity: 1; transform: translateY(0); }
        .ab-reveal-delay-1 { transition-delay: 0.1s; }
        .ab-reveal-delay-2 { transition-delay: 0.22s; }
        .ab-reveal-delay-3 { transition-delay: 0.34s; }

        .ab-img-wrap {
          overflow: hidden;
          border-radius: 2px;
          clip-path: inset(0 0 100% 0);
          transition: clip-path 1.3s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .ab-img-wrap img {
          transform: scale(1.12);
          transition: transform 1.8s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .ab-reveal.ab-visible .ab-img-wrap {
          clip-path: inset(0 0 0% 0);
        }
        .ab-reveal.ab-visible .ab-img-wrap img {
          transform: scale(1);
        }

        .ab-divider { width: 40px; height: 1px; background: #C49A3A; margin-bottom: 20px; opacity: 0.7; }

        .ab-white-section {
          --cta-title-progress: 0;
          --cta-copy-progress: 0;
          --cta-actions-progress: 0;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: clamp(64px, 12vh, 120px) 24px;
          background: var(--bg-color, #050505);
          color: var(--text-color, #f2f2f2);
          transition: background-color 2.4s cubic-bezier(0.19, 1, 0.22, 1), color 2.2s cubic-bezier(0.19, 1, 0.22, 1);
          position: relative;
          z-index: 2;
        }
        .ab-white-content {
          max-width: 820px;
        }
        .ab-white-title {
          font-family: var(--font-cormorant), serif;
          font-size: clamp(2.1rem, 6vw, 4.3rem);
          font-weight: 500;
          letter-spacing: 0.03em;
          opacity: calc(0.1 + (var(--cta-title-progress) * 0.9));
          transform: translateY(calc((1 - var(--cta-title-progress)) * 30px)) scale(calc(0.985 + (var(--cta-title-progress) * 0.015)));
          filter: blur(calc((1 - var(--cta-title-progress)) * 8px));
          transition: opacity 1.8s cubic-bezier(0.19, 1, 0.22, 1), transform 1.8s cubic-bezier(0.19, 1, 0.22, 1), filter 1.6s cubic-bezier(0.19, 1, 0.22, 1);
        }
        .ab-white-sub {
          margin: 24px auto 0;
          max-width: 620px;
          font-size: clamp(0.95rem, 1.3vw, 1.1rem);
          line-height: 1.85;
          opacity: calc(var(--cta-copy-progress) * 0.74);
          transform: translateY(calc((1 - var(--cta-copy-progress)) * 22px));
          filter: blur(calc((1 - var(--cta-copy-progress)) * 6px));
          transition: opacity 2s cubic-bezier(0.19, 1, 0.22, 1), transform 2s cubic-bezier(0.19, 1, 0.22, 1), filter 1.7s cubic-bezier(0.19, 1, 0.22, 1);
        }
        .ab-white-actions {
          margin-top: 36px;
          display: flex;
          justify-content: center;
          gap: 14px;
          flex-wrap: wrap;
          opacity: calc(var(--cta-actions-progress) * 0.98);
          transform: translateY(calc((1 - var(--cta-actions-progress)) * 16px));
          filter: blur(calc((1 - var(--cta-actions-progress)) * 4px));
          transition: opacity 2.2s cubic-bezier(0.19, 1, 0.22, 1), transform 2.2s cubic-bezier(0.19, 1, 0.22, 1), filter 1.7s cubic-bezier(0.19, 1, 0.22, 1);
        }
        .ab-white-actions a {
          border: 1px solid currentColor;
          border-radius: 999px;
          padding: 14px 30px;
          text-decoration: none;
          color: inherit;
          font-size: 0.75rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          font-family: var(--font-geist-sans), sans-serif;
          transition: background-color 0.35s ease, color 0.35s ease, border-color 0.35s ease;
        }
        .ab-white-actions a:hover {
          background: #0a0a0a;
          color: #e3e4e0;
          border-color: #0a0a0a;
        }
        .ab-white-contact-row {
          margin-top: 26px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          gap: 12px 18px;
          font-family: var(--font-geist-sans), sans-serif;
          font-size: 0.92rem;
          color: rgba(10, 10, 10, 0.72);
          opacity: calc(var(--cta-actions-progress) * 0.98);
          transform: translateY(calc((1 - var(--cta-actions-progress)) * 12px));
          transition: opacity 2.2s cubic-bezier(0.19, 1, 0.22, 1), transform 2.2s cubic-bezier(0.19, 1, 0.22, 1);
        }
        .ab-white-contact-link {
          color: inherit;
          text-decoration: none;
          border-bottom: 1px solid rgba(10, 10, 10, 0.32);
          padding-bottom: 1px;
          transition: color 0.25s ease, border-color 0.25s ease;
        }
        .ab-white-contact-link:hover {
          color: #0a0a0a;
          border-color: rgba(10, 10, 10, 0.64);
        }
        .ab-white-socials {
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .ab-white-social-link {
          width: 34px;
          height: 34px;
          border-radius: 999px;
          border: 1px solid rgba(10, 10, 10, 0.28);
          color: rgba(10, 10, 10, 0.9);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
        }
        .ab-white-social-link svg { width: 16px; height: 16px; display: block; }
        .ab-white-social-link:hover { background: #0a0a0a; color: #e3e4e0; border-color: #0a0a0a; }
      `}</style>

      {/* Dot texture — fixed behind everything */}
      <canvas ref={textureCanvasRef} style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", opacity: 0.4 }} />

      <main style={{ position: "relative", zIndex: 1, background: "transparent", color: "#E3E4E0" }}>

        {/* ── Hero ── */}
        <section
          ref={heroRef}
          style={{
            position: "relative",
            minHeight: "100vh",
            display: "flex",
            alignItems: "flex-end",
            overflow: "hidden",
          }}
        >
          <div style={{ position: "absolute", inset: 0 }}>
            <Image src={IMAGES.hero} alt="Mayaakars interior" fill className="object-cover" style={{ filter: "brightness(0.3)" }} priority />
          </div>
          <div style={{ position: "relative", zIndex: 2, padding: "clamp(48px,8vw,100px)", maxWidth: "900px" }}>
            <RevealSection>
              <p style={{ fontSize: "0.65rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "#C49A3A", marginBottom: "20px", fontFamily: "var(--font-geist-sans), sans-serif" }}>
                About Mayaakars
              </p>
              <h1 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "clamp(2.8rem, 7vw, 6rem)", fontWeight: 400, lineHeight: 1.02, letterSpacing: "0.01em", margin: "0 0 28px", color: "#E3E4E0" }}>
                Thoughtfully Designed.<br />Intentionally Crafted.
              </h1>
              <p style={{ fontFamily: "var(--font-geist-sans), sans-serif", fontSize: "clamp(0.9rem, 1.3vw, 1.05rem)", lineHeight: 1.85, color: "rgba(227,228,224,0.65)", maxWidth: "620px" }}>
                Established over seven years ago with a simple belief — that meaningful spaces are born when architecture and interior design are conceived as one.
              </p>
            </RevealSection>
          </div>
        </section>

        {/* ── Brand Statement ── */}
        <section style={{ padding: "clamp(80px,12vw,140px) clamp(24px,6vw,80px)" }}>
          <RevealSection>
            <p style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "clamp(1.5rem,3.2vw,2.4rem)", fontWeight: 400, lineHeight: 1.6, color: "rgba(227,228,224,0.85)", maxWidth: "900px", margin: "0 auto", textAlign: "center", fontStyle: "italic" }}>
              "What began as a design-driven practice has evolved into a multidisciplinary studio creating refined residential and commercial environments — shaped by a deep respect for context, materiality, light, and the human experience."
            </p>
          </RevealSection>
        </section>

        {/* ── Philosophy — text left, image right ── */}
        <section style={{ padding: "0 clamp(24px,6vw,80px) clamp(80px,12vw,140px)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(40px,6vw,100px)", alignItems: "center" }} className="ab-two-col">
          <RevealSection>
            <div className="ab-divider" />
            <p style={{ fontSize: "0.65rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "#C49A3A", marginBottom: "20px", fontFamily: "var(--font-geist-sans), sans-serif" }}>Our Philosophy</p>
            <h2 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "clamp(1.8rem,3.5vw,2.8rem)", fontWeight: 400, color: "#E3E4E0", margin: "0 0 24px", lineHeight: 1.1 }}>
              Design Beyond Aesthetics
            </h2>
            <p style={{ fontFamily: "var(--font-geist-sans), sans-serif", fontSize: "clamp(0.85rem,1.1vw,0.95rem)", lineHeight: 1.9, color: "rgba(227,228,224,0.6)", marginBottom: "16px" }}>
              At Mayaakars, design goes beyond aesthetics. It is about how a space feels, functions, and endures. We believe great design emerges from clarity of thought and attention to detail — from the earliest concept to the final execution.
            </p>
            <p style={{ fontFamily: "var(--font-geist-sans), sans-serif", fontSize: "clamp(0.85rem,1.1vw,0.95rem)", lineHeight: 1.9, color: "rgba(227,228,224,0.6)" }}>
              Our process is rooted in understanding the people who will inhabit the space, the purpose it serves, and the environment it belongs to. The result is architecture and interiors that are cohesive, expressive, and timeless.
            </p>
          </RevealSection>
          <RevealSection className="ab-reveal-delay-2">
            <div className="ab-img-wrap" style={{ aspectRatio: "4/5" }}>
              <Image src={IMAGES.philosophy} alt="Architectural design" fill className="object-cover" sizes="(max-width:768px) 100vw, 50vw" />
            </div>
          </RevealSection>
        </section>

        {/* ── Integrated — image left, text right ── */}
        <section style={{ padding: "0 clamp(24px,6vw,80px) clamp(80px,12vw,140px)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(40px,6vw,100px)", alignItems: "center" }} className="ab-two-col">
          <RevealSection className="ab-reveal-delay-1">
            <div className="ab-img-wrap" style={{ aspectRatio: "4/5" }}>
              <Image src={IMAGES.integrated} alt="Interior design" fill className="object-cover" sizes="(max-width:768px) 100vw, 50vw" />
            </div>
          </RevealSection>
          <RevealSection className="ab-reveal-delay-2">
            <div className="ab-divider" />
            <p style={{ fontSize: "0.65rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "#C49A3A", marginBottom: "20px", fontFamily: "var(--font-geist-sans), sans-serif" }}>Our Approach</p>
            <h2 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "clamp(1.8rem,3.5vw,2.8rem)", fontWeight: 400, color: "#E3E4E0", margin: "0 0 24px", lineHeight: 1.1 }}>
              Architecture & Interiors, Seamlessly Integrated
            </h2>
            <p style={{ fontFamily: "var(--font-geist-sans), sans-serif", fontSize: "clamp(0.85rem,1.1vw,0.95rem)", lineHeight: 1.9, color: "rgba(227,228,224,0.6)", marginBottom: "16px" }}>
              Unlike conventional studios where architecture and interior design exist as separate disciplines, Mayaakars approaches them as a single, continuous dialogue.
            </p>
            <p style={{ fontFamily: "var(--font-geist-sans), sans-serif", fontSize: "clamp(0.85rem,1.1vw,0.95rem)", lineHeight: 1.9, color: "rgba(227,228,224,0.6)" }}>
              This integrated methodology allows us to maintain design integrity across scales — ensuring that the structure, spatial flow, materials, and details work together in harmony. Fewer conflicts, greater cohesion.
            </p>
          </RevealSection>
        </section>

        {/* ── Journey Stats ── */}
        <section style={{ padding: "clamp(60px,10vw,120px) clamp(24px,6vw,80px)", borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(40px,6vw,80px)", alignItems: "center" }} className="ab-two-col">
            <div>
              <RevealSection>
                <div className="ab-divider" />
                <p style={{ fontSize: "0.65rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "#C49A3A", marginBottom: "20px", fontFamily: "var(--font-geist-sans), sans-serif" }}>Our Journey</p>
                <h2 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "clamp(1.8rem,3.5vw,2.8rem)", fontWeight: 400, color: "#E3E4E0", margin: "0 0 24px", lineHeight: 1.1 }}>Seven Years of Purposeful Design</h2>
                <p style={{ fontFamily: "var(--font-geist-sans), sans-serif", fontSize: "clamp(0.85rem,1.1vw,0.95rem)", lineHeight: 1.9, color: "rgba(227,228,224,0.6)" }}>
                  Over the past seven years, Mayaakars has collaborated with homeowners, developers, and businesses to deliver spaces that balance function with emotion. Our portfolio spans private residences, villas, apartments, commercial interiors, and bespoke design projects — each reflecting our commitment to craftsmanship and spatial intelligence.
                </p>
              </RevealSection>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginTop: "48px" }}>
                {STATS.map((stat, i) => (
                  <RevealSection key={stat.label} className={`ab-reveal-delay-${i % 3 + 1}`}>
                    <p style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 400, color: "#C49A3A", margin: "0 0 6px", lineHeight: 1 }}>{stat.value}</p>
                    <p style={{ fontFamily: "var(--font-geist-sans), sans-serif", fontSize: "0.72rem", letterSpacing: "0.1em", color: "rgba(227,228,224,0.4)", textTransform: "uppercase" }}>{stat.label}</p>
                  </RevealSection>
                ))}
              </div>
            </div>
            <RevealSection className="ab-reveal-delay-2">
              <div className="ab-img-wrap" style={{ aspectRatio: "3/4" }}>
                <Image src={IMAGES.journey} alt="Our work" fill className="object-cover" sizes="(max-width:768px) 100vw, 50vw" />
              </div>
            </RevealSection>
          </div>
        </section>

        {/* ── What Defines Mayaakars ── */}
        <section style={{ padding: "clamp(80px,12vw,140px) clamp(24px,6vw,80px)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(40px,6vw,100px)", alignItems: "center" }} className="ab-two-col">
          <RevealSection>
            <div className="ab-img-wrap" style={{ aspectRatio: "3/4" }}>
              <Image src={IMAGES.approach} alt="Our approach" fill className="object-cover" sizes="(max-width:768px) 100vw, 50vw" />
            </div>
          </RevealSection>
          <div>
            <RevealSection>
              <div className="ab-divider" />
              <p style={{ fontSize: "0.65rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "#C49A3A", marginBottom: "20px", fontFamily: "var(--font-geist-sans), sans-serif" }}>What Defines Us</p>
              <h2 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "clamp(1.8rem,3.5vw,2.8rem)", fontWeight: 400, color: "#E3E4E0", margin: "0 0 36px", lineHeight: 1.1 }}>
                The Mayaakars Standard
              </h2>
            </RevealSection>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {DEFINES.map((item, i) => (
                <RevealSection key={item} className={`ab-reveal-delay-${(i % 3) + 1}`}>
                  <li style={{ display: "flex", alignItems: "flex-start", gap: "14px", padding: "16px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <span style={{ color: "#C49A3A", fontSize: "0.45rem", marginTop: "6px", flexShrink: 0 }}>◆</span>
                    <span style={{ fontFamily: "var(--font-geist-sans), sans-serif", fontSize: "clamp(0.85rem,1.1vw,0.95rem)", lineHeight: 1.7, color: "rgba(227,228,224,0.65)" }}>{item}</span>
                  </li>
                </RevealSection>
              ))}
            </ul>
          </div>
        </section>

        {/* ── CTA — white scroll-blend ── */}
        <section ref={ctaSectionRef} className="ab-white-section">
          <div className="ab-white-content">
            <h2 className="ab-white-title">Let&apos;s Design Something Meaningful</h2>
            <p className="ab-white-sub">
              Whether you are building from the ground up or reimagining an existing space, Mayaakars offers a thoughtful, integrated approach to architecture and interior design.
            </p>
            <div className="ab-white-actions">
              <Link href="/contact">Schedule a Consultation</Link>
              <Link href="/contact">Get in Touch</Link>
            </div>
            <div className="ab-white-contact-row">
              <a className="ab-white-contact-link" href={`tel:${CONTACT_PHONE.replace(/\s/g, "")}`}>{CONTACT_PHONE}</a>
              <a className="ab-white-contact-link" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
              <div className="ab-white-socials">
                <a className="ab-white-social-link" href="https://www.instagram.com/mayaakars/" target="_blank" rel="noreferrer" aria-label="Instagram">
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8"/><circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.8"/><circle cx="17.3" cy="6.7" r="1.1" fill="currentColor"/></svg>
                </a>
                <a className="ab-white-social-link" href="https://www.facebook.com/profile.php?id=100088682401205" target="_blank" rel="noreferrer" aria-label="Facebook">
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M13.5 21V13.3H16.1L16.5 10.3H13.5V8.35C13.5 7.48 13.74 6.89 14.99 6.89H16.6V4.2C16.32 4.17 15.36 4.08 14.24 4.08C11.92 4.08 10.33 5.5 10.33 8.1V10.3H7.75V13.3H10.33V21H13.5Z" fill="currentColor"/></svg>
                </a>
              </div>
            </div>
          </div>
        </section>

      </main>

      <style>{`
        @media (max-width: 768px) {
          .ab-two-col { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
