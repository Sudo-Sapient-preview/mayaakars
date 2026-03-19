"use client";

import { useEffect, useRef } from "react";
import { useRouteTransition } from "@/components/navigation/RouteTransitionProvider";

const CONTACT_PHONE = "+91 97318 47847";
const CONTACT_EMAIL = "mail@ordientgroup.com";
const INSTAGRAM_URL = "https://www.instagram.com/mayaakars/";
const FACEBOOK_URL = "https://www.facebook.com/profile.php?id=100088682401205";

export default function JournalPage() {
  const { navigate } = useRouteTransition();
  const whiteSectionRef = useRef<HTMLElement>(null);

  // Text animations removed for a calmer, static journal layout.

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
    const thresholds = Array.from({ length: 301 }, (_, i) => i / 300);

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
        body.style.setProperty("--bg-color", mix("#050505", "#ffffff", blendProgress));
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

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Geist:wght@300;400;500;600&display=swap');

        :root {
          --bg: #050505;
          --gold: #c8a95c;
          --text: #f2f2f2;
          --muted: rgba(255, 255, 255, 0.92);
          --line-color: rgba(255, 255, 255, 0.1);
          --bg-color: #050505;
          --text-color: #f2f2f2;
        }

        .mk-blog-page {
          background: var(--bg-color);
          color: var(--text-color);
          font-family: 'Geist', sans-serif;
          overflow-x: hidden;
          -webkit-font-smoothing: antialiased;
          transition: background-color var(--page-blend-bg-duration, 1.8s) var(--page-blend-ease, cubic-bezier(0.22, 1, 0.36, 1)), color var(--page-blend-text-duration, 1.6s) var(--page-blend-ease, cubic-bezier(0.22, 1, 0.36, 1));
        }

        .mk-blog-page * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .mk-blog-page .fixed-line {
          position: fixed;
          top: 0;
          bottom: 0;
          left: 50%;
          width: 1px;
          background-color: var(--line-color);
          transform: translateX(-50%);
          z-index: 1;
        }

        .mk-blog-page header {
          position: relative;
          z-index: 10;
          text-align: center;
          padding: 20vh 20px 15vh;
        }

        .mk-blog-page .header-label {
          font-size: 0.75rem;
          letter-spacing: 4px;
          margin-bottom: 25px;
          display: block;
          text-transform: uppercase;
          color: var(--gold);
          font-weight: 600;
        }

        .mk-blog-page header h1 {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.5rem, 6vw, 5rem);
          font-weight: 400;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          line-height: 1.2;
        }

        .mk-blog-page header .tagline {
          font-size: 1.1rem;
          color: var(--muted);
          margin-top: 20px;
          font-weight: 400;
          letter-spacing: 0.13em;
        }

        .mk-blog-page .scroll-container {
          position: relative;
          z-index: 10;
          padding-bottom: 0;
        }

        .mk-blog-page .grid-row {
          display: grid;
          grid-template-columns: 1fr min(600px, 85vw) 1fr;
          gap: 30px;
          margin-bottom: 90px;
          position: relative;
        }

        .mk-blog-page .center-col {
          width: 100%;
          display: flex;
          justify-content: center;
          position: relative;
          z-index: 5;
        }

        .mk-blog-page .image-wrapper {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 10;
          overflow: hidden;
          border-radius: 14px;
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.6);
          transition: width 1.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1),
            box-shadow 0.9s ease;
          cursor: pointer;
        }

        .mk-blog-page .image-wrapper img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: brightness(0.35);
          transition: filter 1.2s ease, transform 1s ease;
        }

        .mk-blog-page .read-more-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, transparent 55%);
          display: flex;
          align-items: flex-end;
          justify-content: center;
          padding-bottom: 28px;
          opacity: 0;
          transition: opacity 0.4s ease;
          z-index: 2;
        }

        .mk-blog-page .read-more-overlay span {
          color: var(--gold);
          font-size: 0.7rem;
          letter-spacing: 4px;
          text-transform: uppercase;
          font-weight: 600;
          border-bottom: 1px solid var(--gold);
          padding-bottom: 4px;
          transition: letter-spacing 0.35s ease;
        }

        .mk-blog-page .image-wrapper:hover .read-more-overlay {
          opacity: 1;
        }

        .mk-blog-page .image-wrapper:hover .read-more-overlay span {
          letter-spacing: 7px;
        }

        .mk-blog-page .grid-row:not(.active) .image-wrapper:hover {
          transform: scale(1.05);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.7);
        }

        .mk-blog-page .image-wrapper {
          box-shadow: 0 25px 70px rgba(0, 0, 0, 0.85);
        }

        .mk-blog-page .left-col,
        .mk-blog-page .right-col {
          position: relative;
          height: 100%;
          display: flex;
          align-items: center;
        }

        .mk-blog-page .anim-element {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          opacity: 1;
          visibility: visible;
        }

        .mk-blog-page .left-col .anim-element {
          right: 40px;
          width: 320px;
          text-align: right;
          transform: translateY(-30%);
        }

        .mk-blog-page .right-col .anim-element {
          left: 40px;
          width: 320px;
          text-align: left;
          transform: translateY(-30%);
        }

        .mk-blog-page .badge {
          display: inline-block;
          border: 1px solid var(--gold);
          border-radius: 50px;
          padding: 6px 18px;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: var(--gold);
          margin-bottom: 15px;
          font-weight: 600;
        }

        .mk-blog-page .anim-element h3 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.75rem;
          font-weight: 500;
          margin-bottom: 14px;
          text-transform: uppercase;
          letter-spacing: 1px;
          line-height: 1.35;
          color: #ffffff;
        }

        .mk-blog-page .anim-element p {
          font-size: 1rem;
          color: var(--muted);
          line-height: 2;
          font-weight: 400;
        }

        .mk-blog-page .text-animate,
        .mk-blog-page .preset-fade {
          animation: none;
        }

        .mk-blog-page .browse-all {
          display: flex;
          justify-content: center;
          padding: 6vh 20px 5vh;
        }

        .mk-blog-page .browse-btn {
          display: inline-block;
          padding: 16px 48px;
          border: 1px solid var(--gold);
          border-radius: 50px;
          color: var(--gold);
          text-decoration: none;
          font-size: 0.75rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          font-weight: 600;
          transition: background 0.4s ease, color 0.4s ease;
        }

        .mk-blog-page .browse-btn:hover {
          background: var(--gold);
          color: #050505;
        }

        .mk-blog-page .manual-white-section {
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

        .mk-blog-page .manual-white-content {
          max-width: 820px;
        }

        .mk-blog-page .manual-white-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.1rem, 6vw, 4.3rem);
          font-weight: 500;
          letter-spacing: 0.03em;
          opacity: calc(0.1 + (var(--cta-title-progress) * 0.9));
          transform: translateY(calc((1 - var(--cta-title-progress)) * 30px)) scale(calc(0.985 + (var(--cta-title-progress) * 0.015)));
          filter: blur(calc((1 - var(--cta-title-progress)) * 8px));
          transition: opacity 1.8s cubic-bezier(0.19, 1, 0.22, 1), transform 1.8s cubic-bezier(0.19, 1, 0.22, 1), filter 1.6s cubic-bezier(0.19, 1, 0.22, 1);
        }

        .mk-blog-page .manual-white-sub {
          margin: 24px auto 0;
          max-width: 620px;
          font-size: clamp(0.95rem, 1.3vw, 1.1rem);
          line-height: 1.85;
          opacity: calc(var(--cta-copy-progress) * 0.74);
          transform: translateY(calc((1 - var(--cta-copy-progress)) * 22px));
          filter: blur(calc((1 - var(--cta-copy-progress)) * 6px));
          transition: opacity 2s cubic-bezier(0.19, 1, 0.22, 1), transform 2s cubic-bezier(0.19, 1, 0.22, 1), filter 1.7s cubic-bezier(0.19, 1, 0.22, 1);
        }

        .mk-blog-page .manual-white-actions {
          margin-top: 36px;
          display: flex;
          justify-content: center;
          gap: 14px;
          opacity: calc(var(--cta-actions-progress) * 0.98);
          transform: translateY(calc((1 - var(--cta-actions-progress)) * 16px));
          filter: blur(calc((1 - var(--cta-actions-progress)) * 4px));
          transition: opacity 2.2s cubic-bezier(0.19, 1, 0.22, 1), transform 2.2s cubic-bezier(0.19, 1, 0.22, 1), filter 1.7s cubic-bezier(0.19, 1, 0.22, 1);
        }

        .mk-blog-page .manual-white-actions a {
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

        .mk-blog-page .manual-white-actions a:hover {
          background: #0a0a0a;
          color: #e3e4e0;
          border-color: #0a0a0a;
        }

        .mk-blog-page .manual-white-contact-row {
          margin-top: 26px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          gap: 12px 18px;
          font-family: 'Geist', sans-serif;
          font-size: 0.92rem;
          color: rgba(10, 10, 10, 0.72);
          opacity: calc(var(--cta-actions-progress) * 0.98);
          transform: translateY(calc((1 - var(--cta-actions-progress)) * 12px));
          transition: opacity 2.2s cubic-bezier(0.19, 1, 0.22, 1), transform 2.2s cubic-bezier(0.19, 1, 0.22, 1);
        }

        .mk-blog-page .manual-white-contact-link {
          color: inherit;
          text-decoration: none;
          border-bottom: 1px solid rgba(10, 10, 10, 0.32);
          padding-bottom: 1px;
          transition: color 0.25s ease, border-color 0.25s ease;
        }

        .mk-blog-page .manual-white-contact-link:hover {
          color: #0a0a0a;
          border-color: rgba(10, 10, 10, 0.64);
        }

        .mk-blog-page .manual-white-socials {
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .mk-blog-page .manual-white-social-link {
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

        .mk-blog-page .manual-white-social-link svg {
          width: 16px;
          height: 16px;
          display: block;
        }

        .mk-blog-page .manual-white-social-link:hover {
          background: #0a0a0a;
          color: #e3e4e0;
          border-color: #0a0a0a;
        }

        .mk-blog-page .manual-white-section.is-visible .manual-white-title,
        .mk-blog-page .manual-white-section.is-visible .manual-white-sub,
        .mk-blog-page .manual-white-section.is-visible .manual-white-actions {
          will-change: opacity, transform, filter;
        }

        @media (max-width: 900px) {
          .mk-blog-page .fixed-line {
            display: none;
          }

          .mk-blog-page .grid-row {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-bottom: 80px;
            gap: 0;
          }

          .mk-blog-page .center-col {
            order: 1;
            width: 100%;
            padding: 0 20px;
            margin-bottom: 32px;
          }

          .mk-blog-page .left-col {
            order: 2;
            width: 100%;
            height: auto;
            padding: 0 28px;
            justify-content: center;
            margin-bottom: 4px;
          }

          .mk-blog-page .right-col {
            order: 3;
            width: 100%;
            height: auto;
            padding: 0 28px;
            justify-content: center;
          }

          .mk-blog-page .left-col .anim-element,
          .mk-blog-page .right-col .anim-element {
            position: relative;
            top: auto;
            right: auto;
            left: auto;
            width: 100% !important;
            text-align: center;
            transform: translateY(16px);
            margin-bottom: 16px;
          }

          .mk-blog-page .image-wrapper {
            width: 92%;
            aspect-ratio: 16/10;
          }

          .mk-blog-page .manual-white-actions {
            flex-direction: column;
            align-items: center;
          }

          .mk-blog-page .manual-white-contact-row {
            flex-direction: column;
            gap: 10px;
          }
        }
      `}</style>

      <main className="mk-blog-page">
        <div className="fixed-line" />

        <header>
          <span className="header-label">The Journal</span>
          <h1>Stories &amp; Spaces</h1>
          <p className="tagline">Perspectives on Architecture &amp; Interior Design</p>
        </header>

        <div className="scroll-container">
          {/* Post 1 — How Interior Design Shapes the Way We Live */}
          <div className="grid-row">
            <div className="left-col">
              <div className="anim-element">
                <div className="badge">Interior Design</div>
                <h3>How Interior Design Shapes the Way We Live</h3>
              </div>
            </div>
            <div className="center-col">
              <div className="image-wrapper" onClick={() => navigate("/blog/article_template?id=how-interior-design-shapes-the-way-we-live")}>
                <img
                  src="/Mayaakars/interior-residencial/panorama-house/living-room.webp"
                  alt="Interior Design"
                />
                <div className="read-more-overlay">
                  <span>Read More</span>
                </div>
              </div>
            </div>
            <div className="right-col">
              <div className="anim-element">
                <h3>Function, Form &amp; Emotion</h3>
                <p>
                  Every element — from spatial planning to lighting and materials — plays a role in shaping
                  the atmosphere of a home. When carefully considered, the result is a space that feels
                  intuitive, comfortable, and timeless.
                </p>
              </div>
            </div>
          </div>

          {/* Post 2 — The Importance of Thoughtful Architecture in Modern Homes */}
          <div className="grid-row">
            <div className="left-col">
              <div className="anim-element">
                <h3>Site, Structure &amp; Identity</h3>
                <p>
                  Thoughtful architecture begins with understanding the site — orientation, climate, and
                  natural light all influence how a building should be designed, creating homes that feel
                  naturally integrated with their surroundings.
                </p>
              </div>
            </div>
            <div className="center-col">
              <div className="image-wrapper" onClick={() => navigate("/blog/article_template?id=thoughtful-architecture-in-modern-homes")}>
                <img
                  src="/Mayaakars/architect-residence/panorama-house/title-photo.webp"
                  alt="Modern Architecture"
                />
                <div className="read-more-overlay">
                  <span>Read More</span>
                </div>
              </div>
            </div>
            <div className="right-col">
              <div className="anim-element">
                <div className="badge">Architecture</div>
                <h3>Thoughtful Architecture in Modern Homes</h3>
              </div>
            </div>
          </div>

          {/* Post 3 — The Role of Lighting in Interior Design */}
          <div className="grid-row">
            <div className="left-col">
              <div className="anim-element">
                <div className="badge">Lighting</div>
                <h3>The Role of Lighting in Interior Design</h3>
              </div>
            </div>
            <div className="center-col">
              <div className="image-wrapper" onClick={() => navigate("/blog/article_template?id=the-role-of-lighting-in-interior-design")}>
                <img
                  src="/Mayaakars/interior-commercial/shizuka-nook/chandelier.webp"
                  alt="Lighting Design"
                />
                <div className="read-more-overlay">
                  <span>Read More</span>
                </div>
              </div>
            </div>
            <div className="right-col">
              <div className="anim-element">
                <h3>Layers of Light</h3>
                <p>
                  Effective lighting design is about creating layers — ambient, task, and accent — that
                  support both functionality and atmosphere. Warm light invites warmth; natural light
                  connects interior to the world outside.
                </p>
              </div>
            </div>
          </div>
        </div>
        <section ref={whiteSectionRef} className="manual-white-section">
          <div className="manual-white-content">
            <h2 className="manual-white-title">Let&apos;s Design Something Meaningful</h2>
            <p className="manual-white-sub">
              Whether you are building from the ground up or reimagining an existing space, Mayaakars offers a
              thoughtful, integrated approach to architecture and interior design.
            </p>
            <div className="manual-white-actions">
              <a href="/contact">Schedule a Consultation</a>
              <a href="/contact">Get in Touch</a>
            </div>
            <div className="manual-white-contact-row">
              <a className="manual-white-contact-link" href={`tel:${CONTACT_PHONE.replace(/\s+/g, "")}`}>
                {CONTACT_PHONE}
              </a>
              <a className="manual-white-contact-link" href={`mailto:${CONTACT_EMAIL}`}>
                {CONTACT_EMAIL}
              </a>
              <div className="manual-white-socials" aria-label="Social links">
                <a
                  className="manual-white-social-link"
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
                  className="manual-white-social-link"
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
