"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const CONTACT_PHONE = "+91 97318 47847";
const CONTACT_EMAIL = "mail@ordientgroup.com";

const IMAGES = {
  hero: "/Mayaakars/interior-residencial/panorama-house/living-room-.webp",
  philosophy: "/Mayaakars/architect-residence/panorama-house/title-photo.webp",
  integrated: "/Mayaakars/architect-residence/panorama-house/22.webp",
  journey: "/Mayaakars/founder.webp",
  approach: "/Mayaakars/interior-residencial/panorama-house/drawing-room-.webp",
  cta: "/Mayaakars/interior-residencial/house-of-13-arches/living-area.webp",
};

const STATS = [
  { value: "15+", label: "Years of Practice" },
  { value: "500+", label: "Projects Delivered" },
  { value: "2", label: "Design Disciplines" },
  { value: "1", label: "Integrated Studio" },
];

const DEFINES = [
  "A philosophy centered on shaping dreams into space",
  "Integrated architecture and interior design thinking",
  "Strong emphasis on materiality, light, and proportion",
  "A design process rooted in clarity and collaboration",
  "Spaces that are intended to age gracefully",
];

export default function AboutPage() {
  const heroRef = useRef<HTMLElement>(null);
  const textureCanvasRef = useRef<HTMLCanvasElement>(null);
  const ctaSectionRef = useRef<HTMLElement>(null);
  const mainRef = useRef<HTMLElement>(null);

  // GSAP Animations
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // 1. Staggered text reveals
      const textElements = gsap.utils.toArray<HTMLElement>(".gsap-reveal-text");
      textElements.forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      });

      // 3. Founder Circular Image reveal
      const founderWrap = document.querySelector(".gsap-founder-wrap");
      if (founderWrap) {
        gsap.fromTo(
          founderWrap,
          { opacity: 0, scale: 0.8 },
          {
            opacity: 1,
            scale: 1,
            duration: 1.4,
            ease: "back.out(1.2)",
            scrollTrigger: {
              trigger: founderWrap,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, mainRef);

    return () => ctx.revert();
  }, []);

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
    const hexToRgb = (hex: string) => { const n = parseInt(hex.replace("#", ""), 16); return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }; };
    const mix = (from: string, to: string, t: number) => {
      const a = hexToRgb(from), b = hexToRgb(to);
      const l = (s: number, e: number) => Math.round(s + (e - s) * t);
      return `rgb(${l(a.r, b.r)},${l(a.g, b.g)},${l(a.b, b.b)})`;
    };
    const smooth = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
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
      if (textureCanvasRef.current) {
        textureCanvasRef.current.style.opacity = String(0.4 * (1 - blend));
      }
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
      if (textureCanvasRef.current) textureCanvasRef.current.style.opacity = "0.4";
    };
  }, []);

  return (
    <>
      <style>{`
        .ab-divider { width: 40px; height: 1px; background: #C49A3A; margin-bottom: 20px; opacity: 0.7; }

        .gsap-img-wrap { overflow: hidden; border-radius: 2px; }

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

        @media (max-width: 768px) {
          .ab-two-col { grid-template-columns: 1fr !important; }
          .ab-hero-gap { padding-top: clamp(60px, 10vw, 100px) !important; }
          .ab-two-col .ab-img { order: 1; }
          .ab-two-col .ab-text { order: 2; }
        }
      `}</style>

      {/* Dot texture — fixed behind everything */}
      <canvas ref={textureCanvasRef} style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", opacity: 0.4 }} />

      <main ref={mainRef} style={{ position: "relative", zIndex: 1, background: "var(--bg-color, #050505)", color: "var(--text-color, #f2f2f2)", transition: "background-color 2.4s cubic-bezier(0.19,1,0.22,1), color 2.2s cubic-bezier(0.19,1,0.22,1)" }}>

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
            <div className="gsap-reveal-text">
              <p style={{ fontSize: "0.65rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "#C49A3A", marginBottom: "20px", fontFamily: "var(--font-geist-sans), sans-serif" }}>
                About Mayaakars
              </p>
              <h1 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "clamp(2.8rem, 7vw, 6rem)", fontWeight: 400, lineHeight: 1.02, letterSpacing: "0.01em", margin: "0 0 28px", color: "#E3E4E0" }}>
                Where Dreams<br />Take Shape
              </h1>
              <div style={{ fontFamily: "var(--font-geist-sans), sans-serif", fontSize: "clamp(0.9rem, 1.15vw, 1.05rem)", lineHeight: 1.85, color: "rgba(227,228,224,0.65)", maxWidth: "620px" }}>
                The name Mayaakars is derived from two simple yet powerful ideas.<br />
                <br />
                <span style={{ color: "#E3E4E0" }}>Maya</span> — representing dreams, imagination, and vision.<br />
                <span style={{ color: "#E3E4E0" }}>Akar</span> — meaning form, shape, or structure.<br />
                <br />
                Together, Mayaakars embodies a singular philosophy: shaping dreams into spaces that can be lived in, experienced, and remembered.
              </div>
            </div>
          </div>
        </section>

        {/* ── Philosophy — text left, image right ── */}
        <section style={{ padding: "0 clamp(24px,6vw,80px) clamp(80px,12vw,140px)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(40px,6vw,100px)", alignItems: "center" }} className="ab-two-col ab-hero-gap">
          <div className="gsap-reveal-text ab-text">
            <div className="ab-divider" />
            <p style={{ fontSize: "0.65rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "#C49A3A", marginBottom: "20px", fontFamily: "var(--font-geist-sans), sans-serif" }}>Our Philosophy</p>
            <h2 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "clamp(1.8rem,3.5vw,2.8rem)", fontWeight: 400, color: "#E3E4E0", margin: "0 0 24px", lineHeight: 1.1 }}>
              Our Philosophy
            </h2>
            <div style={{ fontFamily: "var(--font-geist-sans), sans-serif", fontSize: "clamp(0.9rem, 1.15vw, 1.05rem)", lineHeight: 1.8, color: "rgba(227,228,224,0.75)", marginBottom: "16px" }}>
              At Mayaakars, design is not merely about appearance.<br />
              It is about how a space is imagined, shaped, and ultimately experienced.<br />
              Great design emerges when creativity is balanced with precision — when every decision, from spatial planning to the smallest material detail, contributes to a cohesive vision.<br /><br />
              Our philosophy centers on three principles:
              <ul style={{ listStyleType: "disc", paddingLeft: "16px", marginTop: "8px", marginBottom: "8px" }}>
                <li>Understanding the people who inhabit the space</li>
                <li>Respecting the context in which it exists</li>
                <li>Crafting environments that remain relevant over time</li>
              </ul>
              This approach allows us to create spaces that are not only visually refined but also deeply functional and enduring.
            </div>
          </div>
          <div className="gsap-reveal-text ab-img">
            <div className="gsap-img-wrap" style={{ aspectRatio: "4/5", position: "relative" }}>
              <Image src={IMAGES.philosophy} alt="Architectural design" fill className="object-cover" sizes="(max-width:768px) 100vw, 50vw" />
            </div>
          </div>
        </section>

        {/* ── Integrated — image left, text right ── */}
        <section style={{ padding: "0 clamp(24px,6vw,80px) clamp(80px,12vw,140px)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(40px,6vw,100px)", alignItems: "center" }} className="ab-two-col">
          <div className="gsap-reveal-text ab-img">
            <div className="gsap-img-wrap" style={{ aspectRatio: "4/5", position: "relative" }}>
              <Image src={IMAGES.integrated} alt="Interior design" fill className="object-cover" sizes="(max-width:768px) 100vw, 50vw" />
            </div>
          </div>
          <div className="gsap-reveal-text ab-text">
            <div className="ab-divider" />
            <p style={{ fontSize: "0.65rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "#C49A3A", marginBottom: "20px", fontFamily: "var(--font-geist-sans), sans-serif" }}>Integrated Design</p>
            <h2 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "clamp(1.8rem,3.5vw,2.8rem)", fontWeight: 400, color: "#E3E4E0", margin: "0 0 24px", lineHeight: 1.1 }}>
              Architecture & Interiors as One Conversation
            </h2>
            <p style={{ fontFamily: "var(--font-geist-sans), sans-serif", fontSize: "clamp(0.9rem, 1.15vw, 1.05rem)", lineHeight: 1.8, color: "rgba(227,228,224,0.75)", marginBottom: "16px" }}>
              Rather than treating architecture and interior design as separate disciplines, Mayaakars approaches them as one continuous dialogue.
            </p>
            <p style={{ fontFamily: "var(--font-geist-sans), sans-serif", fontSize: "clamp(0.9rem, 1.15vw, 1.05rem)", lineHeight: 1.8, color: "rgba(227,228,224,0.75)" }}>
              Structure, light, materials, and spatial flow are considered together from the very beginning. This integrated process ensures that every element of a project works in harmony — from the architectural framework to the interior experience.<br /><br />
              The result is a design language that feels cohesive, intentional, and complete.
            </p>
          </div>
        </section>

        {/* ── Journey Stats ── */}
        <section style={{ padding: "clamp(60px,10vw,120px) clamp(24px,6vw,80px)", borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(40px,6vw,80px)", alignItems: "center" }} className="ab-two-col">
            <div className="ab-text">
              <div className="gsap-reveal-text">
                <div className="ab-divider" />
                <p style={{ fontSize: "0.65rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "#C49A3A", marginBottom: "20px", fontFamily: "var(--font-geist-sans), sans-serif" }}>Our Journey</p>
                <h2 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "clamp(1.8rem,3.5vw,2.8rem)", fontWeight: 400, color: "#E3E4E0", margin: "0 0 24px", lineHeight: 1.1 }}>Fifteen Years of Purposeful Design</h2>
                <p style={{ fontFamily: "var(--font-geist-sans), sans-serif", fontSize: "clamp(0.9rem, 1.15vw, 1.05rem)", lineHeight: 1.8, color: "rgba(227,228,224,0.75)", marginBottom: "16px" }}>
                  Mayaakars was founded by Prajwal Kumar in 2011 with a clear design intent — to shape spaces where vision and structure exist in quiet balance. Over the past Fifteen years, Mayaakars has collaborated with homeowners, developers, and businesses to create spaces that balance function with emotion.
                </p>
                <div style={{ fontFamily: "var(--font-geist-sans), sans-serif", fontSize: "clamp(0.9rem, 1.15vw, 1.05rem)", lineHeight: 1.8, color: "rgba(227,228,224,0.75)" }}>
                  Our portfolio includes:
                  <ul style={{ listStyleType: "disc", paddingLeft: "16px", marginTop: "8px", marginBottom: "8px" }}>
                    <li>Private residences</li>
                    <li>Villas and custom homes</li>
                    <li>Apartment interiors</li>
                    <li>Commercial environments</li>
                    <li>Bespoke design projects</li>
                  </ul>
                  Each project contributes to our evolving understanding of how architecture can shape the way people live and interact with their surroundings.
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginTop: "48px" }}>
                {STATS.map((stat) => (
                  <div key={stat.label} className="gsap-reveal-text">
                    <p style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 400, color: "#C49A3A", margin: "0 0 6px", lineHeight: 1 }}>{stat.value}</p>
                    <p style={{ fontFamily: "var(--font-geist-sans), sans-serif", fontSize: "0.72rem", letterSpacing: "0.1em", color: "rgba(227,228,224,0.4)", textTransform: "uppercase" }}>{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="gsap-reveal-text ab-img" style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100%" }}>
              <div className="gsap-founder-wrap" style={{ position: "relative", width: "clamp(280px, 38vw, 480px)", aspectRatio: "1/1", borderRadius: "50%", overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)" }}>
                <Image src={IMAGES.journey} alt="Prajwal Kumar - Founder" fill className="object-cover" sizes="(max-width:768px) 240px, 320px" />
              </div>
            </div>
          </div>
        </section>

        {/* ── Our Approach ── */}
        <section style={{ padding: "clamp(80px,12vw,140px) clamp(24px,6vw,80px)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(40px,6vw,100px)", alignItems: "center" }} className="ab-two-col">
          <div className="gsap-reveal-text ab-text">
            <div className="ab-divider" />
            <p style={{ fontSize: "0.65rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "#C49A3A", marginBottom: "20px", fontFamily: "var(--font-geist-sans), sans-serif" }}>Our Process</p>
            <h2 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "clamp(1.8rem,3.5vw,2.8rem)", fontWeight: 400, color: "#E3E4E0", margin: "0 0 24px", lineHeight: 1.1 }}>
              Our Approach
            </h2>
            <p style={{ fontFamily: "var(--font-geist-sans), sans-serif", fontSize: "clamp(0.9rem, 1.15vw, 1.05rem)", lineHeight: 1.8, color: "rgba(227,228,224,0.75)", marginBottom: "16px" }}>
              Every project begins with listening.<br />
              We take the time to understand the aspirations, lifestyle, and vision of the people we work with. From there, ideas are translated into spatial concepts through careful planning, detailed drawings, and visual exploration.
            </p>
            <div style={{ fontFamily: "var(--font-geist-sans), sans-serif", fontSize: "clamp(0.9rem, 1.15vw, 1.05rem)", lineHeight: 1.8, color: "rgba(227,228,224,0.75)" }}>
              Our process typically includes:
              <ul style={{ listStyleType: "disc", paddingLeft: "16px", marginTop: "8px", marginBottom: "8px" }}>
                <li>Concept development</li>
                <li>Architectural planning</li>
                <li>Interior design integration</li>
                <li>3D visualization and detailing</li>
                <li>Execution coordination</li>
              </ul>
              This structured yet flexible approach allows us to guide a project from its earliest idea to its final realization with clarity and consistency.
            </div>
          </div>
          <div className="gsap-reveal-text ab-img">
            <div className="gsap-img-wrap" style={{ aspectRatio: "4/5", position: "relative" }}>
              <Image src={IMAGES.approach} alt="Our approach" fill className="object-cover" sizes="(max-width:768px) 100vw, 50vw" />
            </div>
          </div>
        </section>

        {/* ── What Defines Mayaakars ── */}
        <section style={{ padding: "clamp(80px,12vw,140px) clamp(24px,6vw,80px)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(40px,6vw,100px)", alignItems: "center" }} className="ab-two-col">
          <div className="gsap-reveal-text ab-img">
            <div className="gsap-img-wrap" style={{ aspectRatio: "3/4", position: "relative" }}>
              <Image src={IMAGES.cta} alt="What defines us" fill className="object-cover" sizes="(max-width:768px) 100vw, 50vw" />
            </div>
          </div>
          <div className="ab-text">
            <div className="gsap-reveal-text">
              <div className="ab-divider" />
              <p style={{ fontSize: "0.65rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "#C49A3A", marginBottom: "20px", fontFamily: "var(--font-geist-sans), sans-serif" }}>What Defines Us</p>
              <h2 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "clamp(1.8rem,3.5vw,2.8rem)", fontWeight: 400, color: "#E3E4E0", margin: "0 0 36px", lineHeight: 1.1 }}>
                What Defines Mayaakars
              </h2>
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {DEFINES.map((item) => (
                <li key={item} className="gsap-reveal-text" style={{ display: "flex", alignItems: "flex-start", gap: "14px", padding: "16px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <span style={{ color: "#C49A3A", fontSize: "0.45rem", marginTop: "6px", flexShrink: 0 }}>◆</span>
                  <span style={{ fontFamily: "var(--font-geist-sans), sans-serif", fontSize: "clamp(0.9rem, 1.15vw, 1.05rem)", lineHeight: 1.7, color: "rgba(227,228,224,0.75)" }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── CTA — white scroll-blend ── */}
        <section ref={ctaSectionRef} className="ab-white-section">
          <div className="ab-white-content">
            <h2 className="ab-white-title gsap-reveal-text">Let&apos;s Shape Your Vision</h2>
            <p className="ab-white-sub gsap-reveal-text">
              Whether you are building from the ground up or reimagining an existing space, Mayaakars offers a thoughtful and integrated approach to architecture and interior design.
            </p>
            <p className="ab-white-sub gsap-reveal-text">
              Let’s create spaces where dreams take shape.
            </p>
            <div className="ab-white-actions gsap-reveal-text">
              <Link href="/contact">Schedule a Consultation</Link>
              <Link href="/contact">Get in Touch</Link>
            </div>
            <div className="ab-white-contact-row gsap-reveal-text">
              <a className="ab-white-contact-link" href={`tel:${CONTACT_PHONE.replace(/\s/g, "")}`}>{CONTACT_PHONE}</a>
              <a className="ab-white-contact-link" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
              <div className="ab-white-socials">
                <a className="ab-white-social-link" href="https://www.instagram.com/mayaakars/" target="_blank" rel="noreferrer" aria-label="Instagram">
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" /><circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.8" /><circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" /></svg>
                </a>
                <a className="ab-white-social-link" href="https://www.facebook.com/profile.php?id=100088682401205" target="_blank" rel="noreferrer" aria-label="Facebook">
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M13.5 21V13.3H16.1L16.5 10.3H13.5V8.35C13.5 7.48 13.74 6.89 14.99 6.89H16.6V4.2C16.32 4.17 15.36 4.08 14.24 4.08C11.92 4.08 10.33 5.5 10.33 8.1V10.3H7.75V13.3H10.33V21H13.5Z" fill="currentColor" /></svg>
                </a>
              </div>
            </div>
          </div>
        </section>

      </main>
    </>
  );
}
