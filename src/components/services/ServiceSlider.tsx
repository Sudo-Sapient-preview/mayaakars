"use client";

import { useEffect, useRef } from "react";

type SlideData = { title: string; src: string };

export default function ServiceSlider({ slides }: { slides: SlideData[] }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const sliderRef = useRef<HTMLDivElement>(null);
    const changeSlideRef = useRef<(direction: "down" | "up") => void>(() => { });
    const stateRef = useRef({
        frontIndex: 0,
        animating: false,
    });

    useEffect(() => {
        const container = containerRef.current;
        const slider = sliderRef.current;
        if (!container || !slider) return;

        // Dynamically import GSAP to avoid SSR issues
        let gsapModule: typeof import("gsap") | null = null;
        const getStackMetrics = () => {
            const isMobile =
                typeof window !== "undefined" &&
                window.matchMedia("(max-width: 768px)").matches;
            return isMobile
                ? { baseY: -2, stepY: 8, stepZ: 4, maxVisibleIndex: 0, incomingDepth: 5, peekOpacity: 0 }
                : { baseY: -15, stepY: 15, stepZ: 15, maxVisibleIndex: 4, incomingDepth: 5, peekOpacity: 1 };
        };

        const stackY = (position: number, metrics: ReturnType<typeof getStackMetrics>) =>
            `${metrics.baseY + metrics.stepY * position}%`;

        const loadGsap = async () => {
            gsapModule = await import("gsap");
            initSlider();
        };

        const initSlider = () => {
            if (!gsapModule) return;
            const gsap = gsapModule.gsap;
            const metrics = getStackMetrics();

            const slideEls = Array.from(slider.querySelectorAll<HTMLElement>(".svc-slide"));
            slideEls.forEach((slide, i) => {
                const isVisible = i <= metrics.maxVisibleIndex;
                const opacity = !isVisible ? 0 : i === 0 ? 1 : metrics.peekOpacity;
                gsap.set(slide, {
                    y: stackY(i, metrics),
                    z: metrics.stepZ * i,
                    opacity,
                });
            });
        };

        const handleChange = (direction: "down" | "up") => {
            const s = stateRef.current;
            if (s.animating || !gsapModule || !slider || slides.length === 0) return;
            s.animating = true;

            const gsap = gsapModule.gsap;
            const metrics = getStackMetrics();
            const currentSlides = Array.from(slider.querySelectorAll<HTMLElement>(".svc-slide"));

            if (direction === "down") {
                const first = currentSlides[0];
                const queueDepth = Math.max(currentSlides.length - 1, 1);
                s.frontIndex = (s.frontIndex + 1) % slides.length;
                const nextIdx = (s.frontIndex + queueDepth) % slides.length;
                const nextData = slides[nextIdx];

                const newSlide = document.createElement("div");
                newSlide.className = "svc-slide";
                newSlide.innerHTML = `
          <img src="${nextData.src}" alt="${nextData.title}" class="svc-slide-image" />
          <h1 class="svc-slide-title">${nextData.title}</h1>
                `;
                slider.appendChild(newSlide);

                gsap.set(newSlide, {
                    y: stackY(metrics.incomingDepth, metrics),
                    z: metrics.stepZ * metrics.incomingDepth,
                    opacity: 0,
                });

                const allSlides = Array.from(slider.querySelectorAll<HTMLElement>(".svc-slide"));
                allSlides.forEach((slide, i) => {
                    const targetPos = i - 1;
                    const isVisible = targetPos >= 0 && targetPos <= metrics.maxVisibleIndex;
                    const opacity = !isVisible ? 0 : targetPos === 0 ? 1 : metrics.peekOpacity;
                    gsap.to(slide, {
                        y: stackY(targetPos, metrics),
                        z: metrics.stepZ * targetPos,
                        opacity,
                        duration: 1,
                        ease: "power3.inOut",
                        onComplete: () => {
                            if (i === 0) {
                                first.remove();
                                s.animating = false;
                            }
                        },
                    });
                });
            } else {
                const last = currentSlides[currentSlides.length - 1];
                s.frontIndex = (s.frontIndex - 1 + slides.length) % slides.length;
                const prevData = slides[s.frontIndex];

                const newSlide = document.createElement("div");
                newSlide.className = "svc-slide";
                newSlide.innerHTML = `
          <img src="${prevData.src}" alt="${prevData.title}" class="svc-slide-image" />
          <h1 class="svc-slide-title">${prevData.title}</h1>
                `;
                slider.prepend(newSlide);

                gsap.set(newSlide, {
                    y: stackY(-1, metrics),
                    z: metrics.stepZ * -1,
                    opacity: 0,
                });

                const allSlides = Array.from(slider.querySelectorAll<HTMLElement>(".svc-slide"));
                allSlides.forEach((slide, i) => {
                    const isVisible = i <= metrics.maxVisibleIndex;
                    const opacity = !isVisible ? 0 : i === 0 ? 1 : metrics.peekOpacity;
                    gsap.to(slide, {
                        y: stackY(i, metrics),
                        z: metrics.stepZ * i,
                        opacity,
                        duration: 1,
                        ease: "power3.inOut",
                        onComplete: () => {
                            if (i === currentSlides.length) {
                                last.remove();
                                s.animating = false;
                            }
                        },
                    });
                });
            }
        };
        changeSlideRef.current = handleChange;

        loadGsap();

        return () => {
            changeSlideRef.current = () => { };
        };
    }, [slides]);

    // Render initial 5 slides (or fewer)
    const initialSlides = slides.slice(0, Math.min(5, slides.length));

    return (
        <div ref={containerRef} className="svc-slider-container">
            <style dangerouslySetInnerHTML={{ __html: SLIDER_STYLES }} />
        <div className="svc-slider-stage">
          <div ref={sliderRef} className="svc-slider">
            {initialSlides.map((s, i) => (
              <div key={i} className="svc-slide">
                <img src={s.src} alt={s.title} className="svc-slide-image" />
                <h1 className="svc-slide-title">{s.title}</h1>
              </div>
            ))}
          </div>
            </div>
            <div className="svc-slider-controls">
                <button
                    type="button"
                    className="svc-nav-btn"
                    data-interactive
                    onClick={() => changeSlideRef.current("up")}
                    aria-label="Previous slide"
                >
                    Prev
                </button>
                <button
                    type="button"
                    className="svc-nav-btn"
                    data-interactive
                    onClick={() => changeSlideRef.current("down")}
                    aria-label="Next slide"
                >
                    Next
                </button>
            </div>
        </div>
    );
}

const SLIDER_STYLES = `
  .svc-slider-container {
    position: relative;
    width: 100%;
    height: 100dvh;
    overflow: hidden;
    background: #050505;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0 0 clamp(20px, 4vh, 40px);
  }
  .svc-slider-stage {
    position: relative;
    width: 100%;
    height: min(84vh, 760px);
    overflow: hidden;
  }
  .svc-slider {
    position: absolute;
    width: 100%;
    height: 100%;
    perspective: 250px;
    perspective-origin: 50% 100%;
  }
  .svc-slide {
    position: absolute;
    top: 45%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0px);
    width: 50%;
    height: 400px;
    border-radius: 0.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    will-change: transform, opacity;
    overflow: hidden;
  }
  .svc-slide::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0.12) 0%, rgba(0, 0, 0, 0.38) 100%);
    pointer-events: none;
    z-index: 1;
  }
  .svc-slide-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .svc-slide-title {
    position: relative;
    color: #fff;
    font-family: var(--font-cormorant), 'Inter', serif;
    font-size: clamp(2.2rem, 7vw, 5rem);
    font-weight: 450;
    letter-spacing: -0.15rem;
    z-index: 2;
    text-align: center;
    pointer-events: none;
    line-height: 0.95;
    text-wrap: balance;
    padding-inline: 16px;
    text-shadow: 0 2px 20px rgba(0,0,0,0.6);
  }
  .svc-slider-controls {
    position: relative;
    z-index: 5;
    display: flex;
    gap: 12px;
    margin-top: 18px;
  }
  .svc-nav-btn {
    border: 1px solid rgba(227, 228, 224, 0.5);
    border-radius: 999px;
    background: transparent;
    color: #E3E4E0;
    min-width: 124px;
    min-height: 48px;
    padding: 0 24px;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    font-size: 0.74rem;
    line-height: 1;
    cursor: pointer;
    overflow: hidden;
    transition: background-color 0.25s ease, color 0.25s ease, border-color 0.25s ease;
  }
  .svc-nav-btn:hover {
    background: #E3E4E0;
    color: #0A0A0A;
    border-color: #E3E4E0;
  }
  @media (max-width: 1000px) {
    .svc-slide { width: 88%; height: 320px; }
    .svc-slide-title { font-size: clamp(2rem, 7.2vw, 4rem); }
  }
  @media (max-width: 768px) {
    .svc-slider-container {
      height: clamp(520px, 86svh, 700px);
      padding-bottom: max(14px, calc(env(safe-area-inset-bottom) + 8px));
    }
    .svc-slider-stage {
      height: min(74svh, 560px);
    }
    .svc-slide {
      width: min(92%, 540px);
      top: 42%;
      height: min(62svh, 500px);
      border-radius: 0.4rem;
    }
    .svc-slide-title {
      font-size: clamp(1.85rem, 8vw, 3.2rem);
      letter-spacing: -0.04em;
      line-height: 0.96;
    }
    .svc-slider-controls {
      gap: 10px;
      margin-top: 14px;
    }
    .svc-nav-btn {
      min-width: 108px;
      min-height: 44px;
      font-size: 0.66rem;
      letter-spacing: 0.14em;
      padding: 0 14px;
    }
  }
  @media (max-width: 480px) {
    .svc-slider-container {
      height: clamp(500px, 84svh, 640px);
    }
    .svc-slider-stage {
      height: min(70svh, 480px);
    }
    .svc-slide {
      width: 94%;
      top: 41%;
      height: min(60svh, 430px);
    }
    .svc-slide-title {
      font-size: clamp(1.65rem, 9.2vw, 2.4rem);
      letter-spacing: -0.03em;
    }
    .svc-nav-btn {
      min-width: 100px;
      min-height: 44px;
      font-size: 0.6rem;
      letter-spacing: 0.14em;
    }
  }
`;
