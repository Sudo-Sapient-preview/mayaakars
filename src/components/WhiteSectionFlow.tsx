"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

type WhiteSectionFlowProps = {
  heading?: string;
  subtext?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  /**
   * Reserved for legacy usage. Page-level code now drives the blend.
   * Kept for backwards compatibility to avoid breaking callers.
   */
  enablePageBlend?: boolean;
};

export default function WhiteSectionFlow({
  heading = "Let's Design Something Meaningful",
  subtext = "Whether you are building from the ground up or reimagining an existing space, Mayaakars offers a thoughtful, integrated approach to architecture and interior design.",
  primaryLabel = "Schedule a Consultation",
  primaryHref = "/contact",
  secondaryLabel = "Get in Touch",
  secondaryHref = "/contact",
  enablePageBlend = true,
}: WhiteSectionFlowProps) {
  // kept for backward compatibility, no-op in hybrid flow
  void enablePageBlend;
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const body = document.body;
    const previousNavbarVariant = body.getAttribute("data-navbar-variant");
    const previousBgColor = body.style.getPropertyValue("--bg-color");
    const previousTextColor = body.style.getPropertyValue("--text-color");

    const hexToRgb = (hex: string) => {
      const normalized = hex.replace("#", "");
      const num = parseInt(normalized, 16);
      return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
    };

    const mix = (from: string, to: string, t: number) => {
      const a = hexToRgb(from);
      const b = hexToRgb(to);
      const lerp = (start: number, end: number) => Math.round(start + (end - start) * t);
      return `rgb(${lerp(a.r, b.r)}, ${lerp(a.g, b.g)}, ${lerp(a.b, b.b)})`;
    };

    const thresholds = Array.from({ length: 101 }, (_, i) => i / 100);

    const smoothStep = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);

    const observer = new IntersectionObserver(
      ([entry]) => {
        const ratio = Math.max(0, Math.min(1, entry?.intersectionRatio ?? 0));
        const eased = smoothStep(ratio);

        section.classList.toggle("is-visible", ratio > 0.12);

        if (!enablePageBlend) return;

        body.style.setProperty("--bg-color", mix("#050505", "#ffffff", eased));
        body.style.setProperty("--text-color", mix("#f2f2f2", "#0a0a0a", eased));

        if (eased > 0.62) {
          body.setAttribute("data-navbar-variant", "light");
        } else if (previousNavbarVariant === null) {
          body.removeAttribute("data-navbar-variant");
        } else {
          body.setAttribute("data-navbar-variant", previousNavbarVariant);
        }
      },
      { threshold: thresholds, rootMargin: "0px 0px -5% 0px" }
    );
    observer.observe(section);

    return () => {
      observer.disconnect();
      section.classList.remove("is-visible");
      if (enablePageBlend) {
        if (previousBgColor) body.style.setProperty("--bg-color", previousBgColor);
        else body.style.removeProperty("--bg-color");
        if (previousTextColor) body.style.setProperty("--text-color", previousTextColor);
        else body.style.removeProperty("--text-color");
        if (previousNavbarVariant === null) body.removeAttribute("data-navbar-variant");
        else body.setAttribute("data-navbar-variant", previousNavbarVariant);
      }
    };
  }, [enablePageBlend]);

  return (
    <>
      <style>{`
        .mk-white-flow-wrap {
          position: relative;
          z-index: 10;
          background:
            radial-gradient(circle at 30% 10%, rgba(255, 255, 255, 0.24), transparent 46%),
            radial-gradient(circle at 70% 12%, rgba(243, 244, 246, 0.3), transparent 48%),
            linear-gradient(
              180deg,
              rgba(255, 255, 255, 0.0) 0%,
              rgba(250, 250, 250, 0.12) 20%,
              rgba(243, 244, 246, 0.36) 44%,
              #ffffff 68%,
              #fafafa 88%,
              #eceef1 100%
            );
          overflow: hidden;
        }

        .mk-white-flow-wrap::before {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: 100%;
          height: 32vh;
          background: linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(240,241,243,0.6) 55%, rgba(236,238,241,0.85) 100%);
          pointer-events: none;
          z-index: 0;
        }

        .mk-white-flow {
          position: relative;
          z-index: 1;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          background: transparent;
          color: #0a0a0a;
          padding: clamp(60px, 12vh, 120px) 0;
        }

        .mk-white-flow .bottom-heading {
          font-family: "Cormorant Garamond", serif;
          font-size: clamp(2rem, 6vw, 4rem);
          font-weight: 500;
          opacity: 0.12;
          transform: translateY(24px);
          transition: opacity 1s ease, transform 1s ease;
          letter-spacing: 0.05em;
          padding: 0 40px;
        }

        .mk-white-flow.is-visible .bottom-heading {
          opacity: 1;
          transform: translateY(0);
        }

        .mk-white-flow .bottom-sub {
          max-width: 520px;
          font-size: 0.95rem;
          line-height: 1.8;
          opacity: 0;
          transform: translateY(16px);
          transition: opacity 1.2s ease 0.2s, transform 1.2s ease 0.2s;
          margin-top: 24px;
          padding: 0 24px;
        }

        .mk-white-flow.is-visible .bottom-sub {
          opacity: 0.65;
          transform: translateY(0);
        }

        .mk-white-flow .btn-group {
          margin-top: 40px;
          display: flex;
          gap: 16px;
          opacity: 0;
          transition: opacity 1.5s ease 0.3s;
        }

        .mk-white-flow.is-visible .btn-group {
          opacity: 1;
        }

        .mk-white-flow .btn {
          padding: 15px 36px;
          border: 1px solid currentColor;
          border-radius: 50px;
          text-decoration: none;
          color: inherit;
          font-size: 0.8rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          font-weight: 500;
          transition:
            background-color var(--home-transition-duration) var(--home-transition-ease),
            color var(--home-transition-duration) var(--home-transition-ease),
            border-color var(--home-transition-duration) var(--home-transition-ease);
        }

        .mk-white-flow .btn:hover {
          background: #0a0a0a;
          color: #E3E4E0;
          border-color: #0a0a0a;
        }

        @media (max-width: 900px) {
          .mk-white-flow {
            height: auto;
            min-height: 80vh;
            padding: 60px 20px;
          }

          .mk-white-flow .btn-group {
            flex-direction: column;
            align-items: center;
          }

          .mk-white-flow .btn {
            padding: 13px 30px;
            font-size: 0.75rem;
          }

          .mk-white-flow .bottom-sub {
            font-size: 0.875rem;
            max-width: 94vw;
          }
        }
      `}</style>

      <div className="mk-white-flow-wrap">
        <section ref={sectionRef} className="mk-home-light-section mk-white-flow">
          <h2 className="bottom-heading">{heading}</h2>
          <p className="bottom-sub">{subtext}</p>
          <div className="btn-group">
            <Link href={primaryHref} className="btn">
              {primaryLabel}
            </Link>
            <Link href={secondaryHref} className="btn">
              {secondaryLabel}
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
