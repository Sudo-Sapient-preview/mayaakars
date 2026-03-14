"use client";

import { type CSSProperties, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const TEAM_ITEMS = [
  { name: "Silent Arc", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000" },
  { name: "Bloom24", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000" },
  { name: "Glass Fade", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1000" },
  { name: "Echo 9", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1000" },
  { name: "Velvet Loop", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1000" },
  { name: "Field Two", img: "https://images.unsplash.com/photo-1463453091185-61582044d556?q=80&w=1000" },
  { name: "Pale Thread", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000" },
  { name: "Stillroom", img: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?q=80&w=1000" },
  { name: "Ghostline", img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1000" },
  { name: "Mono 73", img: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1000" },
];

function AnimatedParagraph({ text, className }: { text: string; className?: string }) {
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const words = text.split(" ");

  useEffect(() => {
    const paragraph = paragraphRef.current;
    if (!paragraph) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      const inkNodes = paragraph.querySelectorAll<HTMLElement>(".mk-word-ink");
      inkNodes.forEach((node) => {
        node.style.opacity = "1";
        node.style.transform = "translateY(0)";
        node.style.filter = "blur(0)";
      });
      return;
    }

    const inkNodes = Array.from(paragraph.querySelectorAll<HTMLElement>(".mk-word-ink"));
    const total = inkNodes.length;
    let rafId = 0;

    const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

    const update = () => {
      const rect = paragraph.getBoundingClientRect();
      const vh = window.innerHeight;

      // Match texts_3 behavior: progress moves from 0 when paragraph top is at 80% viewport
      // to 1 when paragraph top reaches 25% viewport.
      const progress = clamp01((vh * 0.8 - rect.top) / (vh * 0.55));

      inkNodes.forEach((node, index) => {
        const start = index / total;
        const end = (index + 1) / total;
        const wordProgress = clamp01((progress - start) / (end - start));
        const readableOpacity = 0.2 + wordProgress * 0.8;
        node.style.opacity = `${readableOpacity}`;
        node.style.transform = `translateY(${(1 - wordProgress) * 6}px)`;
        node.style.filter = `blur(${(1 - wordProgress) * 2}px)`;
      });
    };

    const scheduleUpdate = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = 0;
        update();
      });
    };

    update();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <p ref={paragraphRef} className={`mk-word-reveal ${className ?? ""}`.trim()}>
      {words.map((word, index) => (
        <span
          key={`${word}-${index}`}
          className="mk-word"
          style={{ "--word-delay": `${index * 0.07}s` } as CSSProperties}
        >
          <span className="mk-word-shadow">{word}</span>
          <span className="mk-word-ink">{word}</span>
        </span>
      ))}
    </p>
  );
}

export default function AboutPage() {
  const pageRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const heroCenterRef = useRef<HTMLDivElement>(null);
  const geoMotifRef = useRef<HTMLDivElement>(null);
  const textureCanvasRef = useRef<HTMLCanvasElement>(null);
  const aboutContentRef = useRef<HTMLElement>(null);
  const spotlightRef = useRef<HTMLElement>(null);
  const whiteSectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    const heroCenter = heroCenterRef.current;
    const geoMotif = geoMotifRef.current;
    const canvas = textureCanvasRef.current;
    if (!hero || !heroCenter || !geoMotif || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isMobile = window.matchMedia("(max-width: 600px)").matches;
    const onHeroMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;

      heroCenter.style.transform = `translate(calc(-50% + ${x * 22}px), calc(-50% + ${y * 22}px)) rotateX(${
        -y * 12
      }deg) rotateY(${x * 12}deg)`;
      geoMotif.style.transform = `translate(calc(-50% + ${x * 14}px), calc(-50% + ${y * 14}px)) rotateX(${-
        y * 6}deg) rotateY(${x * 6}deg)`;
    };
    const onHeroLeave = () => {
      heroCenter.style.transform = "translate(-50%, -50%)";
      geoMotif.style.transform = "translate(-50%, -50%)";
    };

    if (!isMobile) {
      hero.addEventListener("mousemove", onHeroMove);
      hero.addEventListener("mouseleave", onHeroLeave);
    }

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll(".about-reveal").forEach((el) => revealObserver.observe(el));

    let canvasRaf = 0;
    let time = 0;
    const spacing = 45;
    const GOLD = "212, 175, 55";
    const WHITE = "255, 255, 255";

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const drawTexture = () => {
      ctx.fillStyle = "#050505";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cols = Math.ceil(canvas.width / spacing) + 2;
      const rows = Math.ceil(canvas.height / spacing) + 2;

      for (let i = 0; i < cols; i += 1) {
        for (let j = 0; j < rows; j += 1) {
          const moveX = Math.sin(time * 0.9 + i * 0.5 + j * 0.5) * 12;
          const moveY = Math.cos(time * 0.9 + i * 0.5 + j * 0.5) * 12;
          const x = i * spacing + moveX;
          const y = j * spacing + moveY;

          const alpha = (Math.sin(time * 0.5 + (i + j) * 0.3) + 1) / 2;
          const finalAlpha = 0.1 + alpha * 0.3;

          ctx.beginPath();
          ctx.arc(x, y, 0.7, 0, Math.PI * 2);

          if ((i + j) % 7 === 0) {
            ctx.fillStyle = `rgba(${GOLD}, ${finalAlpha + 0.2})`;
          } else {
            ctx.fillStyle = `rgba(${WHITE}, ${finalAlpha})`;
          }

          ctx.fill();
        }
      }

      time += 0.005;
      canvasRaf = window.requestAnimationFrame(drawTexture);
    };

    drawTexture();

    return () => {
      if (!isMobile) {
        hero.removeEventListener("mousemove", onHeroMove);
        hero.removeEventListener("mouseleave", onHeroLeave);
      }
      revealObserver.disconnect();
      window.removeEventListener("resize", resizeCanvas);
      window.cancelAnimationFrame(canvasRaf);
    };
  }, []);

  useEffect(() => {
    const spotlight = spotlightRef.current;
    if (!spotlight) return;

    gsap.registerPlugin(ScrollTrigger);

    const introTextElements = spotlight.querySelectorAll<HTMLElement>(".spotlight-intro-text");
    const bgWrapper = spotlight.querySelector<HTMLElement>(".spotlight-bg-img");
    const bgImg = spotlight.querySelector<HTMLImageElement>(".spotlight-bg-img img");
    const titlesContainer = spotlight.querySelector<HTMLElement>(".spotlight-titles");
    const titlesContainerElement = spotlight.querySelector<HTMLElement>(".spotlight-titles-container");
    const titleElements = spotlight.querySelectorAll<HTMLElement>(".spotlight-title");
    const imageElements = spotlight.querySelectorAll<HTMLElement>(".spotlight-img");
    const spotlightHeader = spotlight.querySelector<HTMLElement>(".spotlight-header");
    const journeyIntro = spotlight.querySelector<HTMLElement>(".spotlight-journey");

    if (
      !bgWrapper ||
      !bgImg ||
      !titlesContainer ||
      !titlesContainerElement ||
      !spotlightHeader
    ) {
      return;
    }

    const config = { gap: 0.08, speed: 0.3, arcRadius: 500 };
    let currentActiveIndex = 0;

    const calculateArcMetrics = () => {
      const isSmallScreen = window.innerWidth <= 768;
      const containerWidth = window.innerWidth * (isSmallScreen ? 0.55 : 0.3);
      const containerHeight = window.innerHeight;
      const arcStartX = containerWidth - (isSmallScreen ? 140 : 220);
      const arcStartY = -200;
      const arcEndY = containerHeight + 200;
      const arcControlPointX = arcStartX + (isSmallScreen ? config.arcRadius * 0.45 : config.arcRadius);
      const arcControlPointY = containerHeight / 2;

      return { arcStartX, arcStartY, arcEndY, arcControlPointX, arcControlPointY };
    };

    let arcMetrics = calculateArcMetrics();

    const getBezierPosition = (t: number) => {
      const x =
        (1 - t) * (1 - t) * arcMetrics.arcStartX +
        2 * (1 - t) * t * arcMetrics.arcControlPointX +
        t * t * arcMetrics.arcStartX;
      const y =
        (1 - t) * (1 - t) * arcMetrics.arcStartY +
        2 * (1 - t) * t * arcMetrics.arcControlPointY +
        t * t * arcMetrics.arcEndY;
      return { x, y };
    };

    const getImgProgressState = (index: number, overallProgress: number) => {
      const startTime = index * config.gap;
      const endTime = startTime + config.speed;
      if (overallProgress < startTime) return -1;
      if (overallProgress > endTime) return 2;
      return (overallProgress - startTime) / config.speed;
    };

    imageElements.forEach((img) => gsap.set(img, { opacity: 0 }));

    const trigger = ScrollTrigger.create({
      trigger: spotlight,
      start: "top top",
      end: () => `+=${window.innerHeight * 10}px`,
      pin: true,
      pinSpacing: true,
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;

        if (progress <= 0.2) {
          const animationProgress = progress / 0.2;
          const moveDistance = window.innerWidth * 0.6;

          if (introTextElements[0]) {
            gsap.set(introTextElements[0], { x: -animationProgress * moveDistance, opacity: 1 });
          }
          if (introTextElements[1]) {
            gsap.set(introTextElements[1], { x: animationProgress * moveDistance, opacity: 1 });
          }
          gsap.set(bgWrapper, { scale: animationProgress });
          gsap.set(bgImg, { scale: 1.5 - animationProgress * 0.5 });
          imageElements.forEach((img) => gsap.set(img, { opacity: 0 }));
          gsap.set(spotlightHeader, { opacity: 0 });
          gsap.set(titlesContainerElement, { "--before-opacity": "0", "--after-opacity": "0" });
          if (journeyIntro) {
            gsap.set(journeyIntro, {
              opacity: Math.max(0, 1 - animationProgress * 1.4),
              y: animationProgress * 30,
            });
          }
        } else if (progress > 0.2 && progress <= 0.25) {
          gsap.set(bgWrapper, { scale: 1 });
          gsap.set(bgImg, { scale: 1 });
          if (introTextElements[0]) {
            gsap.set(introTextElements[0], { opacity: 0 });
          }
          if (introTextElements[1]) {
            gsap.set(introTextElements[1], { opacity: 0 });
          }
          imageElements.forEach((img) => gsap.set(img, { opacity: 0 }));
          gsap.set(spotlightHeader, { opacity: 1 });
          gsap.set(titlesContainerElement, { "--before-opacity": "1", "--after-opacity": "1" });
          if (journeyIntro) {
            gsap.set(journeyIntro, { opacity: 0, y: 36 });
          }
        } else if (progress > 0.25 && progress <= 0.95) {
          gsap.set(spotlightHeader, { opacity: 1 });
          gsap.set(titlesContainerElement, { "--before-opacity": "1", "--after-opacity": "1" });
          if (journeyIntro) {
            gsap.set(journeyIntro, { opacity: 0, y: 36 });
          }

          const switchProgress = (progress - 0.25) / 0.7;
          const viewportHeight = window.innerHeight;
          const titlesHeight = titlesContainer.scrollHeight;
          const currentY = viewportHeight - switchProgress * (viewportHeight + titlesHeight);
          gsap.set(titlesContainer, { transform: `translateY(${currentY}px)` });

          imageElements.forEach((img, index) => {
            const imgProgress = getImgProgressState(index, switchProgress);
            if (imgProgress < 0 || imgProgress > 1) {
              gsap.set(img, { opacity: 0 });
            } else {
              const pos = getBezierPosition(imgProgress);
              gsap.set(img, { x: pos.x - 100, y: pos.y - 75, opacity: 1 });
            }
          });

          const viewportMiddle = viewportHeight / 2;
          let closestIndex = 0;
          let closestDistance = Infinity;
          titleElements.forEach((title, index) => {
            const titleRect = title.getBoundingClientRect();
            const dist = Math.abs(titleRect.top + titleRect.height / 2 - viewportMiddle);
            if (dist < closestDistance) {
              closestDistance = dist;
              closestIndex = index;
            }
          });

          if (closestIndex !== currentActiveIndex) {
            titleElements[currentActiveIndex].style.opacity = "0.25";
            titleElements[closestIndex].style.opacity = "1";
            bgImg.src = TEAM_ITEMS[closestIndex].img;
            currentActiveIndex = closestIndex;
          }
        } else {
          gsap.set(spotlightHeader, { opacity: 0 });
          gsap.set(titlesContainerElement, { "--before-opacity": "0", "--after-opacity": "0" });
          if (journeyIntro) {
            gsap.set(journeyIntro, { opacity: 0, y: 36 });
          }
        }
      },
    });

    const onResize = () => {
      arcMetrics = calculateArcMetrics();
      ScrollTrigger.refresh();
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      trigger.kill();
      gsap.killTweensOf([bgWrapper, bgImg, titlesContainer, titlesContainerElement, spotlightHeader, journeyIntro]);
      imageElements.forEach((img) => gsap.killTweensOf(img));
      ScrollTrigger.refresh();
    };
  }, []);

  useEffect(() => {
    const page = pageRef.current;
    const section = whiteSectionRef.current;
    const canvas = textureCanvasRef.current;
    if (!section || !page) return;

    const body = document.body;
    const previousNavbarVariant = body.getAttribute("data-navbar-variant");
    const previousBgColor = page.style.getPropertyValue("--bg-color");
    const previousTextColor = page.style.getPropertyValue("--text-color");
    const previousCanvasOpacity = canvas?.style.opacity ?? "";

    // Ensure page starts with visible text even if body variables were altered by another route.
    page.style.setProperty("--bg-color", "#050505");
    page.style.setProperty("--text-color", "#f2f2f2");

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
        page.style.setProperty("--bg-color", mix("#050505", "#ffffff", blendProgress));
        page.style.setProperty("--text-color", mix("#f2f2f2", "#0a0a0a", blendProgress));
        if (canvas) {
          const textureOpacity = Math.max(0, 0.9 * (1 - blendProgress * 1.5));
          canvas.style.opacity = `${textureOpacity}`;
        }

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
      if (canvas) canvas.style.opacity = previousCanvasOpacity;
      if (previousBgColor) page.style.setProperty("--bg-color", previousBgColor);
      else page.style.removeProperty("--bg-color");
      if (previousTextColor) page.style.setProperty("--text-color", previousTextColor);
      else page.style.removeProperty("--text-color");
      if (previousNavbarVariant === null) body.removeAttribute("data-navbar-variant");
      else body.setAttribute("data-navbar-variant", previousNavbarVariant);
    };
  }, []);

  return (
    <>
      <style>{`
        :root {
          --mk-bg: #050505;
          --mk-gold: #c8a95c;
          --mk-text: #eaeaea;
          --mk-muted: rgba(255, 255, 255, 0.72);
          --mk-border: rgba(200, 169, 92, 0.2);
        }

        .mk-about-page {
          position: relative;
          background: var(--bg-color, var(--mk-bg));
          color: var(--text-color, var(--mk-text));
          overflow-x: hidden;
          font-family: "Geist", sans-serif;
          transition: background-color var(--page-blend-bg-duration, 1.8s) var(--page-blend-ease, cubic-bezier(0.22, 1, 0.36, 1)), color var(--page-blend-text-duration, 1.6s) var(--page-blend-ease, cubic-bezier(0.22, 1, 0.36, 1));
        }

        .mk-about-page * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .mk-about-page .texture-canvas {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: 0;
          pointer-events: none;
          filter: blur(0.25px);
          opacity: 0.9;
        }

        .mk-about-page > *:not(.texture-canvas) {
          position: relative;
          z-index: 1;
        }

        .mk-about-page .hero {
          position: relative;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
          perspective: 1400px;
        }

        .mk-about-page .hero::after {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at center, transparent 38%, rgba(0, 0, 0, 0.8) 100%);
          pointer-events: none;
          z-index: 3;
        }

        .mk-about-page .geo-motif {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 380px;
          height: 380px;
          transform: translate(-50%, -50%);
          pointer-events: none;
          z-index: 4;
          transition: transform 0.9s cubic-bezier(0.2, 0.8, 0.2, 1);
          opacity: 0.18;
        }

        .mk-about-page .geo-motif svg {
          width: 100%;
          height: 100%;
          animation: mkGeoSpin 60s linear infinite;
        }

        @keyframes mkGeoSpin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .mk-about-page .hero-center {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: min(940px, calc(100vw - 3rem));
          z-index: 5;
          pointer-events: none;
          text-align: center;
          transition: transform 0.9s cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        .mk-about-page .hero-eyebrow {
          display: block;
          font-size: clamp(0.72rem, 0.95vw, 0.9rem);
          font-weight: 500;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(200, 169, 92, 0.86);
          margin-bottom: 18px;
        }

        .mk-about-page .hero-tagline {
          display: block;
          font-family: "Cormorant Garamond", serif;
          font-size: clamp(2.5rem, 7vw, 5.1rem);
          font-weight: 500;
          letter-spacing: 0.01em;
          line-height: 1.08;
          color: var(--mk-text);
          text-shadow: 0 20px 60px rgba(0, 0, 0, 0.9);
          text-wrap: balance;
        }

        .mk-about-page .hero-tagline em {
          font-style: italic;
          color: rgba(200, 169, 92, 0.85);
        }

        .mk-about-page .hero-sub {
          display: block;
          max-width: 760px;
          margin: 22px auto 0;
          font-size: clamp(0.88rem, 1.25vw, 1.05rem);
          font-weight: 400;
          letter-spacing: 0.09em;
          line-height: 1.75;
          text-transform: none;
          color: rgba(255, 255, 255, 0.72);
        }

        .mk-about-page .about-page {
          background: transparent;
          padding: 140px 0 120px;
        }

        .mk-about-page .about-inner {
          max-width: 1120px;
          margin: 0 auto;
          padding: 0 60px;
        }

        .mk-about-page .reveal {
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 0.9s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.9s cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        .mk-about-page .reveal.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .mk-about-page .intro-block {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: start;
          margin-bottom: 120px;
          padding-bottom: 100px;
          border-bottom: 1px solid var(--mk-border);
        }

        .mk-about-page .intro-left .overline,
        .mk-about-page .content-block .overline,
        .mk-about-page .content-split-left .overline {
          display: block;
          font-family: "Cormorant Garamond", serif;
          font-size: 0.84rem;
          font-weight: 500;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: rgba(200, 169, 92, 0.9);
          margin-bottom: 22px;
        }

        .mk-about-page .intro-left h2 {
          font-family: "Cormorant Garamond", serif;
          font-size: clamp(2.35rem, 4.2vw, 3.9rem);
          font-weight: 300;
          line-height: 1.3;
          color: var(--mk-text);
          margin-bottom: 0;
        }

        .mk-about-page .intro-left h2 em {
          font-style: italic;
          color: rgba(200, 169, 92, 0.8);
        }

        .mk-about-page .intro-right {
          padding-top: 8px;
        }

        .mk-about-page .intro-right p,
        .mk-about-page .content-block p,
        .mk-about-page .content-split-right p {
          font-size: clamp(1.08rem, 1.18vw, 1.24rem);
          font-weight: 300;
          line-height: 1.92;
          color: var(--mk-muted);
          margin-bottom: 30px;
        }

        .mk-about-page .mk-word {
          position: relative;
          display: inline-block;
          margin-right: 0.34ch;
        }

        .mk-about-page .mk-word-shadow {
          position: absolute;
          inset: 0;
          opacity: 0.46;
        }

        .mk-about-page .mk-word-ink {
          opacity: 0;
          transform: translateY(0);
          filter: blur(0);
          transition: opacity 0.18s linear, transform 0.18s linear, filter 0.18s linear;
        }

        .mk-about-page .single-col {
          max-width: 920px;
          margin-inline: auto;
        }

        .mk-about-page .two-col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
        }

        .mk-about-page .content-split {
          display: grid;
          grid-template-columns: minmax(280px, 0.9fr) minmax(0, 1.25fr);
          gap: clamp(48px, 7vw, 110px);
          align-items: start;
          margin-bottom: 120px;
          padding-bottom: 100px;
          border-bottom: 1px solid var(--mk-border);
        }

        .mk-about-page .content-split:last-of-type {
          margin-bottom: 0;
          padding-bottom: 0;
          border-bottom: 0;
        }

        .mk-about-page .two-col > :only-child {
          grid-column: 1 / -1;
          max-width: 72ch;
          margin-inline: auto;
        }

        .mk-about-page .content-block h3,
        .mk-about-page .content-split-left h3 {
          font-family: "Cormorant Garamond", serif;
          font-size: clamp(1.95rem, 2.9vw, 3rem);
          font-weight: 400;
          line-height: 1.24;
          color: var(--mk-text);
          margin-bottom: 30px;
        }

        .mk-about-page .about-page .content-block {
          max-width: 66ch;
        }

        .mk-about-page .spotlight {
          position: relative;
          width: 100vw;
          height: 100dvh;
          overflow: hidden;
        }

        .mk-about-page .spotlight-intro-stack {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: min(860px, calc(100vw - 2rem));
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 28px;
          z-index: 6;
          pointer-events: none;
        }

        .mk-about-page .spotlight-intro-text-wrapper {
          position: relative;
          width: 100%;
          top: auto;
          transform: none;
          display: flex;
          gap: 0.5rem;
          padding: 0;
          z-index: 1;
          justify-content: center;
        }

        .mk-about-page .spotlight-intro-text {
          flex: 0 0 auto;
          position: relative;
          will-change: transform;
        }

        .mk-about-page .spotlight-intro-text:nth-child(1) {
          display: flex;
          justify-content: flex-end;
        }

        .mk-about-page .spotlight-intro-text p {
          font-size: clamp(1.35rem, 4vw, 2.35rem);
          font-weight: 600;
          letter-spacing: 0.01em;
          line-height: 1;
        }

        .mk-about-page .spotlight-journey {
          position: relative;
          left: auto;
          top: auto;
          transform: none;
          width: 100%;
          text-align: center;
          z-index: 1;
          pointer-events: none;
          will-change: transform, opacity;
        }

        .mk-about-page .spotlight-journey h3 {
          font-family: "Cormorant Garamond", serif;
          font-size: clamp(1.6rem, 3.2vw, 2.4rem);
          font-weight: 500;
          line-height: 1.2;
          color: #f3f3f3;
          margin-bottom: 12px;
        }

        .mk-about-page .spotlight-journey p {
          font-size: clamp(0.96rem, 1.8vw, 1.08rem);
          line-height: 1.75;
          color: rgba(255, 255, 255, 0.8);
          margin: 0;
        }

        .mk-about-page .spotlight-bg-img {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
          transform: scale(0);
          will-change: transform;
          display: none;
        }

        .mk-about-page .spotlight-bg-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transform: scale(1.5);
          will-change: transform;
        }

        .mk-about-page .spotlight-titles-container {
          position: absolute;
          top: 0;
          left: 15vw;
          width: 100%;
          height: 100%;
          overflow: hidden;
          clip-path: polygon(50vh 0px, 0px 50%, 50vh 100%, 100% calc(100% + 100vh), 100% -100vh);
          --before-opacity: 0;
          --after-opacity: 0;
        }

        .mk-about-page .spotlight-titles-container::before,
        .mk-about-page .spotlight-titles-container::after {
          content: "";
          position: absolute;
          width: 100vh;
          height: 2.5px;
          background: #fff;
          pointer-events: none;
          transition: opacity 0.3s ease;
          z-index: 10;
        }

        .mk-about-page .spotlight-titles-container::before {
          top: 0;
          left: 0;
          transform: rotate(-45deg) translate(-7rem);
          opacity: var(--before-opacity);
        }

        .mk-about-page .spotlight-titles-container::after {
          bottom: 0;
          left: 0;
          transform: rotate(45deg) translate(-7rem);
          opacity: var(--after-opacity);
        }

        .mk-about-page .spotlight-titles {
          position: relative;
          left: 15%;
          width: 75%;
          height: 100%;
          display: flex;
          flex-direction: column;
          gap: 5rem;
          transform: translateY(100%);
          z-index: 2;
        }

        .mk-about-page .spotlight-title {
          font-size: clamp(2rem, 7vw, 4rem);
          font-weight: 500;
          line-height: 1;
          color: #fff;
          opacity: 0.25;
          transition: opacity 0.3s ease;
          text-wrap: balance;
        }

        .mk-about-page .spotlight-images {
          position: absolute;
          top: 0;
          right: 0;
          width: 50%;
          min-width: 300px;
          height: 100%;
          z-index: 1;
          pointer-events: none;
        }

        .mk-about-page .spotlight-img {
          position: absolute;
          width: 200px;
          height: 150px;
          will-change: transform;
          border-radius: 4px;
          overflow: hidden;
        }

        .mk-about-page .spotlight-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .mk-about-page .spotlight-header {
          position: absolute;
          top: 50%;
          left: 10%;
          transform: translateY(-50%);
          color: #fff;
          transition: opacity 0.3s ease;
          z-index: 2;
          opacity: 0;
        }

        .mk-about-page .team-outro {
          min-height: 100dvh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 7rem 1.25rem;
        }

        .mk-about-page .team-outro .vision-section {
          width: min(1020px, 100%);
          padding: clamp(2rem, 4vw, 3.6rem);
          border: 1px solid rgba(200, 169, 92, 0.2);
          background: linear-gradient(145deg, rgba(18, 18, 18, 0.86), rgba(9, 9, 9, 0.92));
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
        }

        .mk-about-page .vision-section .vision-kicker {
          text-align: center;
          margin-bottom: 12px;
        }

        .mk-about-page .vision-section .vision-title {
          font-family: "Cormorant Garamond", serif;
          font-size: clamp(2.15rem, 4.2vw, 3.5rem);
          font-weight: 500;
          line-height: 1.16;
          letter-spacing: 0.01em;
          text-align: center;
          margin-bottom: 30px;
          color: #f4f1e8;
        }

        .mk-about-page .vision-section .vision-points {
          list-style: none;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px 28px;
          margin: 0 0 30px;
          padding: 0;
        }

        .mk-about-page .vision-section .vision-points li {
          position: relative;
          padding-left: 18px;
          font-size: 1.02rem;
          line-height: 1.72;
          color: rgba(244, 244, 244, 0.88);
        }

        .mk-about-page .vision-section .vision-points li::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0.82em;
          width: 8px;
          height: 1px;
          background: rgba(200, 169, 92, 0.95);
        }

        .mk-about-page .vision-section .vision-summary {
          max-width: 860px;
          margin: 0 auto;
          font-size: 1.07rem;
          line-height: 1.9;
          text-align: center;
          color: rgba(240, 240, 240, 0.82);
        }

        .mk-about-page .team-outro h1 {
          font-size: clamp(2rem, 7vw, 4rem);
          font-weight: 500;
          line-height: 1;
          text-wrap: balance;
          color: #fff;
        }

        .mk-about-page .manual-white-section {
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

        .mk-about-page .manual-white-content {
          max-width: 820px;
        }

        .mk-about-page .manual-white-title {
          font-family: "Cormorant Garamond", serif;
          font-size: clamp(2.1rem, 6vw, 4.3rem);
          font-weight: 500;
          letter-spacing: 0.03em;
          opacity: calc(0.1 + (var(--cta-title-progress) * 0.9));
          transform: translateY(calc((1 - var(--cta-title-progress)) * 30px)) scale(calc(0.985 + (var(--cta-title-progress) * 0.015)));
          filter: blur(calc((1 - var(--cta-title-progress)) * 8px));
          transition: opacity 1.8s cubic-bezier(0.19, 1, 0.22, 1), transform 1.8s cubic-bezier(0.19, 1, 0.22, 1), filter 1.6s cubic-bezier(0.19, 1, 0.22, 1);
        }

        .mk-about-page .manual-white-sub {
          margin: 24px auto 0;
          max-width: 620px;
          font-size: clamp(0.95rem, 1.3vw, 1.1rem);
          line-height: 1.85;
          opacity: calc(var(--cta-copy-progress) * 0.74);
          transform: translateY(calc((1 - var(--cta-copy-progress)) * 22px));
          filter: blur(calc((1 - var(--cta-copy-progress)) * 6px));
          transition: opacity 2s cubic-bezier(0.19, 1, 0.22, 1), transform 2s cubic-bezier(0.19, 1, 0.22, 1), filter 1.7s cubic-bezier(0.19, 1, 0.22, 1);
        }

        .mk-about-page .manual-white-actions {
          margin-top: 36px;
          display: flex;
          justify-content: center;
          gap: 14px;
          opacity: calc(var(--cta-actions-progress) * 0.98);
          transform: translateY(calc((1 - var(--cta-actions-progress)) * 16px));
          filter: blur(calc((1 - var(--cta-actions-progress)) * 4px));
          transition: opacity 2.2s cubic-bezier(0.19, 1, 0.22, 1), transform 2.2s cubic-bezier(0.19, 1, 0.22, 1), filter 1.7s cubic-bezier(0.19, 1, 0.22, 1);
        }

        .mk-about-page .manual-white-actions a {
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

        .mk-about-page .manual-white-actions a:hover {
          background: #0a0a0a;
          color: #e3e4e0;
          border-color: #0a0a0a;
        }

        .mk-about-page .manual-white-section.is-visible .manual-white-title,
        .mk-about-page .manual-white-section.is-visible .manual-white-sub,
        .mk-about-page .manual-white-section.is-visible .manual-white-actions {
          will-change: opacity, transform, filter;
        }

        @media (max-width: 1000px) {
          .mk-about-page .spotlight-titles-container {
            clip-path: none;
          }
          .mk-about-page .spotlight-titles-container::before,
          .mk-about-page .spotlight-titles-container::after {
            display: none;
          }
          .mk-about-page .spotlight-titles {
            left: 0;
          }
          .mk-about-page .spotlight-header {
            display: none;
          }
        }

        @media (max-width: 900px) {
          .mk-about-page .about-inner {
            padding: 0 32px;
          }
          .mk-about-page .intro-block,
          .mk-about-page .two-col,
          .mk-about-page .content-split {
            grid-template-columns: 1fr;
            gap: 48px;
          }
          .mk-about-page .vision-section .vision-points {
            grid-template-columns: 1fr;
          }

          .mk-about-page .manual-white-actions {
            flex-direction: column;
            align-items: center;
          }
        }

        @media (max-width: 768px) {
          .mk-about-page .spotlight-bg-img {
            display: block;
          }
          .mk-about-page .spotlight-title {
            font-size: clamp(1.4rem, 7.5vw, 2rem);
          }
          .mk-about-page .spotlight-intro-text-wrapper {
            gap: 0.2rem;
            justify-content: center;
          }
          .mk-about-page .spotlight-intro-stack {
            width: min(760px, calc(100vw - 2rem));
            gap: 22px;
          }
          .mk-about-page .spotlight-intro-text:nth-child(1) {
            justify-content: center;
          }
          .mk-about-page .spotlight-titles-container {
            left: 0;
            width: 100%;
            padding: 0 1rem;
          }
          .mk-about-page .spotlight-titles {
            left: 0;
            width: 100%;
            gap: 2rem;
          }
          .mk-about-page .spotlight-images {
            display: none;
          }
        }

        @media (max-width: 600px) {
          .mk-about-page .hero-center {
            width: calc(100vw - 2rem);
          }
          .mk-about-page .hero-eyebrow {
            letter-spacing: 0.17em;
            margin-bottom: 12px;
          }
          .mk-about-page .hero-tagline {
            font-size: clamp(2.15rem, 11vw, 3rem);
            line-height: 1.12;
          }
          .mk-about-page .hero-sub {
            margin-top: 16px;
            font-size: 0.9rem;
            letter-spacing: 0.04em;
            line-height: 1.6;
          }
          .mk-about-page .about-page {
            padding: 80px 0;
          }
          .mk-about-page .about-inner {
            padding: 0 20px;
          }
          .mk-about-page .intro-block,
          .mk-about-page .two-col,
          .mk-about-page .single-col,
          .mk-about-page .content-split {
            margin-bottom: 72px;
            padding-bottom: 60px;
          }
          .mk-about-page .intro-left .overline,
          .mk-about-page .content-block .overline,
          .mk-about-page .content-split-left .overline {
            font-size: 0.92rem;
            letter-spacing: 0.18em;
          }
          .mk-about-page .intro-left h2 {
            font-size: clamp(2.35rem, 12vw, 3.1rem);
            line-height: 1.24;
          }
          .mk-about-page .intro-right p,
          .mk-about-page .content-block p,
          .mk-about-page .content-split-right p,
          .mk-about-page .vision-section .vision-summary {
            font-size: clamp(1.08rem, 4.8vw, 1.2rem);
            line-height: 1.9;
          }
          .mk-about-page .about-page .content-block h3,
          .mk-about-page .about-page .content-split-left h3 {
            font-size: clamp(1.95rem, 9.2vw, 2.55rem);
            line-height: 1.2;
            margin-bottom: 24px;
          }
          .mk-about-page .team-outro {
            padding: 5rem 1rem;
          }
        }

        @media (max-width: 480px) {
          .mk-about-page .spotlight-intro-stack {
            gap: 16px;
          }
          .mk-about-page .spotlight-journey h3 {
            margin-bottom: 8px;
          }
          .mk-about-page .spotlight-titles {
            gap: 1.3rem;
          }
        }
      `}</style>

      <main ref={pageRef} className="mk-about-page">
        <canvas ref={textureCanvasRef} className="texture-canvas" />

        <section className="hero" ref={heroRef}>
          <div className="geo-motif" ref={geoMotifRef}>
            <svg viewBox="0 0 340 340" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="30" y="30" width="280" height="280" stroke="#c8a95c" strokeWidth="0.6" transform="rotate(45 170 170)" />
              <rect x="80" y="80" width="180" height="180" stroke="#c8a95c" strokeWidth="0.4" transform="rotate(45 170 170)" />
              <line x1="170" y1="10" x2="170" y2="60" stroke="#c8a95c" strokeWidth="0.4" />
              <line x1="170" y1="280" x2="170" y2="330" stroke="#c8a95c" strokeWidth="0.4" />
              <line x1="10" y1="170" x2="60" y2="170" stroke="#c8a95c" strokeWidth="0.4" />
              <line x1="280" y1="170" x2="330" y2="170" stroke="#c8a95c" strokeWidth="0.4" />
              <circle cx="170" cy="170" r="2" fill="#c8a95c" opacity="0.6" />
              <circle cx="170" cy="170" r="155" stroke="#c8a95c" strokeWidth="0.3" strokeDasharray="4 8" />
            </svg>
          </div>

          <div className="hero-center" ref={heroCenterRef}>
            <span className="hero-eyebrow">About</span>
            <span className="hero-tagline">
              Thoughtfully Designed.
              <br />
              <em>Intentionally Crafted.</em>
            </span>
            <span className="hero-sub">Architecture and interior design studio crafting refined, enduring environments.</span>
          </div>

        </section>

        <section className="about-page" ref={aboutContentRef}>
          <div className="about-inner">
            <div className="intro-block reveal about-reveal">
              <div className="intro-left">
                <span className="overline">Studio</span>
                <h2>
                  A belief that
                  <br />
                  spaces are made
                  <br />
                  to be <em>lived in</em>.
                </h2>
              </div>
              <div className="intro-right">
                <AnimatedParagraph text="Mayaakars was established over seven years ago with a simple belief: meaningful spaces are born when architecture and interior design are conceived as one." />
                <AnimatedParagraph text="What began as a design-driven practice has grown into a multidisciplinary studio shaping refined residential and commercial environments through context, materiality, light, and human experience." />
                <AnimatedParagraph text="Every project is treated as a unique story, never a template." />
              </div>
            </div>

            <div className="content-split reveal about-reveal">
              <div className="content-split-left">
                <span className="overline">Philosophy</span>
                <h3>Design is about how a space feels, functions, and endures.</h3>
              </div>
              <div className="content-split-right">
                <AnimatedParagraph text="Great design comes from clarity and detail, from the first concept to final execution. We begin by understanding the people, the purpose, and the environment." />
                <AnimatedParagraph text="The result is architecture and interiors that are cohesive, expressive, and timeless." />
              </div>
            </div>

            <div className="content-split reveal about-reveal">
              <div className="content-split-left">
                <span className="overline">Integration</span>
                <h3>Architecture and interiors, seamlessly integrated.</h3>
              </div>
              <div className="content-split-right">
                <AnimatedParagraph text="Unlike conventional studios, we approach architecture and interior design as one continuous design dialogue." />
                <AnimatedParagraph text="This keeps structure, spatial flow, materials, and details aligned while improving efficiency and reducing on-site conflicts." />
              </div>
            </div>

            <div className="content-split reveal about-reveal">
              <div className="content-split-left">
                <span className="overline">Journey</span>
                <h3>Our journey so far.</h3>
              </div>
              <div className="content-split-right">
                <AnimatedParagraph text="Over the past seven years, Mayaakars has worked with homeowners, developers, and businesses across residences, villas, apartments, commercial interiors, and bespoke projects." />
                <AnimatedParagraph text="Each project reflects our commitment to craftsmanship, spatial intelligence, and thoughtful design solutions." />
              </div>
            </div>

            <div className="content-split reveal about-reveal">
              <div className="content-split-left">
                <span className="overline">Approach</span>
                <h3>Every project begins with listening.</h3>
              </div>
              <div className="content-split-right">
                <AnimatedParagraph text="We invest time in understanding aspirations, lifestyle, and requirements before shaping a design language that feels authentic and enduring." />
                <AnimatedParagraph text="Our process is structured yet flexible, supported by planning, 3D visualization, and execution oversight so every decision stays intentional." />
              </div>
            </div>
          </div>
        </section>

        {/* Team Members section temporarily disabled
        <section className="spotlight" ref={spotlightRef}>
          <div className="spotlight-intro-stack">
            <div className="spotlight-journey">
              <h3>Our Journey So Far</h3>
              <p>
                Over the past seven years, Mayaakars has collaborated with homeowners, developers, and businesses to deliver spaces
                that balance function with emotion across residences, villas, apartments, and commercial interiors.
              </p>
            </div>
          </div>

          <div className="spotlight-bg-img">
            <img src={TEAM_ITEMS[0].img} alt="background" />
          </div>

          <div className="spotlight-titles-container">
            <div className="spotlight-titles">
              {TEAM_ITEMS.map((item, index) => (
                <h1 key={item.name} className="spotlight-title" style={index === 0 ? { opacity: 1 } : undefined}>
                  {item.name}
                </h1>
              ))}
            </div>
          </div>

          <div className="spotlight-images">
            {TEAM_ITEMS.map((item) => (
              <div key={`img-${item.name}`} className="spotlight-img">
                <img src={item.img} alt={item.name} />
              </div>
            ))}
          </div>

          <div className="spotlight-header">
            <p>Team Members</p>
          </div>
        </section>
        */}

        <section className="about-page">
          <div className="about-inner">
            <div className="content-split reveal about-reveal">
              <div className="content-split-left">
                <span className="overline">What Defines Mayaakars</span>
                <h3>A clear design ethos carried through every project.</h3>
              </div>
              <div className="content-split-right">
                <AnimatedParagraph text="A holistic approach to architecture and interior design." />
                <AnimatedParagraph text="Design solutions rooted in context and functionality." />
                <AnimatedParagraph text="Strong emphasis on materiality, light, and detail." />
                <AnimatedParagraph text="Clear communication and transparent processes." />
                <AnimatedParagraph text="Commitment to delivering spaces that age gracefully." />
                <AnimatedParagraph text="Looking ahead, our focus remains unchanged: to create spaces that are personal, purposeful, and lasting. We see design as a collaborative journey and a privilege to shape everyday environments." />
              </div>
            </div>
          </div>
        </section>

        <section ref={whiteSectionRef} className="manual-white-section">
          <div className="manual-white-content">
            <h2 className="manual-white-title">Let&apos;s Design Something Meaningful</h2>
            <AnimatedParagraph
              className="manual-white-sub"
              text="Whether you are building from the ground up or transforming an existing space, Mayaakars brings a thoughtful, integrated approach to architecture and interiors."
            />
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
    
