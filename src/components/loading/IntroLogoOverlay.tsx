"use client";

import Image from "next/image";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";

type IntroLogoOverlayProps = {
  onComplete: () => void;
  onAnimationComplete: () => void;
  canComplete: boolean;
};

const BRAND_NAME = "Mayaakars";

export default function IntroLogoOverlay({
  onComplete,
  onAnimationComplete,
  canComplete,
}: IntroLogoOverlayProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const chromeRef = useRef<HTMLDivElement>(null);
  const brandRef = useRef<HTMLDivElement>(null);
  const completedRef = useRef(false);
  const settledRef = useRef(false);
  const sequenceDoneRef = useRef(false);
  const dockTransformRef = useRef({ x: 0, y: 0, scale: 1 });
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const [introActive, setIntroActive] = useState(true);
  const [sequenceDone, setSequenceDone] = useState(false);

  const completeOnce = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    document.documentElement.setAttribute("data-intro-complete", "true");
    window.dispatchEvent(new Event("mayaakars:intro-complete"));
    onComplete();
  }, [onComplete]);

  const fadeChromeOut = useCallback(
    (duration: number) => {
      if (settledRef.current) return;
      settledRef.current = true;

      const chrome = chromeRef.current;
      if (!chrome) {
        setIntroActive(false);
        completeOnce();
        return;
      }

      gsap.to(chrome, {
        autoAlpha: 0,
        duration,
        ease: "power2.inOut",
        onComplete: () => {
          setIntroActive(false);
          completeOnce();
        },
      });
    },
    [completeOnce]
  );

  const markSequenceDone = useCallback(() => {
    if (sequenceDoneRef.current) return;
    sequenceDoneRef.current = true;
    setSequenceDone(true);
    onAnimationComplete();
  }, [onAnimationComplete]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const chrome = chromeRef.current;
    const brand = brandRef.current;
    if (!root || !chrome || !brand) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let ctx: gsap.Context | null = null;
    let cancelled = false;

    const setupIntro = () => {
      if (cancelled) return;

      ctx = gsap.context(() => {
        const targetBrandSlot = document.querySelector<HTMLElement>("[data-navbar-brand-slot]");
        const brandStageRect = brand.getBoundingClientRect();
        const logoEl = brand.querySelector<HTMLElement>(".intro-logo");
        const wordEl = brand.querySelector<HTMLElement>(".intro-word");
        const logoRect = logoEl?.getBoundingClientRect();
        const textRect = wordEl?.getBoundingClientRect();
        const targetRect = targetBrandSlot?.getBoundingClientRect();

        const visualRect =
          logoRect && textRect
            ? {
              left: Math.min(logoRect.left, textRect.left),
              top: Math.min(logoRect.top, textRect.top),
              right: Math.max(logoRect.right, textRect.right),
              bottom: Math.max(logoRect.bottom, textRect.bottom),
              width:
                Math.max(logoRect.right, textRect.right) -
                Math.min(logoRect.left, textRect.left),
              height:
                Math.max(logoRect.bottom, textRect.bottom) -
                Math.min(logoRect.top, textRect.top),
            }
            : brandStageRect;

        const visualCenterX = visualRect.left + visualRect.width / 2;
        const visualCenterY = visualRect.top + visualRect.height / 2;
        const canDockToNavbar = !!targetRect && visualRect.width > 0 && visualRect.height > 0;

        const dockX = canDockToNavbar
          ? targetRect.left + targetRect.width / 2 - visualCenterX
          : 0;
        const dockY = canDockToNavbar
          ? targetRect.top + targetRect.height / 2 - visualCenterY
          : -window.innerHeight / 2 + 44;
        const dockScale = canDockToNavbar
          ? Math.min(targetRect.width / visualRect.width, targetRect.height / visualRect.height)
          : 0.3;

        const originX = visualCenterX - brandStageRect.left;
        const originY = visualCenterY - brandStageRect.top;
        const brandCenterX = brandStageRect.left + brandStageRect.width / 2;
        const logoCenterX = logoRect ? logoRect.left + logoRect.width / 2 : brandCenterX;
        const revealLogoShiftX = brandCenterX - logoCenterX;

        dockTransformRef.current = { x: dockX, y: dockY, scale: dockScale };

        if (reducedMotion) {
          gsap.set(".intro-char", { opacity: 1, x: 0 });
          gsap.set(".intro-logo", { opacity: 1, scale: 1, rotation: 0, x: 0 });
          gsap.set(".intro-brand", {
            x: dockX,
            y: dockY,
            scale: dockScale,
            transformOrigin: `${originX}px ${originY}px`,
          });

          const timeout = window.setTimeout(() => {
            markSequenceDone();
          }, 320);

          timelineRef.current = {
            kill: () => window.clearTimeout(timeout),
          } as unknown as gsap.core.Timeline;
          return;
        }

        gsap.set(chrome, { autoAlpha: 1 });
        gsap.set(".intro-brand", {
          x: 0,
          y: 0,
          scale: 1,
          transformOrigin: `${originX}px ${originY}px`,
        });
        gsap.set(".intro-logo", {
          opacity: 0,
          scale: 0.88,
          rotation: 0,
          x: revealLogoShiftX,
          transformOrigin: "center center",
        });
        gsap.set(".intro-char", { opacity: 0, x: 24 });

        const tl = gsap.timeline();
        timelineRef.current = tl;

        tl
          .to(".intro-logo", {
            opacity: 1,
            scale: 1,
            duration: 0.9,
            ease: "power2.out",
          })
          .to(".intro-logo", {
            rotation: -360,
            x: 0,
            duration: 1.2,
            ease: "power3.inOut",
          })
          .to(
            ".intro-char",
            {
              opacity: 1,
              x: 0,
              duration: 0.4,
              stagger: 0.06,
              ease: "power2.out",
            },
            ">-0.7"
          )
          .to({}, { duration: 0.55 })
          .to(".intro-brand", {
            x: dockX,
            y: dockY,
            scale: dockScale,
            duration: 1.4,
            ease: "power4.inOut",
          })
          .add(markSequenceDone, "-=0.2");
      }, root);
    };

    setupIntro();

    return () => {
      cancelled = true;
      timelineRef.current?.kill();
      ctx?.revert();
    };
  }, [markSequenceDone]);

  useEffect(() => {
    if (!sequenceDone || !canComplete) return;
    const rafId = window.requestAnimationFrame(() => {
      fadeChromeOut(0.55);
    });
    return () => window.cancelAnimationFrame(rafId);
  }, [canComplete, fadeChromeOut, sequenceDone]);

  const finishNow = () => {
    if (completedRef.current || settledRef.current) return;

    const root = rootRef.current;
    const brand = brandRef.current;
    if (!root) {
      setIntroActive(false);
      completeOnce();
      return;
    }

    timelineRef.current?.kill();

    if (brand) {
      const logo = brand.querySelector<HTMLElement>(".intro-logo");
      const chars = brand.querySelectorAll<HTMLElement>(".intro-char");
      gsap.set(chars, { opacity: 1, x: 0 });
      if (logo) gsap.set(logo, { opacity: 1, scale: 1, rotation: 0, x: 0 });

      gsap.to(brand, {
        x: dockTransformRef.current.x,
        y: dockTransformRef.current.y,
        scale: dockTransformRef.current.scale,
        duration: 0.45,
        ease: "power3.out",
      });
    }

    markSequenceDone();
    fadeChromeOut(0.3);
  };

  if (!introActive) return null;

  return (
    <div
      ref={rootRef}
      className={`fixed inset-0 z-[9999] ${introActive ? "" : "pointer-events-none"}`}
      aria-hidden={introActive ? undefined : true}
      aria-label={introActive ? "Loading intro" : undefined}
      role={introActive ? "dialog" : undefined}
      aria-modal={introActive ? "true" : undefined}
    >
      <div ref={chromeRef} className="absolute inset-0 grid grid-rows-[1fr_auto]">
        <div
            className="relative overflow-hidden bg-[#0A0A0A]"
            style={{ background: "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(196, 154, 58, 0.07) 0%, transparent 70%)" }}
          >
          <div className="absolute inset-0 bg-black/60" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(196,154,58,0.10),transparent_52%)]" />
        </div>

        <div className="flex justify-center gap-4 bg-gradient-to-b from-transparent to-black/60 px-4 pb-4 pt-3">
          {!canComplete && sequenceDone ? (
            <p className="self-center text-[10px] uppercase tracking-[0.18em] text-white/65">
              Loading Experience...
            </p>
          ) : null}
          <button
            type="button"
            onClick={finishNow}
            data-interactive
            className="h-9 rounded-full border border-white/15 bg-white/5 px-4 text-[11px] uppercase tracking-[0.14em] text-white/90 transition hover:-translate-y-px hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold)]"
          >
            Skip Intro
          </button>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-6">
        <div
          ref={brandRef}
          className="intro-brand relative inline-flex items-center justify-center gap-3 overflow-visible sm:gap-6 lg:gap-8"
        >
          <div className="relative z-10 shrink-0">
            <Image
              src="/logo-gold.webp"
              alt="Mayaakars logo"
              width={140}
              height={140}
              priority
              className="intro-logo h-16 w-16 object-contain sm:h-20 sm:w-20 lg:h-[140px] lg:w-[140px]"
            />
          </div>

          <h1 className="intro-word whitespace-nowrap font-sans text-[22px] leading-none tracking-[0.08em] text-[#E3E4E0] uppercase sm:text-[40px] sm:tracking-[0.15em] lg:text-[70px]">
            {BRAND_NAME.split("").map((char, index) => (
              <span
                key={`${char}-${index}`}
                className="intro-char inline-block"
                aria-hidden="true"
              >
                {char}
              </span>
            ))}
            <span className="sr-only">{BRAND_NAME}</span>
          </h1>
        </div>
      </div>
    </div>
  );
}
