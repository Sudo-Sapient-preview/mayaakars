"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import HeroSection from "@/components/home/HeroSection";

const IntroLogoOverlay = dynamic(
  () => import("@/components/loading/IntroLogoOverlay"),
  { ssr: false }
);
const ServicesAccordion = dynamic(
  () => import("@/components/home/ServicesAccordion"),
  { ssr: false }
);
const ProjectsCarousel = dynamic(
  () => import("@/components/home/ProjectsCarousel"),
  { ssr: false }
);
const Testimonials = dynamic(
  () => import("@/components/home/Testimonials"),
  { ssr: false }
);
const Philosophy = dynamic(
  () => import("@/components/home/Philosophy"),
  { ssr: false }
);

const INTRO_SEEN_KEY = "mayaakars:intro-seen";
const INTRO_MAX_WAIT_MS = 8000;
const CONTACT_PHONE = "+91 88844 96888";
const CONTACT_EMAIL = "info@mayaakars.com";
const INSTAGRAM_URL = "https://www.instagram.com/mayaakars/";
const FACEBOOK_URL = "https://www.facebook.com/profile.php?id=100088682401205";

const markIntroComplete = () => {
  document.documentElement.setAttribute("data-intro-complete", "true");
  window.dispatchEvent(new Event("mayaakars:intro-complete"));
};

export default function Home() {
  const whiteSectionRef = useRef<HTMLElement>(null);
  const [showIntro, setShowIntro] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [introAnimationDone, setIntroAnimationDone] = useState(false);
  const [criticalAssetsReady, setCriticalAssetsReady] = useState(false);
  const [introTimeoutReached, setIntroTimeoutReached] = useState(false);

  useEffect(() => {
    const introSeenOnBoot =
      window.sessionStorage.getItem(INTRO_SEEN_KEY) === "true";

    if (!introSeenOnBoot) return;

    const rafId = window.requestAnimationFrame(() => {
      setShowIntro(false);
      setLoaded(true);
      setIntroAnimationDone(true);
      setCriticalAssetsReady(true);
      setIntroTimeoutReached(true);
    });

    return () => {
      window.cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    if (!showIntro) {
      markIntroComplete();
    }
  }, [showIntro]);

  useEffect(() => {
    if (!showIntro) return;
    const timeoutId = window.setTimeout(() => {
      setIntroTimeoutReached(true);
    }, INTRO_MAX_WAIT_MS);
    return () => window.clearTimeout(timeoutId);
  }, [showIntro]);

  useEffect(() => {
    const section = whiteSectionRef.current;
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

    const smoothStep = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
    const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
    const faucetOpen = (t: number) => 1 - Math.pow(1 - clamp01(t), 4);
    const mapProgress = (value: number, start: number, end: number) =>
      faucetOpen(clamp01((value - start) / (end - start)));
    const thresholds = Array.from({ length: 21 }, (_, i) => i / 20);

    const observer = new IntersectionObserver(
      ([entry]) => {
        const ratio = Math.max(0, Math.min(1, entry?.intersectionRatio ?? 0));
        const eased = smoothStep(ratio);
        const blendProgress = mapProgress(eased, 0.3, 1);
        const titleProgress = mapProgress(eased, 0.3, 0.9);
        const copyProgress = mapProgress(eased, 0.4, 0.94);
        const actionsProgress = mapProgress(eased, 0.5, 1);
        section.style.setProperty("--cta-title-progress", `${titleProgress}`);
        section.style.setProperty("--cta-copy-progress", `${copyProgress}`);
        section.style.setProperty("--cta-actions-progress", `${actionsProgress}`);

        section.classList.toggle("is-visible", ratio > 0.03);

        body.style.setProperty("--bg-color", mix("#050505", "#e3e4e0", blendProgress));
        body.style.setProperty("--text-color", mix("#f2f2f2", "#0a0a0a", blendProgress));

        if (blendProgress > 0.62) {
          body.setAttribute("data-navbar-variant", "light");
        } else if (previousNavbarVariant === null) {
          body.removeAttribute("data-navbar-variant");
        } else {
          body.setAttribute("data-navbar-variant", previousNavbarVariant);
        }
      },
      { threshold: thresholds, rootMargin: "0px 0px -2% 0px" }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
      section.style.removeProperty("--cta-title-progress");
      section.style.removeProperty("--cta-copy-progress");
      section.style.removeProperty("--cta-actions-progress");
      section.classList.remove("is-visible");
      if (previousBgColor) body.style.setProperty("--bg-color", previousBgColor);
      else body.style.removeProperty("--bg-color");
      if (previousTextColor) body.style.setProperty("--text-color", previousTextColor);
      else body.style.removeProperty("--text-color");
      if (previousNavbarVariant === null) body.removeAttribute("data-navbar-variant");
      else body.setAttribute("data-navbar-variant", previousNavbarVariant);
    };
  }, []);

  const canCompleteIntro =
    introAnimationDone && (criticalAssetsReady || introTimeoutReached);

  const handleIntroAnimationComplete = useCallback(() => {
    setIntroAnimationDone(true);
  }, []);

  const handleIntroComplete = useCallback(() => {
    window.sessionStorage.setItem(INTRO_SEEN_KEY, "true");
    setShowIntro(false);
    setLoaded(true);
  }, []);

  return (
    <>
      <style>{`
        .mk-home-white-section {
          --cta-title-progress: 0;
          --cta-copy-progress: 0;
          --cta-actions-progress: 0;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: clamp(64px, 12vh, 120px) 24px;
        }

        .mk-home-white-content {
          max-width: 820px;
        }

        .mk-home-white-title {
          font-family: var(--font-cormorant), serif;
          font-size: clamp(2.1rem, 6vw, 4.3rem);
          font-weight: 500;
          letter-spacing: 0.03em;
          opacity: calc(0.1 + (var(--cta-title-progress) * 0.9));
          transform: translateY(calc((1 - var(--cta-title-progress)) * 30px)) scale(calc(0.985 + (var(--cta-title-progress) * 0.015)));
          filter: blur(calc((1 - var(--cta-title-progress)) * 8px));
          transition: opacity 1.8s cubic-bezier(0.19, 1, 0.22, 1), transform 1.8s cubic-bezier(0.19, 1, 0.22, 1), filter 1.6s cubic-bezier(0.19, 1, 0.22, 1);
        }

        .mk-home-white-sub {
          margin: 24px auto 0;
          max-width: 620px;
          font-size: clamp(0.95rem, 1.3vw, 1.1rem);
          line-height: 1.85;
          opacity: calc(var(--cta-copy-progress) * 0.74);
          transform: translateY(calc((1 - var(--cta-copy-progress)) * 22px));
          filter: blur(calc((1 - var(--cta-copy-progress)) * 6px));
          transition: opacity 2s cubic-bezier(0.19, 1, 0.22, 1), transform 2s cubic-bezier(0.19, 1, 0.22, 1), filter 1.7s cubic-bezier(0.19, 1, 0.22, 1);
        }

        .mk-home-white-actions {
          margin-top: 36px;
          display: flex;
          justify-content: center;
          gap: 14px;
          opacity: calc(var(--cta-actions-progress) * 0.98);
          transform: translateY(calc((1 - var(--cta-actions-progress)) * 16px));
          filter: blur(calc((1 - var(--cta-actions-progress)) * 4px));
          transition: opacity 2.2s cubic-bezier(0.19, 1, 0.22, 1), transform 2.2s cubic-bezier(0.19, 1, 0.22, 1), filter 1.7s cubic-bezier(0.19, 1, 0.22, 1);
        }

        .mk-home-white-actions a {
          border: 1px solid currentColor;
          border-radius: 999px;
          padding: 14px 30px;
          text-decoration: none;
          color: inherit;
          font-size: 0.75rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          transition: background-color 0.35s ease, color 0.35s ease, border-color 0.35s ease;
        }

        .mk-home-white-actions a:hover {
          background: #0a0a0a;
          color: #e3e4e0;
          border-color: #0a0a0a;
        }

        .mk-home-white-contact-row {
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

        .mk-home-white-contact-link {
          color: inherit;
          text-decoration: none;
          border-bottom: 1px solid rgba(10, 10, 10, 0.32);
          padding-bottom: 1px;
          transition: color 0.25s ease, border-color 0.25s ease;
        }

        .mk-home-white-contact-link:hover {
          color: #0a0a0a;
          border-color: rgba(10, 10, 10, 0.64);
        }

        .mk-home-white-socials {
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .mk-home-white-social-link {
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

        .mk-home-white-social-link svg {
          width: 16px;
          height: 16px;
          display: block;
        }

        .mk-home-white-social-link:hover {
          background: #0a0a0a;
          color: #e3e4e0;
          border-color: #0a0a0a;
        }

        .mk-home-white-section.is-visible .mk-home-white-title,
        .mk-home-white-section.is-visible .mk-home-white-sub,
        .mk-home-white-section.is-visible .mk-home-white-actions {
          will-change: opacity, transform, filter;
        }

        @media (max-width: 768px) {
          .mk-home-white-actions {
            flex-direction: column;
            align-items: center;
          }

          .mk-home-white-contact-row {
            flex-direction: column;
            gap: 10px;
          }
        }
      `}</style>
      {showIntro ? (
        <IntroLogoOverlay
          canComplete={canCompleteIntro}
          onAnimationComplete={handleIntroAnimationComplete}
          onComplete={handleIntroComplete}
        />
      ) : null}
      <main
        className={`w-full min-h-screen transition-opacity duration-700 ${loaded ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        style={{
          background: "var(--bg-color, #050505)",
          color: "var(--text-color, #f2f2f2)",
          transition:
            "background-color var(--page-blend-bg-duration, 1.8s) var(--page-blend-ease, cubic-bezier(0.22, 1, 0.36, 1)), color var(--page-blend-text-duration, 1.6s) var(--page-blend-ease, cubic-bezier(0.22, 1, 0.36, 1)), opacity 0.7s",
        }}
      >
        <HeroSection onReady={() => setCriticalAssetsReady(true)} />
        <ServicesAccordion titleScale="compact" />
        <ProjectsCarousel />
        <Testimonials />
        <Philosophy />
        <section ref={whiteSectionRef} className="mk-home-white-section">
          <div className="mk-home-white-content">
            <h2 className="mk-home-white-title">Let&apos;s Design Something Meaningful</h2>
            <p className="mk-home-white-sub">
              Whether you are building from the ground up or reimagining an existing space, Mayaakars offers a
              thoughtful, integrated approach to architecture and interior design.
            </p>
            <div className="mk-home-white-actions">
              <a href="/contact">Schedule a Consultation</a>
              <a href="/contact">Get in Touch</a>
            </div>
            <div className="mk-home-white-contact-row">
              <a className="mk-home-white-contact-link" href={`tel:${CONTACT_PHONE.replace(/\s+/g, "")}`}>
                {CONTACT_PHONE}
              </a>
              <a className="mk-home-white-contact-link" href={`mailto:${CONTACT_EMAIL}`}>
                {CONTACT_EMAIL}
              </a>
              <div className="mk-home-white-socials" aria-label="Social links">
                <a
                  className="mk-home-white-social-link"
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
                  className="mk-home-white-social-link"
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
          </div>
        </section>
      </main>
    </>
  );
}
