"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ProjectSlide } from "@/lib/projects-data";

type ProjectPerPageSliderProps = {
    slides: ProjectSlide[];
};

export default function ProjectPerPageSlider({ slides }: ProjectPerPageSliderProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const sectionRef = useRef<HTMLElement>(null);
    const titlesTrackRef = useRef<HTMLDivElement>(null);
    const titleRefs = useRef<(HTMLHeadingElement | null)[]>([]);
    const thumbRefs = useRef<(HTMLDivElement | null)[]>([]);
    const activeIndexRef = useRef(0);

    useEffect(() => {
        if (!slides.length) return;
        gsap.registerPlugin(ScrollTrigger);

        const section = sectionRef.current;
        const titlesTrack = titlesTrackRef.current;
        if (!section || !titlesTrack) return;

        const titleElements = titleRefs.current.filter((el): el is HTMLHeadingElement => Boolean(el));
        const thumbElements = thumbRefs.current.filter((el): el is HTMLDivElement => Boolean(el));
        if (!titleElements.length || !thumbElements.length) return;

        const isSmallScreen = () => window.innerWidth <= 768;

        const calculateArcMetrics = () => {
            const containerWidth = window.innerWidth * (isSmallScreen() ? 0.55 : 0.32);
            const containerHeight = window.innerHeight;
            const arcStartX = containerWidth - (isSmallScreen() ? 132 : 220);
            const arcStartY = -180;
            const arcEndY = containerHeight + 180;
            const arcControlPointX = arcStartX + (isSmallScreen() ? 210 : 430);
            const arcControlPointY = containerHeight / 2;

            return { arcStartX, arcStartY, arcEndY, arcControlPointX, arcControlPointY };
        };

        const getBezierPosition = (
            t: number,
            arcMetrics: {
                arcStartX: number;
                arcStartY: number;
                arcEndY: number;
                arcControlPointX: number;
                arcControlPointY: number;
            },
        ) => {
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
            const step = 1 / (slides.length + 1);
            const speed = Math.min(0.36, step * 2.6);
            const startTime = index * step;
            const endTime = startTime + speed;

            if (overallProgress < startTime) return -1;
            if (overallProgress > endTime) return 2;
            return (overallProgress - startTime) / speed;
        };

        gsap.set(thumbElements, { opacity: 0 });
        gsap.set(titleElements[0], { opacity: 1 });

        let arcMetrics = calculateArcMetrics();

        const trigger = ScrollTrigger.create({
            trigger: section,
            start: "top top",
            end: () => `+=${window.innerHeight * 10}px`,
            pin: true,
            pinSpacing: true,
            scrub: 1,
            onUpdate: (self) => {
                const progress = self.progress;

                if (progress <= 0.2) {
                    const introProgress = progress / 0.2;
                    const moveDistance = window.innerWidth * 0.6;
                    gsap.set(".pps-intro-text-left", { x: -introProgress * moveDistance, opacity: 1 });
                    gsap.set(".pps-intro-text-right", { x: introProgress * moveDistance, opacity: 1 });
                    gsap.set(".pps-bg", { transform: `scale(${introProgress})` });
                    gsap.set(".pps-bg img", { transform: `scale(${1.5 - introProgress * 0.5})` });
                    gsap.set(thumbElements, { opacity: 0 });
                    gsap.set(".pps-meta", { opacity: 0 });
                    gsap.set(".pps-titles-shell", { "--before-opacity": "0", "--after-opacity": "0" });
                    return;
                }

                if (progress <= 0.25) {
                    gsap.set(".pps-bg, .pps-bg img", { transform: "scale(1)" });
                    gsap.set(".pps-intro-text-left, .pps-intro-text-right", { opacity: 0 });
                    gsap.set(thumbElements, { opacity: 0 });
                    gsap.set(".pps-meta", { opacity: 1 });
                    gsap.set(".pps-titles-shell", { "--before-opacity": "1", "--after-opacity": "1" });
                    return;
                }

                if (progress <= 0.95) {
                    gsap.set(".pps-meta", { opacity: 1 });
                    gsap.set(".pps-titles-shell", { "--before-opacity": "1", "--after-opacity": "1" });

                    const switchProgress = (progress - 0.25) / 0.7;
                    const viewportHeight = window.innerHeight;
                    const titlesHeight = titlesTrack.scrollHeight;
                    const currentY = viewportHeight - switchProgress * (viewportHeight + titlesHeight);
                    gsap.set(titlesTrack, { transform: `translateY(${currentY}px)` });

                    thumbElements.forEach((img, index) => {
                        const imgProgress = getImgProgressState(index, switchProgress);
                        if (imgProgress < 0 || imgProgress > 1) {
                            gsap.set(img, { opacity: 0 });
                        } else {
                            const pos = getBezierPosition(imgProgress, arcMetrics);
                            gsap.set(img, { x: pos.x - 120, y: pos.y - 84, opacity: 1 });
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

                    if (closestIndex !== activeIndexRef.current) {
                        titleElements[activeIndexRef.current].style.opacity = "0.24";
                        titleElements[closestIndex].style.opacity = "1";
                        activeIndexRef.current = closestIndex;
                        setActiveIndex(closestIndex);
                    }
                    return;
                }

                gsap.set(".pps-meta", { opacity: 0 });
                gsap.set(".pps-titles-shell", { "--before-opacity": "0", "--after-opacity": "0" });
            },
        });

        const onResize = () => {
            arcMetrics = calculateArcMetrics();
            trigger.refresh();
        };

        window.addEventListener("resize", onResize);

        return () => {
            window.removeEventListener("resize", onResize);
            trigger.kill();
        };
    }, [slides]);

    if (slides.length === 0) {
        return null;
    }

    return (
        <section ref={sectionRef} className="pps-shell">
            <style dangerouslySetInnerHTML={{ __html: STYLES }} />
            <div className="pps-stage">
                <div className="pps-intro-text-wrap">
                    <div className="pps-intro-text pps-intro-text-left">
                        <p>Project</p>
                    </div>
                    <div className="pps-intro-text pps-intro-text-right">
                        <p>Frames</p>
                    </div>
                </div>

                <div className="pps-bg">
                    <img
                        src={slides[activeIndex]?.image}
                        alt={slides[activeIndex]?.title ?? "Project image"}
                        loading="eager"
                        decoding="async"
                        fetchPriority="high"
                    />
                </div>

                <div className="pps-titles-shell">
                    <div ref={titlesTrackRef} className="pps-titles-track">
                        {slides.map((slide, index) => (
                            <h2
                                key={`${slide.title}-${index}`}
                                ref={(el) => {
                                    titleRefs.current[index] = el;
                                }}
                                style={{ opacity: index === 0 ? 1 : 0.24 }}
                            >
                                {slide.title}
                            </h2>
                        ))}
                    </div>
                </div>

                <div className="pps-images-track">
                    {slides.map((slide, index) => (
                        <div
                            key={`${slide.image}-${index}`}
                            ref={(el) => {
                                thumbRefs.current[index] = el;
                            }}
                            className="pps-thumb"
                        >
                            <img src={slide.image} alt={slide.title} loading="lazy" decoding="async" />
                        </div>
                    ))}
                </div>

                <div className="pps-meta">
                    <p>Mayaakars</p>
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
    width: 100%;
    background: #050505;
  }
  .pps-stage {
    position: relative;
    width: 100%;
    height: 100dvh;
    overflow: hidden;
        background-color: #050505;
    }
    .pps-intro-text-wrap {
    position: absolute;
    top: 50%;
    display: flex;
        width: 100%;
        transform: translateY(-50%);
        gap: 0.5rem;
        padding: 0 1rem;
        z-index: 5;
    }
    .pps-intro-text {
        flex: 1;
        will-change: transform;
        display: flex;
    }
    .pps-intro-text-left {
        justify-content: flex-end;
    }
    .pps-intro-text-right {
        justify-content: flex-start;
    }
    .pps-intro-text p {
        font-size: clamp(1rem, 3vw, 1.5rem);
        line-height: 1;
        font-weight: 500;
        color: #ffffff;
    }
    .pps-bg {
        position: absolute;
        inset: 0;
        overflow: hidden;
        transform: scale(0);
        will-change: transform;
        z-index: 0;
        pointer-events: none;
    }
    .pps-bg img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transform: scale(1.5);
        will-change: transform;
        opacity: 0.62;
        filter: saturate(1) contrast(1);
    }
    .pps-bg::after {
        content: "";
        position: absolute;
        inset: 0;
        background: radial-gradient(circle at center, rgba(15, 15, 15, 0.08), rgba(15, 15, 15, 0.45) 70%);
    }
    .pps-titles-shell {
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
    .pps-titles-shell::before,
    .pps-titles-shell::after {
        content: "";
        position: absolute;
        width: 100vh;
        height: 2.5px;
        background: #ffffff;
        pointer-events: none;
        transition: opacity 0.3s ease;
        z-index: 10;
    }
    .pps-titles-shell::before {
        top: 0;
        left: 0;
        transform: rotate(-45deg) translate(-7rem);
        opacity: var(--before-opacity);
    }
    .pps-titles-shell::after {
        bottom: 0;
        left: 0;
        transform: rotate(45deg) translate(-7rem);
        opacity: var(--after-opacity);
    }
    .pps-titles-track {
        position: relative;
        left: 15%;
        width: 75%;
        height: 100%;
        display: flex;
        flex-direction: column;
        gap: 4rem;
        transform: translateY(100%);
        z-index: 2;
    }
    .pps-titles-track h2 {
        margin: 0;
        font-family: var(--font-geist), "Geist", sans-serif;
        font-size: clamp(1.3rem, 4.1vw, 2.55rem);
        font-weight: 500;
        line-height: 1;
        letter-spacing: 0.02em;
        text-transform: uppercase;
        color: #ffffff;
        transition: opacity 0.3s ease;
        text-wrap: balance;
        text-shadow: 0 12px 34px rgba(0, 0, 0, 0.58);
    }
    .pps-images-track {
        position: absolute;
        top: 0;
        right: 0;
        width: 52%;
        min-width: 300px;
        height: 100%;
        z-index: 1;
        pointer-events: none;
    }
    .pps-thumb {
        position: absolute;
        width: 240px;
        height: 168px;
        border-radius: 4px;
        overflow: hidden;
        will-change: transform;
        box-shadow: 0 12px 36px rgba(0, 0, 0, 0.32);
    }
    .pps-thumb img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    .pps-meta {
        position: absolute;
        top: 50%;
        left: 10%;
        transform: translateY(-50%);
        z-index: 2;
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    .pps-meta p {
        margin: 0;
        color: #ffffff;
        font-size: clamp(1.1rem, 1.8vw, 1.5rem);
        font-weight: 600;
        letter-spacing: 0.01em;
  }
  .pps-counter {
    position: absolute;
        top: max(94px, calc(env(safe-area-inset-top) + 58px));
        right: clamp(16px, 3.2vw, 42px);
    z-index: 20;
        color: rgba(227, 228, 224, 0.8);
    text-transform: uppercase;
    font-size: 0.66rem;
    letter-spacing: 0.24em;
  }
    @media (max-width: 1000px) {
        .pps-titles-shell {
            clip-path: none;
    }
        .pps-titles-shell::before,
        .pps-titles-shell::after {
            display: none;
    }
        .pps-titles-track {
            left: 0;
            width: 100%;
            padding: 0 1.2rem;
            gap: 2.4rem;
        }
        .pps-meta {
            display: none;
        }
  }
    @media (max-width: 768px) {
        .pps-intro-text-wrap {
            top: 36%;
            gap: 0.2rem;
            justify-content: center;
    }
        .pps-intro-text-left,
        .pps-intro-text-right {
            justify-content: center;
        }
        .pps-intro-text p {
            font-size: clamp(0.9rem, 3.6vw, 1rem);
    }
        .pps-titles-shell {
            left: 0;
            width: 100%;
            padding: 0 1rem;
        }
        .pps-titles-track {
            gap: 1.4rem;
        }
        .pps-titles-track h2 {
            font-size: clamp(1rem, 5vw, 1.35rem);
        }
        .pps-images-track {
            display: none;
    }
    }
    @media (max-width: 480px) {
        .pps-intro-text-wrap {
            top: 34%;
        }
        .pps-counter {
            right: 12px;
            letter-spacing: 0.2em;
        }
  }
`;
