"use client";

import { useEffect, useRef } from "react";
import { useRouteTransition } from "@/components/navigation/RouteTransitionProvider";

type ProjectData = { id: string; title: string; category: string; coverImage: string };

export default function ProjectSlider({ projects }: { projects: ProjectData[] }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const sliderRef = useRef<HTMLDivElement>(null);
    const changeSlideRef = useRef<(direction: "down" | "up") => void>(() => { });
    const { navigate } = useRouteTransition();
    
    // We store the navigated state to prevent double clicks during animation
    const stateRef = useRef({
        frontIndex: 0,
        animating: false,
    });

    useEffect(() => {
        const container = containerRef.current;
        const slider = sliderRef.current;
        if (!container || !slider) return;

        slider.innerHTML = "";
        
        // Render initial 5 slides (or fewer)
        const initialProjects = projects.slice(0, Math.min(5, projects.length));
        
        stateRef.current.frontIndex = 0;
        stateRef.current.animating = false;

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

        const createSlideElement = (proj: ProjectData, isInitial: boolean) => {
            const slide = document.createElement("div");
            slide.className = "proj-slide cursor-pointer";
            
            slide.innerHTML = `
              <img src="${proj.coverImage}" alt="${proj.title}" class="proj-slide-image" loading="${isInitial ? 'eager' : 'lazy'}" decoding="async" />
              <div class="proj-slide-overlay"></div>
              <h3 class="proj-slide-title">${proj.title}</h3>
            `;
            
            slide.addEventListener("click", () => {
                if (!stateRef.current.animating) {
                    navigate(`/gallery/${proj.id}`);
                }
            });
            return slide;
        };

        const loadGsap = async () => {
            gsapModule = await import("gsap");
            
            initialProjects.forEach((proj, i) => {
                const slide = createSlideElement(proj, i === 0);
                slider.appendChild(slide);
            });
            
            initSlider();
        };

        const initSlider = () => {
            if (!gsapModule) return;
            const gsap = gsapModule.gsap;
            const metrics = getStackMetrics();

            const slideEls = Array.from(slider.querySelectorAll<HTMLElement>(".proj-slide"));
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
            if (s.animating || !gsapModule || !slider || projects.length <= 1) return;
            s.animating = true;

            const gsap = gsapModule.gsap;
            const metrics = getStackMetrics();
            const currentSlides = Array.from(slider.querySelectorAll<HTMLElement>(".proj-slide"));

            if (direction === "down") {
                const first = currentSlides[0];
                const queueDepth = Math.max(currentSlides.length - 1, 1);
                s.frontIndex = (s.frontIndex + 1) % projects.length;
                const nextIdx = (s.frontIndex + queueDepth) % projects.length;
                const nextData = projects[nextIdx];

                const newSlide = createSlideElement(nextData, false);
                slider.appendChild(newSlide);

                gsap.set(newSlide, {
                    y: stackY(metrics.incomingDepth, metrics),
                    z: metrics.stepZ * metrics.incomingDepth,
                    opacity: 0,
                });

                const allSlides = Array.from(slider.querySelectorAll<HTMLElement>(".proj-slide"));
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
                s.frontIndex = (s.frontIndex - 1 + projects.length) % projects.length;
                const prevData = projects[s.frontIndex];

                const newSlide = createSlideElement(prevData, false);
                slider.prepend(newSlide);

                gsap.set(newSlide, {
                    y: stackY(-1, metrics),
                    z: metrics.stepZ * -1,
                    opacity: 0,
                });

                const allSlides = Array.from(slider.querySelectorAll<HTMLElement>(".proj-slide"));
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

        let wheelAccumulator = 0;
        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();
            wheelAccumulator += Math.abs(e.deltaY);
            if (wheelAccumulator >= 100 && !stateRef.current.animating) {
                 changeSlideRef.current(e.deltaY > 0 ? "down" : "up");
                 wheelAccumulator = 0;
            }
        };
        
        const c = container;
        c.addEventListener("wheel", handleWheel, { passive: false });

        return () => {
            changeSlideRef.current = () => { };
            c.removeEventListener("wheel", handleWheel);
        };
    }, [projects, navigate]);

    if (!projects || projects.length === 0) {
        return (
            <div className="flex h-full w-full items-center justify-center">
                <p className="text-white/30 italic font-serif text-xl">No projects found.</p>
            </div>
        );
    }

    return (
        <div ref={containerRef} className="proj-slider-container">
            <style dangerouslySetInnerHTML={{ __html: SLIDER_STYLES }} />
            <div className="proj-slider-stage">
                <div ref={sliderRef} className="proj-slider" />
            </div>
            {projects.length > 1 && (
                <div className="proj-slider-controls">
                    <button
                        type="button"
                        className="proj-nav-btn"
                        data-interactive
                        onClick={() => changeSlideRef.current("up")}
                        aria-label="Previous project"
                    >
                        Prev
                    </button>
                    <button
                        type="button"
                        className="proj-nav-btn"
                        data-interactive
                        onClick={() => changeSlideRef.current("down")}
                        aria-label="Next project"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}

const SLIDER_STYLES = `
  .proj-slider-container {
    position: relative;
    width: 100%;
    height: 100dvh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    touch-action: pan-y;
  }
  .proj-slider-stage {
    position: relative;
    width: 100%;
    height: min(84vh, 760px);
    overflow: hidden;
  }
  .proj-slider {
    position: absolute;
    width: 100%;
    height: 100%;
    perspective: 250px;
    perspective-origin: 50% 100%;
  }
  .proj-slide {
    position: absolute;
    top: 45%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0px);
    width: 50%;
    height: 480px;
    border-radius: 0.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    will-change: transform, opacity;
    overflow: hidden;
    transition: filter 0.3s ease;
  }
  .proj-slide:hover {
    filter: brightness(1.1);
  }
  .proj-slide-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.4) 100%);
    pointer-events: none;
    z-index: 1;
  }
  .proj-slide-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .proj-slide-title {
    position: relative;
    color: #fff;
    font-family: var(--font-cormorant), 'Inter', serif;
    font-size: clamp(2.2rem, 7vw, 4rem);
    font-weight: 450;
    letter-spacing: -0.05rem;
    z-index: 2;
    text-align: center;
    pointer-events: none;
    line-height: 1.1;
    text-wrap: balance;
    padding-inline: 16px;
    text-shadow: 0 2px 20px rgba(0,0,0,0.8);
  }
  .proj-slider-controls {
    position: relative;
    z-index: 5;
    display: flex;
    gap: 12px;
    margin-top: 18px;
  }
  .proj-nav-btn {
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
  .proj-nav-btn:hover {
    background: #E3E4E0;
    color: #0A0A0A;
    border-color: #E3E4E0;
  }
  @media (max-width: 1000px) {
    .proj-slide { width: 88%; height: 320px; }
  }
  @media (max-width: 768px) {
    .proj-slider-container {
      height: clamp(520px, 86svh, 700px);
    }
    .proj-slider-stage {
      height: min(74svh, 560px);
    }
    .proj-slide {
      width: min(92%, 540px);
      top: 42%;
      height: min(62svh, 500px);
      border-radius: 0.4rem;
    }
    .proj-slider-controls {
      gap: 10px;
      margin-top: 14px;
    }
    .proj-nav-btn {
      min-width: 108px;
      min-height: 44px;
      font-size: 0.66rem;
      letter-spacing: 0.14em;
      padding: 0 14px;
    }
  }
  @media (max-width: 480px) {
    .proj-slider-container {
      height: clamp(500px, 84svh, 640px);
    }
    .proj-slider-stage {
      height: min(70svh, 480px);
    }
    .proj-slide {
      width: 94%;
      top: 41%;
      height: min(60svh, 430px);
    }
    .proj-nav-btn {
      min-width: 100px;
      min-height: 44px;
      font-size: 0.6rem;
      letter-spacing: 0.14em;
    }
  }
`;
