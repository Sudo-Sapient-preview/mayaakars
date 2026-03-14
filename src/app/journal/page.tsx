"use client";

import { useEffect, useRef } from "react";
import { useRouteTransition } from "@/components/navigation/RouteTransitionProvider";

export default function JournalPage() {
  const { navigate } = useRouteTransition();
  const whiteSectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const rows = Array.from(document.querySelectorAll<HTMLElement>(".grid-row"));

    const updateActiveCard = () => {
      let closestIndex = 0;
      let minDistance = Infinity;
      const triggerPoint = window.innerHeight / 2;

      rows.forEach((row, index) => {
        const rect = row.getBoundingClientRect();
        const rowCenter = rect.top + rect.height / 2;
        const distance = Math.abs(rowCenter - triggerPoint);
        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = index;
        }
      });

      rows.forEach((row, index) => {
        if (index === closestIndex) {
          row.classList.add("active");
        } else {
          row.classList.remove("active");
        }
      });
    };

    const animateCardText = (row: Element) => {
      if (!row.classList.contains("active")) return;

      row.querySelectorAll(".anim-element").forEach((el) => {
        [el.querySelector("h3"), el.querySelector("p"), el.querySelector(".badge")].forEach((item) => {
          if (item && !item.querySelector(".text-animate")) {
            const text = item.textContent || "";
            item.innerHTML = "";
            text.split("").forEach((char, i) => {
              const span = document.createElement("span");
              span.textContent = char;
              span.className = "text-animate preset-fade";
              span.style.animationDelay = `${i * 0.018}s`;
              item.appendChild(span);
            });
          }
        });
      });
    };

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateActiveCard();
          const activeRow = document.querySelector(".grid-row.active");
          if (activeRow) animateCardText(activeRow);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    updateActiveCard();
    const initialActive = document.querySelector(".grid-row.active");
    if (initialActive) animateCardText(initialActive);

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

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
          width: 30%;
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

        .mk-blog-page .grid-row.active .image-wrapper {
          width: 100%;
          box-shadow: 0 25px 70px rgba(0, 0, 0, 0.9);
        }

        .mk-blog-page .grid-row.active .image-wrapper img {
          filter: brightness(0.75);
        }

        .mk-blog-page .grid-row.active .image-wrapper:hover {
          transform: scale(1.02);
        }

        .mk-blog-page .grid-row.active .image-wrapper:hover img {
          transform: scale(1.05);
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
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.6s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.6s;
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

        .mk-blog-page .grid-row.active .anim-element {
          opacity: 1;
          visibility: visible;
          transform: translateY(-50%);
        }

        .mk-blog-page .grid-row.active .left-col .anim-element {
          transition-delay: 0.15s;
        }

        .mk-blog-page .grid-row.active .right-col .anim-element {
          transition-delay: 0.25s;
        }

        .mk-blog-page .text-animate {
          display: inline-block;
          white-space: pre;
        }

        @keyframes anim-fade {
          0% {
            opacity: 0;
            transform: translateY(15px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .mk-blog-page .preset-fade {
          animation: anim-fade 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) both;
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

          .mk-blog-page .grid-row.active .left-col .anim-element,
          .mk-blog-page .grid-row.active .right-col .anim-element,
          .mk-blog-page .grid-row.active .anim-element {
            transform: translateY(0);
          }

          .mk-blog-page .image-wrapper {
            width: 92%;
            aspect-ratio: 16/10;
          }

          .mk-blog-page .grid-row.active .image-wrapper {
            width: 100%;
          }

          .mk-blog-page .manual-white-actions {
            flex-direction: column;
            align-items: center;
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
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000&auto=format&fit=crop"
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
                  src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1000&auto=format&fit=crop"
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
                  src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1000&auto=format&fit=crop"
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
          </div>
        </section>
      </main>
    </>
  );
}
