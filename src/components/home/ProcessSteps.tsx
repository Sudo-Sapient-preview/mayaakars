"use client";

import { useEffect, useRef } from "react";

const STEPS = [
  { num: "01", title: "Brief", desc: "We listen. Every project begins with a deep conversation about your vision, lifestyle, and aspirations." },
  { num: "02", title: "Concept", desc: "Ideas take shape. We develop design concepts that respond to your brief, the site, and the context." },
  { num: "03", title: "Design", desc: "Refinement through detail. Drawings, materials, and specifications are developed into a resolved design." },
  { num: "04", title: "Execution", desc: "Craft on site. We coordinate closely with contractors to ensure every detail is delivered with precision." },
  { num: "05", title: "Handover", desc: "Your space, complete. We walk you through every element and remain available long after the keys are handed over." },
];

export default function ProcessSteps() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const items = section.querySelectorAll<HTMLElement>(".ps-step");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add("ps-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    items.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        .ps-wrap {
          padding: clamp(80px, 12vw, 140px) clamp(24px, 6vw, 80px);
          background: #050505;
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        .ps-eyebrow {
          font-size: 0.65rem;
          letter-spacing: 0.4em;
          text-transform: uppercase;
          color: #C49A3A;
          font-family: var(--font-geist-sans), sans-serif;
          display: block;
          margin-bottom: 16px;
        }
        .ps-heading {
          font-family: var(--font-cormorant), serif;
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 400;
          color: #E3E4E0;
          margin: 0 0 clamp(48px, 8vw, 80px);
          letter-spacing: 0.02em;
          line-height: 1.1;
        }
        .ps-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 0;
          position: relative;
        }
        .ps-grid::before {
          content: "";
          position: absolute;
          top: 22px;
          left: calc(10% + 12px);
          right: calc(10% + 12px);
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(196,154,58,0.3) 20%, rgba(196,154,58,0.3) 80%, transparent);
          pointer-events: none;
        }
        .ps-step {
          padding: 0 clamp(8px, 2vw, 24px);
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.8s cubic-bezier(0.22,1,0.36,1), transform 0.8s cubic-bezier(0.22,1,0.36,1);
        }
        .ps-step:nth-child(1) { transition-delay: 0s; }
        .ps-step:nth-child(2) { transition-delay: 0.1s; }
        .ps-step:nth-child(3) { transition-delay: 0.2s; }
        .ps-step:nth-child(4) { transition-delay: 0.3s; }
        .ps-step:nth-child(5) { transition-delay: 0.4s; }
        .ps-step.ps-visible { opacity: 1; transform: translateY(0); }
        .ps-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          border: 1px solid #C49A3A;
          background: #050505;
          margin-bottom: 24px;
          position: relative;
          z-index: 1;
          transition: background 0.4s ease;
        }
        .ps-step.ps-visible .ps-dot { background: #C49A3A; }
        .ps-num {
          font-family: var(--font-cormorant), serif;
          font-size: clamp(1.8rem, 3vw, 2.5rem);
          font-weight: 400;
          color: rgba(196,154,58,0.18);
          line-height: 1;
          margin-bottom: 12px;
          letter-spacing: 0.02em;
        }
        .ps-title {
          font-family: var(--font-cormorant), serif;
          font-size: clamp(1.1rem, 1.6vw, 1.35rem);
          font-weight: 400;
          color: #E3E4E0;
          margin-bottom: 12px;
          letter-spacing: 0.02em;
        }
        .ps-desc {
          font-family: var(--font-geist-sans), sans-serif;
          font-size: clamp(0.78rem, 1vw, 0.85rem);
          line-height: 1.75;
          color: rgba(227,228,224,0.42);
        }
        @media (max-width: 900px) {
          .ps-grid {
            grid-template-columns: 1fr 1fr;
            gap: 40px 24px;
          }
          .ps-grid::before { display: none; }
        }
        @media (max-width: 540px) {
          .ps-grid { grid-template-columns: 1fr; gap: 36px; }
        }
      `}</style>

      <section ref={sectionRef} className="ps-wrap">
        <span className="ps-eyebrow">How We Work</span>
        <h2 className="ps-heading">Our Process</h2>
        <div className="ps-grid">
          {STEPS.map((step) => (
            <div key={step.num} className="ps-step">
              <div className="ps-dot" />
              <p className="ps-num">{step.num}</p>
              <h3 className="ps-title">{step.title}</h3>
              <p className="ps-desc">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
