"use client";

import { useEffect, useRef, useState } from "react";
import type { ProjectCategory } from "@/lib/projects-data";
import { useRouteTransition } from "@/components/navigation/RouteTransitionProvider";

export default function ProjectsCarousel() {
    const [isMobile, setIsMobile] = useState(false);
    const [projects, setProjects] = useState<ProjectCategory[]>([]);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth <= 768);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    useEffect(() => {
        fetch("/api/projects")
            .then((r) => r.json())
            .then(setProjects)
            .catch(console.error);
    }, []);

    if (!projects.length) return null;

    return isMobile ? (
        <MobileCarousel projects={projects} />
    ) : (
        <DesktopCarousel projects={projects} />
    );
}

function DesktopCarousel({ projects }: { projects: ProjectCategory[] }) {
    // Tunables that control how snappy the drag feels
    const ROTATION_PER_PX = 0.28; // deg moved per px dragged (higher = faster)
    const ROTATION_SMOOTHING = 0.12; // how quickly currentRotation approaches targetRotation

    const [activeIndex, setActiveIndex] = useState(0);
    const lastActiveRef = useRef(0);
    const numCards = projects.length;
    const theta = 360 / numCards;

    const sceneRef = useRef<HTMLDivElement>(null);
    const carouselRef = useRef<HTMLDivElement>(null);
    const { navigate } = useRouteTransition();
    const stateRef = useRef({
        isDragging: false,
        startX: 0,
        dragDistance: 0,
        targetRotation: 0,
        currentRotation: 0,
    });
    const triggeredRef = useRef(false);

    const handleNavClick = (index: number) => {
        const s = stateRef.current;
        triggeredRef.current = true;
        s.targetRotation = -index * theta;
        // nudge so easing starts immediately
        s.currentRotation += (s.targetRotation - s.currentRotation) * 0.2;
    };

    useEffect(() => {
        const scene = sceneRef.current;
        const carousel = carouselRef.current;
        if (!scene || !carousel) return;

        const layoutTuning =
            numCards <= 5
                ? { vrRadius: 760, carouselDepth: 120, compactScene: true }
                : numCards <= 7
                    ? { vrRadius: 900, carouselDepth: 240, compactScene: false }
                    : { vrRadius: 1000, carouselDepth: 350, compactScene: false };
        const { vrRadius, carouselDepth, compactScene } = layoutTuning;
        scene.classList.toggle("pc-scene-compact", compactScene);
        const cards = Array.from(carousel.querySelectorAll<HTMLElement>(".pc-card"));
        const s = stateRef.current;

        const onPointerDown = (e: PointerEvent) => {
            if (e.button !== 0) return;
            s.isDragging = true;
            s.startX = e.clientX;
            s.dragDistance = 0;
        };

        const onPointerMove = (e: PointerEvent) => {
            if (!s.isDragging) return;
            const deltaX = e.clientX - s.startX;
            s.targetRotation -= deltaX * ROTATION_PER_PX;
            s.dragDistance += Math.abs(deltaX);
            s.startX = e.clientX;
        };

        const onPointerUp = (e: PointerEvent) => {
            const wasDragging = s.isDragging;
            s.isDragging = false;

            if (!wasDragging || s.dragDistance >= 10) return;

            const target = e.target as HTMLElement | null;
            const card = target?.closest<HTMLElement>(".pc-card");
            const slug = card?.dataset.slug;
            if (slug) {
                navigate(`/projects/${slug}`);
            }
        };


        scene.addEventListener("pointerdown", onPointerDown);
        window.addEventListener("pointermove", onPointerMove);
        window.addEventListener("pointerup", onPointerUp);

        const observer = new IntersectionObserver(
            (entries) => {
                if (triggeredRef.current) return;
                if (entries[0]?.isIntersecting) {
                    triggeredRef.current = true;
                    s.currentRotation = -360;
                    s.targetRotation = 0;
                    observer.disconnect();
                }
            },
            { threshold: 0.35 }
        );
        observer.observe(scene);

        let raf = 0;
        const animate = () => {
            s.currentRotation += (s.targetRotation - s.currentRotation) * ROTATION_SMOOTHING;
            carousel.style.transform = `translateZ(${carouselDepth}px) rotateX(-5deg) rotateY(${s.currentRotation}deg)`;

            let closestIndex = 0;
            let minDist = 9999;

            cards.forEach((card, index) => {
                const cardAngle = index * theta;
                card.style.transform = `rotateY(${cardAngle}deg) translateZ(${-vrRadius}px)`;

                const relativeAngle = (cardAngle + s.currentRotation) % 360;
                let normalizedAngle = relativeAngle;
                if (normalizedAngle < 0) normalizedAngle += 360;
                let distFromCenter = normalizedAngle;
                if (distFromCenter > 180) distFromCenter = 360 - distFromCenter;

                const cosValue = Math.cos((distFromCenter * Math.PI) / 180);
                const intensity = Math.pow(Math.max(0, cosValue), 6);

                if (distFromCenter < minDist) {
                    minDist = distFromCenter;
                    closestIndex = index;
                }

                card.style.opacity = String(0.3 + 0.7 * intensity);
                card.style.filter = `grayscale(${80 - intensity * 80}%) brightness(${0.5 + intensity * 0.5})`;

                const infoBox = card.querySelector<HTMLElement>(".pc-card-info");
                if (!infoBox) return;
                infoBox.style.opacity = String(Math.pow(intensity, 2));
                const yOffset = (1 - intensity) * 40;
                infoBox.style.transform = `translateY(${yOffset}px)`;
            });

            if (closestIndex !== lastActiveRef.current) {
                lastActiveRef.current = closestIndex;
                setActiveIndex(closestIndex);
            }

            raf = requestAnimationFrame(animate);
        };
        raf = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(raf);
            observer.disconnect();
            scene.classList.remove("pc-scene-compact");
            scene.removeEventListener("pointerdown", onPointerDown);
            window.removeEventListener("pointermove", onPointerMove);
            window.removeEventListener("pointerup", onPointerUp);
        };
    }, [navigate, projects, theta]);

    return (
        <section className="mk-home-dark-section relative z-[2]">
            <style dangerouslySetInnerHTML={{ __html: DESKTOP_STYLES }} />
            <div className="mk-home-dark-texture" />

            <div ref={sceneRef} className="pc-scene relative z-[1]">
                <div ref={carouselRef} className="pc-carousel">
                    {projects.map((project) => (
                        <div
                            key={project.slug}
                            className="pc-card"
                            data-slug={project.slug}
                            role="button"
                            aria-label={`Open ${project.title}`}
                            tabIndex={0}
                        >
                            <img src={project.coverImage} alt={project.title} draggable={false} loading="lazy" decoding="async" />
                            <div className="pc-card-info">
                                <div className="pc-card-title">{project.title}</div>
                                <div className="pc-card-subtitle">View Project</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="pc-nav-wrap" aria-hidden={projects.length <= 1}>
                <div className="pc-nav" role="tablist" aria-label="Project selector">
                    {projects.map((project, index) => (
                        <button
                            key={project.slug}
                            className={`pc-nav-segment ${index === activeIndex ? "is-active" : ""}`}
                            aria-label={`Jump to ${project.title}`}
                            aria-pressed={index === activeIndex}
                            onClick={() => handleNavClick(index)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

function MobileCarousel({ projects }: { projects: ProjectCategory[] }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const touchRef = useRef({ startX: 0, startY: 0, isSwipe: false });
    const { navigate } = useRouteTransition();

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        let raf = 0;
        const animate = () => {
            const containerCenter = container.scrollLeft + window.innerWidth / 2;
            const cards = Array.from(container.querySelectorAll<HTMLElement>(".pc-mob-card"));

            cards.forEach((card) => {
                const cardCenter = card.offsetLeft + card.offsetWidth / 2;
                const distFromCenter = Math.abs(containerCenter - cardCenter);
                const maxDist = window.innerWidth;
                let intensity = 1 - distFromCenter / maxDist;
                if (intensity < 0) intensity = 0;
                intensity = Math.pow(intensity, 1.2);

                const inner = card.querySelector<HTMLElement>(".pc-mob-inner");
                const img = card.querySelector<HTMLImageElement>("img");
                const info = card.querySelector<HTMLElement>(".pc-mob-info");

                if (inner) {
                    const scale = 0.85 + 0.15 * intensity;
                    inner.style.transform = `scale(${scale})`;
                }
                if (img) {
                    img.style.filter = `grayscale(${80 - intensity * 80}%) brightness(${0.5 + intensity * 0.5})`;
                    const flexDist = cardCenter - containerCenter;
                    const parallax = flexDist * 0.25;
                    img.style.transform = `translateX(${parallax}px) scale(1.15)`;
                }
                if (info) {
                    info.style.opacity = String(Math.pow(intensity, 2));
                    const yOffset = (1 - intensity) * 50;
                    info.style.transform = `translateY(${yOffset}px)`;
                }
            });

            raf = requestAnimationFrame(animate);
        };
        raf = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(raf);
    }, []);

    return (
        <section className="mk-home-dark-section relative z-[2]">
            <style dangerouslySetInnerHTML={{ __html: MOBILE_STYLES }} />
            <div className="mk-home-dark-texture" />

            <div
                ref={containerRef}
                className="pc-mob-container relative z-[1]"
                onTouchStart={(event) => {
                    const touch = event.touches[0];
                    if (!touch) return;
                    touchRef.current.startX = touch.clientX;
                    touchRef.current.startY = touch.clientY;
                    touchRef.current.isSwipe = false;
                }}
                onTouchMove={(event) => {
                    const touch = event.touches[0];
                    if (!touch) return;
                    const deltaX = Math.abs(touch.clientX - touchRef.current.startX);
                    const deltaY = Math.abs(touch.clientY - touchRef.current.startY);
                    if (deltaX > 12 || deltaY > 10) {
                        touchRef.current.isSwipe = true;
                    }
                }}
            >
                {projects.map((project, index) => (
                    <div
                        key={project.slug}
                        className="pc-mob-card"
                        role="button"
                        aria-label={`Open ${project.title}`}
                        tabIndex={0}
                        onClick={() => {
                            if (touchRef.current.isSwipe) return;
                            navigate(`/projects/${project.slug}`);
                        }}
                    >
                        <div className="pc-mob-inner">
                            <img src={project.coverImage} alt={project.title} draggable={false} loading="lazy" decoding="async" />
                            <div className="pc-mob-info">
                                <div className="pc-mob-title">{project.title}</div>
                                <div className="pc-mob-subtitle">View Project</div>
                            </div>
                            {index === 0 ? <div className="pc-scroll-hint">Swipe Left -&gt;</div> : null}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

const DESKTOP_STYLES = `
  .pc-scene {
    width: 100vw;
    height: 100dvh;
    display: flex;
    justify-content: center;
    align-items: center;
    perspective: 1200px;
    overflow: hidden;
    cursor: grab;
    user-select: none;
    -webkit-user-select: none;
  }
  .pc-scene.pc-scene-compact {
    height: 88dvh;
  }
  .pc-carousel {
    position: relative;
    width: 0;
    height: 0;
    transform-style: preserve-3d;
  }
  .pc-card {
    position: absolute;
    width: min(800px, 85vw);
    height: calc(min(800px, 85vw) * 0.625);
    top: calc(min(800px, 85vw) * 0.625 / -2);
    left: calc(min(800px, 85vw) / -2);
    border-radius: 16px;
    background: transparent;
    box-shadow: 0 30px 60px rgba(0, 0, 0, 0.9);
    backface-visibility: hidden;
    cursor: pointer;
    -webkit-box-reflect: below 14px linear-gradient(transparent, transparent 44%, rgba(255, 255, 255, 0.1));
  }
  .pc-card img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    pointer-events: none;
    border-radius: 16px;
  }
  .pc-card-info {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    padding: 24px 0 0 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 8px;
    pointer-events: none;
  }
  .pc-card-title {
    font-size: 20px;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: #fff;
  }
  .pc-card-subtitle {
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.6);
  }
  .pc-nav-wrap {
    position: absolute;
    inset: auto 0 clamp(22px, 5vw, 42px);
    display: flex;
    justify-content: center;
    pointer-events: none;
    z-index: 4;
  }
  .pc-nav {
    display: flex;
    gap: 12px;
    align-items: center;
    pointer-events: auto;
  }
  .pc-nav-segment {
    width: clamp(32px, 7vw, 64px);
    height: 4px;
    border-radius: 0;
    background: rgba(255, 255, 255, 0.35);
    border: none;
    cursor: pointer;
    opacity: 0.65;
    transition: background 0.25s ease, transform 0.25s ease, width 0.25s ease, height 0.25s ease, opacity 0.25s ease;
  }
  .pc-nav-segment.is-active {
    background: #ffffff;
    width: clamp(58px, 11vw, 110px);
    height: 9px;
    opacity: 1;
    transform: translateY(-1px);
  }
  .pc-nav-segment:focus-visible {
    outline: 2px solid #ffffff;
    outline-offset: 4px;
  }
`;

const MOBILE_STYLES = `
  .pc-mob-container {
    display: flex;
    width: 100vw;
    height: 82dvh;
    overflow-x: scroll;
    overflow-y: hidden;
    scroll-snap-type: x mandatory;
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .pc-mob-container::-webkit-scrollbar {
    display: none;
  }
  .pc-mob-card {
    flex-shrink: 0;
    width: 100vw;
    height: 82dvh;
    scroll-snap-align: start;
    scroll-snap-stop: always;
    position: relative;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .pc-mob-inner {
    width: 85vw;
    height: calc(85vw * 0.625);
    margin-top: -8vh;
    position: relative;
    background: transparent;
    will-change: transform;
    -webkit-box-reflect: below 25px linear-gradient(transparent, transparent 50%, rgba(255, 255, 255, 0.15));
  }
  @media (max-width: 480px) {
    .pc-mob-container,
    .pc-mob-card {
      height: 78dvh;
    }
    .pc-mob-inner {
      margin-top: -6vh;
    }
  }
  .pc-mob-inner img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 16px;
    filter: brightness(0.7);
    will-change: transform, filter;
    transition: opacity 0.3s ease;
  }
  .pc-mob-card:active .pc-mob-inner img {
    opacity: 0.8 !important;
  }
  .pc-mob-info {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    padding: 24px 0 0 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 8px;
    pointer-events: none;
    will-change: transform, opacity;
  }
  .pc-mob-title {
    font-size: clamp(1.25rem, 5.8vw, 1.8rem);
    font-weight: 800;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: #fff;
  }
  .pc-mob-subtitle {
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.6);
  }
  .pc-scroll-hint {
    position: absolute;
    bottom: -80px;
    right: 0;
    color: rgba(255, 255, 255, 0.4);
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 2px;
    animation: pcPulseHint 2s infinite ease-in-out;
    pointer-events: none;
    z-index: 10;
  }
  @keyframes pcPulseHint {
    0%,
    100% {
      opacity: 0.3;
      transform: translateX(0);
    }
    50% {
      opacity: 0.8;
      transform: translateX(-5px);
    }
  }
`;
