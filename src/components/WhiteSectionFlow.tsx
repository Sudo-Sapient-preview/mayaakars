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

const CONTACT_PHONE = "+91 88844 96888";
const CONTACT_EMAIL = "info@mayaakars.com";
const INSTAGRAM_URL = "https://www.instagram.com/mayaakars/";
const FACEBOOK_URL = "https://www.facebook.com/profile.php?id=100088682401205";

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

        .mk-white-flow .contact-row {
          margin-top: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          gap: 12px 18px;
          font-family: var(--font-geist-sans), sans-serif;
          font-size: 0.95rem;
          color: rgba(10, 10, 10, 0.72);
          opacity: 0;
          transform: translateY(10px);
          transition: opacity 1.5s ease 0.35s, transform 1.5s ease 0.35s;
        }

        .mk-white-flow.is-visible .contact-row {
          opacity: 1;
          transform: translateY(0);
        }

        .mk-white-flow .contact-link {
          color: inherit;
          text-decoration: none;
          border-bottom: 1px solid rgba(10, 10, 10, 0.32);
          padding-bottom: 1px;
          transition: color 0.25s ease, border-color 0.25s ease;
        }

        .mk-white-flow .contact-link:hover {
          color: #0a0a0a;
          border-color: rgba(10, 10, 10, 0.64);
        }

        .mk-white-flow .social-links {
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .mk-white-flow .social-link {
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

        .mk-white-flow .social-link svg {
          width: 16px;
          height: 16px;
          display: block;
        }

        .mk-white-flow .social-link:hover {
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

          .mk-white-flow .contact-row {
            flex-direction: column;
            gap: 10px;
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

          <div className="contact-row">
            <a className="contact-link" href={`tel:${CONTACT_PHONE.replace(/\s+/g, "")}`}>
              {CONTACT_PHONE}
            </a>
            <a className="contact-link" href={`mailto:${CONTACT_EMAIL}`}>
              {CONTACT_EMAIL}
            </a>

            <div className="social-links" aria-label="Social links">
              <a
                className="social-link"
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
              >
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
                  <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.8" />
                  <circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" />
                </svg>
              </a>

              <a
                className="social-link"
                href={FACEBOOK_URL}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
              >
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M13.5 21V13.3H16.1L16.5 10.3H13.5V8.35C13.5 7.48 13.74 6.89 14.99 6.89H16.6V4.2C16.32 4.17 15.36 4.08 14.24 4.08C11.92 4.08 10.33 5.5 10.33 8.1V10.3H7.75V13.3H10.33V21H13.5Z"
                    fill="currentColor"
                  />
                </svg>
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
