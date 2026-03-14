"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import type { ProjectSlide } from "@/lib/projects-data";

type ProjectPerPageSliderProps = {
    slides: ProjectSlide[];
};

export default function ProjectPerPageSlider({ slides }: ProjectPerPageSliderProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [nextIndex, setNextIndex] = useState<number | null>(null);
    const [direction, setDirection] = useState<"next" | "prev">("next");
    const [isAnimating, setIsAnimating] = useState(false);
    const rootRef = useRef<HTMLDivElement>(null);
    const currentLayerRef = useRef<HTMLDivElement>(null);
    const nextLayerRef = useRef<HTMLDivElement>(null);
    const currentImgRef = useRef<HTMLImageElement>(null);
    const nextImgRef = useRef<HTMLImageElement>(null);
    const currentTitleRef = useRef<HTMLHeadingElement>(null);
    const nextTitleRef = useRef<HTMLHeadingElement>(null);
    const touchStartXRef = useRef(0);
    const easeReadyRef = useRef(false);

    useEffect(() => {
        if (easeReadyRef.current) return;
        gsap.registerPlugin(CustomEase);
        CustomEase.create("pps-hop", "M0,0 C0.071,0.505 0.192,0.726 0.318,0.852 0.45,0.984 0.504,1 1,1");
        easeReadyRef.current = true;
    }, []);

    useEffect(() => {
        const currentTitle = currentTitleRef.current;
        if (!currentTitle) return;

        const words = currentTitle.querySelectorAll(".word");
        if (!words.length) return;

        gsap.set(words, { filter: "blur(75px)", opacity: 0 });
        gsap.to(words, {
            filter: "blur(0px)",
            opacity: 1,
            duration: 2,
            ease: "power3.out",
            stagger: 0.045,
        });
    }, []);

    useEffect(() => {
        if (nextIndex !== null) return;

        const currentLayer = currentLayerRef.current;
        const currentImg = currentImgRef.current;
        const currentTitle = currentTitleRef.current;
        if (!currentLayer || !currentImg || !currentTitle) return;

        const currentWords = currentTitle.querySelectorAll(".word");

        gsap.set(currentLayer, {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            clearProps: "transform",
        });
        gsap.set(currentImg, { x: 0, clearProps: "transform" });
        gsap.set(currentWords, { filter: "blur(0px)", opacity: 1 });
    }, [activeIndex, nextIndex]);

    const navigate = useCallback(
        (dir: "next" | "prev") => {
            if (isAnimating || slides.length <= 1) return;
            setDirection(dir);
            setIsAnimating(true);
            setNextIndex((current) => {
                if (current !== null) return current;
                if (dir === "next") return (activeIndex + 1) % slides.length;
                return (activeIndex - 1 + slides.length) % slides.length;
            });
        },
        [activeIndex, isAnimating, slides.length],
    );

    useEffect(() => {
        if (nextIndex === null) return;
        const currentLayer = currentLayerRef.current;
        const incomingLayer = nextLayerRef.current;
        const currentImg = currentImgRef.current;
        const incomingImg = nextImgRef.current;
        const currentTitle = currentTitleRef.current;
        const incomingTitle = nextTitleRef.current;
        if (!currentLayer || !incomingLayer || !currentImg || !incomingImg || !currentTitle || !incomingTitle) {
            return;
        }

        const slideOffset = window.innerWidth < 1000 ? 200 : 800;
        const startsFromRight = direction === "next";
        const initialClip = startsFromRight
            ? "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)"
            : "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)";

        const currentWords = currentTitle.querySelectorAll(".word");
        const incomingWords = incomingTitle.querySelectorAll(".word");

        gsap.set(incomingImg, { x: startsFromRight ? slideOffset : -slideOffset });
        gsap.set(incomingLayer, { clipPath: initialClip });
        gsap.set(incomingWords, { filter: "blur(75px)", opacity: 0 });

        const tl = gsap.timeline({
            defaults: { duration: 1.5, ease: "pps-hop" },
            onComplete: () => {
                setActiveIndex(nextIndex);
                setNextIndex(null);
                setIsAnimating(false);
            },
        });

        tl.to(
            currentImg,
            {
                x: startsFromRight ? -slideOffset : slideOffset,
            },
            0,
        )
            .to(
                incomingLayer,
                {
                    clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
                },
                0,
            )
            .to(
                incomingImg,
                {
                    x: 0,
                },
                0,
            )
            .to(
                currentWords,
                {
                    filter: "blur(75px)",
                    opacity: 0,
                    duration: 1.2,
                    ease: "power2.inOut",
                    stagger: 0.03,
                },
                0,
            )
            .to(
                incomingWords,
                {
                    filter: "blur(0px)",
                    opacity: 1,
                    duration: 1.5,
                    ease: "power3.out",
                    stagger: 0.035,
                },
                0.3,
            );

        return () => {
            tl.kill();
        };
    }, [direction, nextIndex]);

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "ArrowRight") navigate("next");
            if (event.key === "ArrowLeft") navigate("prev");
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [navigate]);

    if (slides.length === 0) {
        return null;
    }

    const currentSlide = slides[activeIndex];
    const upcomingSlide = nextIndex !== null ? slides[nextIndex] : null;

    return (
        <section className="pps-shell">
            <style dangerouslySetInnerHTML={{ __html: STYLES }} />
            <svg className="pps-filter-defs" aria-hidden="true" focusable="false">
                <filter id="pps-blur-matrix">
                    <feColorMatrix
                        in="SourceGraphic"
                        type="matrix"
                        values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 255 -140"
                    />
                </filter>
            </svg>
            <div
                ref={rootRef}
                className="pps-stage"
                onTouchStart={(event) => {
                    const t = event.changedTouches[0];
                    if (!t) return;
                    touchStartXRef.current = t.clientX;
                }}
                onTouchEnd={(event) => {
                    const t = event.changedTouches[0];
                    if (!t) return;
                    const deltaX = t.clientX - touchStartXRef.current;
                    if (Math.abs(deltaX) < 45) return;
                    navigate(deltaX < 0 ? "next" : "prev");
                }}
            >
                <div ref={currentLayerRef} className="pps-layer">
                    <img ref={currentImgRef} src={currentSlide.image} alt={currentSlide.title} className="pps-image" />
                </div>

                {upcomingSlide ? (
                    <div ref={nextLayerRef} className="pps-layer pps-layer-next">
                        <img ref={nextImgRef} src={upcomingSlide.image} alt={upcomingSlide.title} className="pps-image" />
                    </div>
                ) : null}

                <div className="pps-title-wrap">
                    <h2 ref={currentTitleRef} className="pps-title">
                        {currentSlide.title.split(" ").map((word, index) => (
                            <span key={`current-${activeIndex}-${index}`} className="word">
                                {word}
                            </span>
                        ))}
                    </h2>
                    {upcomingSlide ? (
                        <h2 ref={nextTitleRef} className="pps-title pps-title-next">
                            {upcomingSlide.title.split(" ").map((word, index) => (
                                <span key={`next-${nextIndex}-${index}`} className="word">
                                    {word}
                                </span>
                            ))}
                        </h2>
                    ) : null}
                </div>

                <div className="pps-controls">
                    <button
                        type="button"
                        className="pps-btn"
                        onClick={() => navigate("prev")}
                        disabled={isAnimating}
                        aria-label="Previous slide"
                    >
                        <svg viewBox="0 -960 960 960" aria-hidden="true">
                            <path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" />
                        </svg>
                    </button>
                    <button
                        type="button"
                        className="pps-btn"
                        onClick={() => navigate("next")}
                        disabled={isAnimating}
                        aria-label="Next slide"
                    >
                        <svg viewBox="0 -960 960 960" aria-hidden="true">
                            <path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z" />
                        </svg>
                    </button>
                </div>

                <div className="pps-counter">
                    {activeIndex + 1} / {slides.length}
                </div>
            </div>
        </section>
    );
}

const STYLES = `
  .pps-shell {
    position: relative;
    width: 100%;
    min-height: 100dvh;
    background: #050505;
  }
  .pps-stage {
    position: relative;
    width: 100%;
    height: 100dvh;
    overflow: hidden;
    background: #050505;
  }
    .pps-filter-defs {
        position: absolute;
        width: 0;
        height: 0;
    }
  .pps-layer {
    position: absolute;
    inset: 0;
  }
  .pps-layer-next {
    z-index: 2;
  }
  .pps-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: brightness(0.84);
    will-change: transform;
  }
  .pps-title-wrap {
    position: absolute;
    top: 50%;
    left: 50%;
        width: min(68%, 980px);
    transform: translate(-50%, -50%);
    text-align: center;
    pointer-events: none;
    z-index: 10;
        filter: url(#pps-blur-matrix) blur(0.25px);
  }
  .pps-title {
    margin: 0;
    text-transform: uppercase;
    color: #ffffff;
    font-family: var(--font-cormorant), serif;
    font-size: clamp(1.8rem, 6vw, 4.8rem);
    letter-spacing: 0.01em;
    line-height: 0.9;
        filter: blur(0px);
    text-wrap: balance;
    text-shadow: 0 12px 34px rgba(0, 0, 0, 0.68);
  }
    .pps-title .word {
        display: inline-block;
        margin: 0 0.18em;
        opacity: 0;
        filter: blur(75px);
        will-change: filter, opacity;
    }
  .pps-title-next {
    position: absolute;
    inset: 0;
  }
  .pps-controls {
    position: absolute;
        top: 50%;
        left: 0;
        width: 100%;
        transform: translateY(-50%);
        padding: 0 2rem;
    display: flex;
        justify-content: space-between;
    z-index: 20;
  }
  .pps-btn {
        width: 64px;
        height: 64px;
        padding: 1.25rem;
        border: 1px dashed rgba(255, 255, 255, 0.5);
        border-radius: 9999px;
        background: transparent;
        color: #ffffff;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease;
  }
  .pps-btn:hover:not(:disabled) {
        background-color: #ffffff;
        color: #000000;
        border-color: #ffffff;
    }
    .pps-btn svg {
        width: 24px;
        height: 24px;
        fill: currentColor;
  }
  .pps-btn:disabled {
    opacity: 0.55;
  }
  .pps-counter {
    position: absolute;
    top: max(106px, calc(env(safe-area-inset-top) + 72px));
    right: clamp(16px, 4vw, 40px);
    z-index: 20;
    color: rgba(227, 228, 224, 0.76);
    text-transform: uppercase;
    font-size: 0.66rem;
    letter-spacing: 0.24em;
  }
  @media (max-width: 900px) {
    .pps-title-wrap {
            width: 100%;
            padding: 0 1.2rem;
    }
    .pps-title {
            font-size: 3rem;
      line-height: 0.95;
    }
        .pps-controls {
            top: 80%;
            padding: 0 2.2rem;
            transform: translateY(-50%);
        }
  }
  @media (max-width: 640px) {
    .pps-controls {
            top: auto;
            bottom: max(18px, env(safe-area-inset-bottom));
            transform: none;
            padding: 0 1rem;
    }
    .pps-btn {
            width: 52px;
            height: 52px;
            padding: 0.75rem;
        }
        .pps-btn svg {
            width: 20px;
            height: 20px;
    }
    .pps-counter {
      top: max(96px, calc(env(safe-area-inset-top) + 60px));
      right: 16px;
      letter-spacing: 0.2em;
    }
        .pps-title {
            font-size: clamp(1.7rem, 9vw, 2.5rem);
            letter-spacing: -0.04rem;
        }
    }
    @media (max-width: 420px) {
        .pps-title-wrap {
            padding: 0 0.75rem;
        }
        .pps-title {
            font-size: clamp(1.45rem, 9vw, 2rem);
        }
  }
`;
