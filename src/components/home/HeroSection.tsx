"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type HeroSectionProps = {
  onReady?: () => void;
};

type NavigatorWithConnection = Navigator & {
  connection?: {
    effectiveType?: string;
    saveData?: boolean;
  };
};

const FRAME_COUNT = 192;
const FRAME_FPS = 24;
const MAX_FRAME_CACHE = 400;

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const norm = (value: number, start: number, end: number) =>
  clamp01((value - start) / (end - start));
const smooth = (t: number) => t * t * (3 - 2 * t);

export default function HeroSection({ onReady }: HeroSectionProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const doorWrapRef = useRef<HTMLDivElement>(null);
  const sequenceWrapRef = useRef<HTMLDivElement>(null);
  const sequenceInnerRef = useRef<HTMLDivElement>(null);
  const sequenceCanvasRef = useRef<HTMLCanvasElement>(null);
  const sequenceVideoRef = useRef<HTMLVideoElement>(null);
  const step1Ref = useRef<HTMLDivElement>(null);
  const step2Ref = useRef<HTMLDivElement>(null);
  const step3Ref = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const spacer = spacerRef.current;
    const container = containerRef.current;
    const canvas = sequenceCanvasRef.current;
    const video = sequenceVideoRef.current;
    if (!root || !spacer || !container || !canvas || !video) return;

    gsap.registerPlugin(ScrollTrigger);

    const nav = navigator as NavigatorWithConnection;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const connection = nav.connection;
    const saveData = connection?.saveData === true;
    const isSlowConnection =
      typeof connection?.effectiveType === "string" &&
      (connection.effectiveType.includes("2g") ||
        connection.effectiveType.includes("3g"));
    const isLowPowerDevice = (navigator.hardwareConcurrency ?? 8) <= 4;
    const isMobileViewport = window.innerWidth <= 768;
    const useVideoSequence = false;

    let readyNotified = false;
    const markReady = () => {
      if (readyNotified) return;
      readyNotified = true;
      onReady?.();
      window.dispatchEvent(new Event("mayaakars:hero-ready"));
    };

    const frameUrls = Array.from({ length: FRAME_COUNT }, (_, i) => {
      const index = String(i + 1).padStart(3, "0");
      return `/3d_scroll/ezgif-frame-${index}.webp`;
    });

    const frameCache = new Map<number, HTMLImageElement>();
    const pendingFrames = new Set<number>();
    let preloadTimer = 0;
    let preloadIndex = 0;
    let currentFrame = -1;
    let frameReadyFallbackTimer = 0;

    const drawImageToCanvas = (img: HTMLImageElement) => {
      const parent = canvas.parentElement;
      if (!parent) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, Math.floor(parent.clientWidth));
      const height = Math.max(1, Math.floor(parent.clientHeight));
      const pixelWidth = Math.floor(width * dpr);
      const pixelHeight = Math.floor(height * dpr);

      if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
        canvas.width = pixelWidth;
        canvas.height = pixelHeight;
      }

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      const drawRatio = width / height;
      const imgRatio = img.naturalWidth / img.naturalHeight;
      let drawW = width;
      let drawH = height;
      let drawX = 0;
      let drawY = 0;

      if (imgRatio > drawRatio) {
        drawH = height;
        drawW = drawH * imgRatio;
        drawX = (width - drawW) / 2;
      } else {
        drawW = width;
        drawH = drawW / imgRatio;
        drawY = (height - drawH) / 2;
      }

      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(img, drawX, drawY, drawW, drawH);
    };

    const evictCache = (anchorIndex: number) => {
      while (frameCache.size > MAX_FRAME_CACHE) {
        let keyToDrop: number | null = null;
        let farthest = -1;
        frameCache.forEach((_img, frameIndex) => {
          const distance = Math.abs(frameIndex - anchorIndex);
          if (distance > farthest) {
            farthest = distance;
            keyToDrop = frameIndex;
          }
        });
        if (keyToDrop === null) break;
        frameCache.delete(keyToDrop);
      }
    };

    const loadFrame = (index: number, highPriority = false) => {
      const safeIndex = Math.max(0, Math.min(FRAME_COUNT - 1, index));
      if (frameCache.has(safeIndex) || pendingFrames.has(safeIndex)) return;

      pendingFrames.add(safeIndex);
      const img = new Image();
      img.decoding = "async";
      img.src = frameUrls[safeIndex];
      img.onload = () => {
        pendingFrames.delete(safeIndex);
        frameCache.set(safeIndex, img);
        evictCache(safeIndex);

        if (safeIndex === 0) {
          drawImageToCanvas(img);
          markReady();
        } else if (highPriority && currentFrame < 0) {
          currentFrame = safeIndex;
          drawImageToCanvas(img);
        }
      };
      img.onerror = () => {
        pendingFrames.delete(safeIndex);
      };
    };

    const findNearestFrame = (targetIndex: number) => {
      if (frameCache.has(targetIndex)) return targetIndex;
      for (let offset = 1; offset < FRAME_COUNT; offset += 1) {
        const backward = targetIndex - offset;
        if (backward >= 0 && frameCache.has(backward)) return backward;
        const forward = targetIndex + offset;
        if (forward < FRAME_COUNT && frameCache.has(forward)) return forward;
      }
      return null;
    };

    const renderFrame = (index: number) => {
      const safeIndex = Math.max(0, Math.min(FRAME_COUNT - 1, index));
      loadFrame(safeIndex, true);

      const candidateIndex = findNearestFrame(safeIndex);
      if (candidateIndex === null || candidateIndex === currentFrame) return;

      const candidate = frameCache.get(candidateIndex);
      if (!candidate) return;
      currentFrame = candidateIndex;
      drawImageToCanvas(candidate);
    };

    if (useVideoSequence) {
      canvas.style.display = "none";
      video.style.display = "block";
      video.preload = "auto";
      video.muted = true;
      video.playsInline = true;
      video.src = "/3d_scroll/immersive.mp4";
      const onLoadedData = () => markReady();
      video.addEventListener("loadeddata", onLoadedData, { once: true });
      video.load();
    } else {
      video.pause();
      video.removeAttribute("src");
      video.load();
      video.style.display = "none";
      canvas.style.display = "block";

      for (let i = 0; i < 24; i += 1) {
        loadFrame(i, true);
      }
      preloadIndex = 24;

      preloadTimer = window.setInterval(() => {
        for (let i = 0; i < 6 && preloadIndex < FRAME_COUNT; i += 1) {
          loadFrame(preloadIndex);
          preloadIndex += 1;
        }
        if (preloadIndex >= FRAME_COUNT) {
          window.clearInterval(preloadTimer);
          preloadTimer = 0;
        }
      }, 140);

      frameReadyFallbackTimer = window.setTimeout(() => {
        markReady();
      }, 2400);
    }

    const sequenceDurationSeconds = (FRAME_COUNT - 1) / FRAME_FPS;
    const PHASE_A_END = 0.08;
    const PHASE_B_END = 0.2;
    const PHASE_C_END = 0.28;
    const PHASE_D_END = 0.38;
    const PHASE_E_END = 0.88;
    const SEQUENCE_FADE_END = 0.93;
    const CTA_VISIBLE_END = 0.96;
    const PHASE_F_END = 1;
    const PADDING = 24;

    const setStepState = (el: HTMLDivElement | null, opacity: number) => {
      if (!el) return;
      const safe = clamp01(opacity);
      const blurPx = Math.round((1 - safe) * 20);
      el.style.opacity = String(safe);
      el.style.filter = `blur(${blurPx}px)`;
    };

    const frameFromImmersiveProgress = (p: number) => {
      const clampedProgress = clamp01(p);
      const elapsed = clampedProgress * sequenceDurationSeconds;
      const frame = Math.floor(elapsed * FRAME_FPS + 0.0001);
      return Math.min(FRAME_COUNT - 1, Math.max(0, frame));
    };

    const onResize = () => {
      if (useVideoSequence) return;
      if (currentFrame < 0) return;
      const current = frameCache.get(currentFrame);
      if (current) drawImageToCanvas(current);
    };
    window.addEventListener("resize", onResize);

    const ctx = gsap.context(() => {
      gsap.set(".step-content", {
        opacity: 0,
        filter: "blur(20px)",
        y: 0,
      });
      gsap.set(".door-left-g, .door-left-g-mob", { x: 0 });
      gsap.set(".door-right-g, .door-right-g-mob", { x: 0 });
      gsap.set(".draw-path", { strokeDasharray: 3000, strokeDashoffset: 3000 });
      gsap.set(".knob-left", { svgOrigin: "484 390" });
      gsap.set(".knob-right", { svgOrigin: "516 390" });
      gsap.set(".knob-left-mob", { svgOrigin: "230 500" });
      gsap.set(".knob-right-mob", { svgOrigin: "270 500" });

      const setLeftDesktop = gsap.quickSetter(".door-left-g", "x");
      const setRightDesktop = gsap.quickSetter(".door-right-g", "x");
      const setLeftMobile = gsap.quickSetter(".door-left-g-mob", "x");
      const setRightMobile = gsap.quickSetter(".door-right-g-mob", "x");
      const setKnobLeft = gsap.quickSetter(".knob-left", "rotation");
      const setKnobRight = gsap.quickSetter(".knob-right", "rotation");
      const setKnobLeftMobile = gsap.quickSetter(".knob-left-mob", "rotation");
      const setKnobRightMobile = gsap.quickSetter(".knob-right-mob", "rotation");

      const drawTl = gsap.timeline({ delay: 0.2 });
      drawTl.to(".draw-path", {
        strokeDashoffset: 0,
        duration: 2.2,
        stagger: { amount: 2 },
        ease: "power2.inOut",
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: spacer,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.6,
          onUpdate: (self) => {
            const p = clamp01(self.progress);

            let doorProgress = 0;
            if (p <= PHASE_A_END) {
              doorProgress = 0;
            } else if (p <= PHASE_B_END) {
              doorProgress = smooth(norm(p, PHASE_A_END, PHASE_B_END));
            } else {
              doorProgress = 1;
            }

            const leftXDesktop = -520 * doorProgress;
            const rightXDesktop = 520 * doorProgress;
            const leftXMobile = -280 * doorProgress;
            const rightXMobile = 280 * doorProgress;
            const knobAngle = 90 * doorProgress;

            setLeftDesktop(leftXDesktop);
            setRightDesktop(rightXDesktop);
            setLeftMobile(leftXMobile);
            setRightMobile(rightXMobile);
            setKnobLeft(-knobAngle);
            setKnobRight(knobAngle);
            setKnobLeftMobile(-knobAngle);
            setKnobRightMobile(knobAngle);

            let step1Opacity = 0;
            let step2Opacity = 0;
            let step3Opacity = 0;

            if (p >= PHASE_A_END && p <= PHASE_C_END) {
              const inProgress = norm(p, PHASE_A_END, (PHASE_A_END + PHASE_B_END) / 2);
              const outProgress = norm(p, PHASE_B_END, PHASE_C_END);
              step1Opacity = clamp01(smooth(inProgress) * (1 - smooth(outProgress)));
            }

            if (p >= PHASE_D_END && p <= PHASE_E_END) {
              const local = norm(p, PHASE_D_END, PHASE_E_END);
              const inProgress = norm(local, 0.08, 0.28);
              const outProgress = norm(local, 0.45, 0.6);
              step2Opacity = clamp01(smooth(inProgress) * (1 - smooth(outProgress)));
              const step3In = norm(local, 0.62, 0.8);
              step3Opacity = smooth(step3In);
            }

            setStepState(step1Ref.current, step1Opacity);
            setStepState(step2Ref.current, step2Opacity);
            setStepState(step3Ref.current, step3Opacity);

            if (sequenceWrapRef.current) {
              let sequenceOpacity = 0;
              if (p >= PHASE_B_END && p <= PHASE_C_END) {
                sequenceOpacity = smooth(norm(p, PHASE_B_END, PHASE_C_END));
              } else if (p > PHASE_C_END && p <= SEQUENCE_FADE_END) {
                sequenceOpacity = 1;
              }
              if (p > PHASE_E_END) {
                sequenceOpacity *= 1 - smooth(norm(p, PHASE_E_END, SEQUENCE_FADE_END));
              }
              sequenceWrapRef.current.style.opacity = String(clamp01(sequenceOpacity));
            }

            if (ctaRef.current) {
              let ctaOpacity = 0;
              if (p >= PHASE_E_END && p < SEQUENCE_FADE_END) {
                ctaOpacity = smooth(norm(p, PHASE_E_END, SEQUENCE_FADE_END));
              } else if (p >= SEQUENCE_FADE_END && p <= CTA_VISIBLE_END) {
                ctaOpacity = 1;
              } else if (p > CTA_VISIBLE_END && p <= PHASE_F_END) {
                ctaOpacity = 1 - smooth(norm(p, CTA_VISIBLE_END, PHASE_F_END));
              }
              ctaRef.current.style.opacity = String(clamp01(ctaOpacity));
            }

            if (sequenceInnerRef.current) {
              const vw = window.innerWidth;
              const vh = window.innerHeight;
              const startW = Math.min(vw * 0.84, 1020);
              const startH = Math.min(vh * 0.72, 720);
              const endW = vw - PADDING * 2;
              const endH = vh - PADDING * 2;

              let expandT = 0;
              if (p >= PHASE_C_END && p <= PHASE_D_END) {
                expandT = smooth(norm(p, PHASE_C_END, PHASE_D_END));
              } else if (p > PHASE_D_END) {
                expandT = 1;
              }

              const curW = startW + (endW - startW) * expandT;
              const curH = startH + (endH - startH) * expandT;
              sequenceInnerRef.current.style.width = `${curW}px`;
              sequenceInnerRef.current.style.height = `${curH}px`;
            }

            if (p >= PHASE_D_END) {
              const immersiveProgress = norm(p, PHASE_D_END, PHASE_E_END);
              if (useVideoSequence) {
                if (video.duration > 0) {
                  const targetTime = immersiveProgress * video.duration;
                  if (Math.abs(video.currentTime - targetTime) > 1 / 30) {
                    video.currentTime = targetTime;
                  }
                }
              } else {
                renderFrame(frameFromImmersiveProgress(immersiveProgress));
              }
            } else if (useVideoSequence) {
              if (video.duration > 0 && video.currentTime !== 0) {
                video.currentTime = 0;
              }
            } else {
              renderFrame(0);
            }

            if (doorWrapRef.current) {
              let doorOpacity = 1;
              let doorScale = 1;
              if (p > PHASE_C_END && p <= PHASE_D_END) {
                const exitT = smooth(norm(p, PHASE_C_END, PHASE_D_END));
                doorScale = 1 + exitT * 2;
                doorOpacity = exitT > 0.85 ? 1 - norm(exitT, 0.85, 1) : 1;
              } else if (p > PHASE_D_END) {
                doorOpacity = 0;
              }
              doorWrapRef.current.style.opacity = String(clamp01(doorOpacity));
              doorWrapRef.current.style.transform = `scale(${doorScale})`;
            }

            const containerOpacity =
              p > CTA_VISIBLE_END ? 1 - norm(p, CTA_VISIBLE_END, PHASE_F_END) : 1;
            container.style.opacity = String(clamp01(containerOpacity));
            container.style.pointerEvents =
              containerOpacity < 0.05 ? "none" : "auto";
          },
        },
      });

      tl.add("openDoors").to({}, { duration: 1 });
    }, root);

    return () => {
      window.removeEventListener("resize", onResize);
      ctx.revert();

      if (preloadTimer) {
        window.clearInterval(preloadTimer);
      }
      if (frameReadyFallbackTimer) {
        window.clearTimeout(frameReadyFallbackTimer);
      }

      video.pause();
      video.removeAttribute("src");
      video.load();
      frameCache.clear();
      pendingFrames.clear();
    };
  }, [onReady]);

  return (
    <div ref={rootRef} className="relative">
      <div ref={spacerRef} className="h-[640vh]" />

      <div
        ref={containerRef}
        className="mk-home-dark-section fixed inset-0 z-[1] overflow-hidden"
      >
        <div
          ref={sequenceWrapRef}
          className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center opacity-0"
        >
          <div
            ref={sequenceInnerRef}
            data-cursor-media
            className="relative overflow-hidden rounded-sm"
            style={{ width: "min(84vw, 1020px)", height: "min(72vh, 720px)" }}
          >
            <video
              ref={sequenceVideoRef}
              className="absolute inset-0 h-full w-full object-cover"
              muted
              playsInline
              preload="metadata"
              aria-hidden
            />
            <canvas
              ref={sequenceCanvasRef}
              className="absolute inset-0 h-full w-full"
              draggable={false}
            />
            <div className="absolute inset-0 bg-black/20" />
          </div>
        </div>

        <div className="mk-home-dark-texture" />

        <div
          ref={ctaRef}
          className="pointer-events-none absolute inset-0 z-[3] flex items-center justify-center opacity-0"
        >
          <h2
            className="px-6 text-center font-serif text-3xl uppercase tracking-[0.12em] text-white/80 sm:text-5xl"
            style={{ fontFamily: "var(--font-cormorant), serif" }}
          >
            Let&apos;s Design Something Meaningful
          </h2>
        </div>

        <div
          ref={doorWrapRef}
          className="door-wrapper absolute inset-0 z-[2] flex items-center justify-center"
          style={{ perspective: "1400px", transformOrigin: "center center" }}
        >
          <svg
            viewBox="0 0 1000 780"
            className="hidden h-[78vh] w-[90vw] max-h-[780px] max-w-[1100px] md:block"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ overflow: "visible" }}
          >
            <g stroke="#C49A3A">
              <path className="draw-path" d="M-3000 772 L10 772" strokeWidth="5" strokeOpacity="0.8" />
              <path className="draw-path" d="M990 772 L4000 772" strokeWidth="5" strokeOpacity="0.8" />
              <path className="draw-path" d="M-3000 782 L10 782" strokeWidth="1.2" strokeOpacity="0.3" />
              <path className="draw-path" d="M990 782 L4000 782" strokeWidth="1.2" strokeOpacity="0.3" />
              <path className="draw-path" d="M-3000 8 L10 8" strokeWidth="1.5" strokeOpacity="0.4" />
              <path className="draw-path" d="M990 8 L4000 8" strokeWidth="1.5" strokeOpacity="0.4" />
              <path className="draw-path" d="M-600 8 L-600 772" strokeWidth="1" strokeOpacity="0.2" />
              <path className="draw-path" d="M-1200 8 L-1200 772" strokeWidth="1" strokeOpacity="0.2" />
              <path className="draw-path" d="M1600 8 L1600 772" strokeWidth="1" strokeOpacity="0.2" />
              <path className="draw-path" d="M2200 8 L2200 772" strokeWidth="1" strokeOpacity="0.2" />
            </g>

            <g stroke="#C49A3A">
              <path className="draw-path" d="M10 772 L10 8 L990 8 L990 772" strokeWidth="5" />
              <path className="draw-path" d="M28 772 L28 32 L972 32 L972 772" strokeWidth="1.2" strokeOpacity="0.3" />
            </g>

            <g className="door-left-g">
              <rect className="draw-path" x="10" y="16" width="490" height="748" fill="#0A0A0A" stroke="#C49A3A" strokeWidth="2" />
              <rect className="draw-path" x="30" y="40" width="454" height="700" stroke="#C49A3A" strokeWidth="0.9" strokeOpacity="0.35" />
              <rect className="draw-path" x="52" y="64" width="412" height="300" stroke="#C49A3A" strokeWidth="0.7" strokeOpacity="0.3" />
              <rect className="draw-path" x="52" y="384" width="412" height="300" stroke="#C49A3A" strokeWidth="0.7" strokeOpacity="0.3" />
              <g className="knob-left">
                <circle className="draw-path" cx="484" cy="390" r="9" fill="#C49A3A" stroke="#C49A3A" />
                <rect className="draw-path" x="482" y="365" width="4" height="50" fill="#C49A3A" stroke="#C49A3A" rx="2" />
              </g>
            </g>

            <g className="door-right-g">
              <rect className="draw-path" x="500" y="16" width="490" height="748" fill="#0A0A0A" stroke="#C49A3A" strokeWidth="2" />
              <rect className="draw-path" x="516" y="40" width="454" height="700" stroke="#C49A3A" strokeWidth="0.9" strokeOpacity="0.35" />
              <rect className="draw-path" x="536" y="64" width="412" height="300" stroke="#C49A3A" strokeWidth="0.7" strokeOpacity="0.3" />
              <rect className="draw-path" x="536" y="384" width="412" height="300" stroke="#C49A3A" strokeWidth="0.7" strokeOpacity="0.3" />
              <g className="knob-right">
                <circle className="draw-path" cx="516" cy="390" r="9" fill="#C49A3A" stroke="#C49A3A" />
                <rect className="draw-path" x="514" y="365" width="4" height="50" fill="#C49A3A" stroke="#C49A3A" rx="2" />
              </g>
            </g>
          </svg>

          <svg
            viewBox="0 0 500 1000"
            className="mt-10 block h-[80vh] w-[90vw] max-h-[1000px] md:hidden"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ overflow: "visible" }}
          >
            <g stroke="#C49A3A">
              <path className="draw-path" d="M-1000 992 L10 992" strokeWidth="5" strokeOpacity="0.8" />
              <path className="draw-path" d="M490 992 L1500 992" strokeWidth="5" strokeOpacity="0.8" />
              <path className="draw-path" d="M-1000 1002 L10 1002" strokeWidth="1.2" strokeOpacity="0.3" />
              <path className="draw-path" d="M490 1002 L1500 1002" strokeWidth="1.2" strokeOpacity="0.3" />
              <path className="draw-path" d="M-1000 8 L10 8" strokeWidth="1.5" strokeOpacity="0.4" />
              <path className="draw-path" d="M490 8 L1500 8" strokeWidth="1.5" strokeOpacity="0.4" />
              <path className="draw-path" d="M-300 8 L-300 992" strokeWidth="1" strokeOpacity="0.2" />
              <path className="draw-path" d="M800 8 L800 992" strokeWidth="1" strokeOpacity="0.2" />
            </g>

            <g stroke="#C49A3A">
              <path className="draw-path" d="M10 992 L10 8 L490 8 L490 992" strokeWidth="5" />
              <path className="draw-path" d="M28 992 L28 32 L472 32 L472 992" strokeWidth="1.2" strokeOpacity="0.3" />
            </g>

            <g className="door-left-g-mob">
              <rect className="draw-path" x="10" y="16" width="240" height="968" fill="#0A0A0A" stroke="#C49A3A" strokeWidth="2" />
              <rect className="draw-path" x="30" y="40" width="200" height="920" stroke="#C49A3A" strokeWidth="0.9" strokeOpacity="0.35" />
              <rect className="draw-path" x="45" y="60" width="170" height="400" stroke="#C49A3A" strokeWidth="0.7" strokeOpacity="0.3" />
              <rect className="draw-path" x="45" y="490" width="170" height="400" stroke="#C49A3A" strokeWidth="0.7" strokeOpacity="0.3" />
              <g className="knob-left-mob">
                <circle className="draw-path" cx="230" cy="500" r="7" fill="#C49A3A" stroke="#C49A3A" />
                <rect className="draw-path" x="228" y="475" width="4" height="50" fill="#C49A3A" stroke="#C49A3A" rx="2" />
              </g>
            </g>

            <g className="door-right-g-mob">
              <rect className="draw-path" x="250" y="16" width="240" height="968" fill="#0A0A0A" stroke="#C49A3A" strokeWidth="2" />
              <rect className="draw-path" x="270" y="40" width="200" height="920" stroke="#C49A3A" strokeWidth="0.9" strokeOpacity="0.35" />
              <rect className="draw-path" x="285" y="60" width="170" height="400" stroke="#C49A3A" strokeWidth="0.7" strokeOpacity="0.3" />
              <rect className="draw-path" x="285" y="490" width="170" height="400" stroke="#C49A3A" strokeWidth="0.7" strokeOpacity="0.3" />
              <g className="knob-right-mob">
                <circle className="draw-path" cx="270" cy="500" r="7" fill="#C49A3A" stroke="#C49A3A" />
                <rect className="draw-path" x="268" y="475" width="4" height="50" fill="#C49A3A" stroke="#C49A3A" rx="2" />
              </g>
            </g>
          </svg>
        </div>

        <div className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center">
          <div className="relative flex h-[78vh] w-[90vw] max-h-[780px] max-w-[1100px] items-center justify-center overflow-hidden">
            <div className="relative w-full max-w-[700px] text-center">
              <div ref={step1Ref} className="step-content step-1 flex items-center justify-center">
                <h2 className="px-6 text-center text-[20px] leading-[1.15] tracking-tight text-white sm:text-[24px] md:px-0 md:text-[32px] lg:text-[48px]" style={{ fontFamily: "var(--font-cormorant)", textShadow: "0 4px 12px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.6)" }}>
                  Architecture and Interiors,
                  <br />
                  <span className="italic text-[#FFD700]" style={{ fontFamily: "var(--font-cormorant)" }}>Crafted as One</span>
                </h2>
              </div>

              <div ref={step2Ref} className="step-content step-2 absolute inset-0 flex items-center justify-center">
                <h2 className="px-6 text-center text-[18px] leading-[1.15] tracking-tight text-white sm:text-[22px] md:px-0 md:text-[28px] lg:text-[42px]" style={{ fontFamily: "var(--font-cormorant)", textShadow: "0 4px 12px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.6)" }}>
                  We design spaces that are deeply <span className="italic text-[#FFD700]">personal</span>,
                  <br />
                  architecturally grounded, and artistically refined.
                </h2>
              </div>

              <div ref={step3Ref} className="step-content step-3 absolute inset-0 flex items-center justify-center">
                <h2 className="px-6 text-center text-[18px] leading-[1.15] text-white sm:text-[22px] md:px-0 md:text-[28px] lg:text-[42px]" style={{ fontFamily: "var(--font-cormorant)", textShadow: "0 4px 12px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.6)" }}>
                  From concept
                  <br />
                  to <span className="italic uppercase tracking-[0.16em] text-[#FFD700] lg:tracking-[0.3em]" style={{ fontFamily: "var(--font-cormorant)", textShadow: "0 4px 12px rgba(0,0,0,0.8)" }}>completion.</span>
                </h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
