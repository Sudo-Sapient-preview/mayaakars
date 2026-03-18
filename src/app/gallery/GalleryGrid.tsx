"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import Image from "next/image";
import type { GalleryItem } from "@/lib/gallery-data";

type LightboxState = { images: string[]; index: number } | null;

export default function GalleryGrid({ items }: { items: GalleryItem[] }) {
    const dragContainerRef = useRef<HTMLDivElement>(null);
    const zoomWrapperRef = useRef<HTMLDivElement>(null);
    const sceneWrapperRef = useRef<HTMLDivElement>(null);
    const titleContainerRef = useRef<HTMLDivElement>(null);
    const openLightboxRef = useRef<((id: string) => void) | null>(null);

    const [lightbox, setLightbox] = useState<LightboxState>(null);

    // Expose open function to the imperative effect below
    openLightboxRef.current = (id: string) => {
        const item = items.find((it) => it.id === id);
        if (item) setLightbox({ images: item.images, index: 0 });
    };

    const closeLightbox = useCallback(() => setLightbox(null), []);

    const prev = useCallback(() =>
        setLightbox((lb) => lb && { ...lb, index: (lb.index - 1 + lb.images.length) % lb.images.length }), []);

    const next = useCallback(() =>
        setLightbox((lb) => lb && { ...lb, index: (lb.index + 1) % lb.images.length }), []);

    // Keyboard nav
    useEffect(() => {
        if (!lightbox) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") closeLightbox();
            if (e.key === "ArrowLeft") prev();
            if (e.key === "ArrowRight") next();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [lightbox, closeLightbox, prev, next]);

    useEffect(() => {
        const dragContainer = dragContainerRef.current;
        const zoomWrapper = zoomWrapperRef.current;
        const sceneWrapper = sceneWrapperRef.current;
        const titleContainer = titleContainerRef.current;
        if (!dragContainer || !zoomWrapper || !sceneWrapper || !titleContainer) return;

        const isMobile = window.innerWidth <= 768;
        const numCols = isMobile ? 5 : 7;
        const numRows = isMobile ? 6 : 5;
        const baseSize = isMobile ? window.innerWidth * 0.4 : 320;
        const cellW = baseSize;
        const cellH = baseSize;
        const gridW = numCols * cellW;
        const gridH = numRows * cellH;

        dragContainer.style.width = `${gridW}px`;
        dragContainer.style.height = `${gridH}px`;

        const mScale = isMobile ? 0.6 : 1;
        const sizePresets = [
            { w: 160 * mScale, h: 220 * mScale },
            { w: 240 * mScale, h: 150 * mScale },
            { w: 140 * mScale, h: 260 * mScale },
            { w: 180 * mScale, h: 180 * mScale },
            { w: 110 * mScale, h: 140 * mScale },
            { w: 260 * mScale, h: 320 * mScale },
        ];

        const gridItems: HTMLImageElement[] = [];
        const total = numCols * numRows;

        for (let i = 0; i < total; i += 1) {
            const item = items[i % items.length];

            const img = document.createElement("img");
            img.src = `/thumbs/${item.id}.webp`;
            img.alt = item.title;
            img.decoding = "async";
            img.classList.add("grid-item");
            img.dataset.imageId = item.id;
            img.setAttribute("data-interactive", "true");
            img.draggable = false;

            const preset = sizePresets[Math.floor(Math.random() * sizePresets.length)];
            img.style.width = `${preset.w}px`;
            img.style.height = `${preset.h}px`;

            const r = Math.floor(i / numCols);
            const c = i % numCols;
            const offsetX = (Math.random() - 0.5) * (80 * mScale);
            const offsetY = (Math.random() - 0.5) * (80 * mScale);
            img.style.left = `${c * cellW + cellW / 2 - preset.w / 2 + offsetX}px`;
            img.style.top = `${r * cellH + cellH / 2 - preset.h / 2 + offsetY}px`;

            dragContainer.appendChild(img);
            gridItems.push(img);
        }

        let introFinished = false;
        let rafId = 0;
        let rafRunning = false;
        let mouseMoveRafPending = false;

        const startRaf = () => {
            if (rafRunning) return;
            rafRunning = true;
            rafId = window.requestAnimationFrame(renderLoop);
        };

        const tl = gsap.timeline({
            onComplete: () => {
                introFinished = true;
                gsap.set(gridItems, { clearProps: "transform,opacity" });
                dragContainer.style.transformStyle = "flat";
                gridItems.forEach((img) => img.classList.add("grid-item--ready"));
                startRaf();
            },
        });

        tl.fromTo(titleContainer, { z: -3000, opacity: 0 }, { z: -800, opacity: 0.9, duration: 4, ease: "power3.out" });
        gsap.set(gridItems, { z: () => -3000 - Math.random() * 2000, opacity: 0 });
        tl.to(gridItems, { z: 0, opacity: 1, duration: 4.5, ease: "power3.out", stagger: { amount: 2, from: "center" } }, "-=3.5");

        let currentX = window.innerWidth / 2 - gridW / 2;
        let currentY = window.innerHeight / 2 - gridH / 2;
        let targetX = currentX;
        let targetY = currentY;
        let currentScale = 1;
        let targetScale = 1;
        let isDragging = false;
        let activePointerId: number | null = null;
        let startMouseX = 0;
        let startMouseY = 0;
        let initialTargetX = targetX;
        let initialTargetY = targetY;
        let movedBeyondClickThreshold = false;
        let pendingImageId: string | null = null;
        const clickDragThreshold = 8;

        dragContainer.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;

        const getLimits = () => {
            const paddingX = window.innerWidth * 0.3;
            const paddingY = window.innerHeight * 0.3;
            return {
                minX: Math.min(0, window.innerWidth - gridW - paddingX),
                maxX: paddingX,
                minY: Math.min(0, window.innerHeight - gridH - paddingY),
                maxY: paddingY,
            };
        };

        const getIdFromTarget = (target: EventTarget | null) => {
            if (!(target instanceof Element)) return null;
            return target.closest<HTMLImageElement>(".grid-item[data-image-id]")?.dataset.imageId ?? null;
        };

        const getIdFromPoint = (x: number, y: number) => {
            const hit = document.elementsFromPoint(x, y)
                .find((el) => el instanceof HTMLImageElement && el.matches(".grid-item[data-image-id]"));
            return hit instanceof HTMLImageElement ? hit.dataset.imageId ?? null : null;
        };

        const handleDown = (x: number, y: number, id: string | null, pointerId: number) => {
            isDragging = true;
            activePointerId = pointerId;
            startMouseX = x;
            startMouseY = y;
            initialTargetX = targetX;
            initialTargetY = targetY;
            movedBeyondClickThreshold = false;
            pendingImageId = id;
            document.body.style.cursor = "grabbing";
            startRaf();
        };

        const handleMove = (x: number, y: number, pointerId: number) => {
            if (activePointerId !== pointerId || !isDragging) return;
            if (!movedBeyondClickThreshold &&
                (Math.abs(x - startMouseX) > clickDragThreshold || Math.abs(y - startMouseY) > clickDragThreshold)) {
                movedBeyondClickThreshold = true;
            }
            const zoomMultiplier = isMobile ? 1.5 / targetScale : 1 / targetScale;
            const limits = getLimits();
            targetX = Math.max(limits.minX, Math.min(initialTargetX + (x - startMouseX) * zoomMultiplier * 1.5, limits.maxX));
            targetY = Math.max(limits.minY, Math.min(initialTargetY + (y - startMouseY) * zoomMultiplier * 1.5, limits.maxY));
            startRaf();
        };

        const releaseDrag = (allowClick: boolean, pointerId: number) => {
            if (activePointerId !== pointerId) return;
            if (allowClick && isDragging && !movedBeyondClickThreshold && pendingImageId) {
                openLightboxRef.current?.(pendingImageId);
            }
            isDragging = false;
            activePointerId = null;
            pendingImageId = null;
            document.body.style.cursor = "default";
        };

        const onPointerDown = (e: PointerEvent) => {
            if (e.pointerType === "mouse" && e.button !== 0) return;
            const id = getIdFromPoint(e.clientX, e.clientY) ?? getIdFromTarget(e.target);
            handleDown(e.clientX, e.clientY, id, e.pointerId);
        };

        const onPointerMove = (e: PointerEvent) => handleMove(e.clientX, e.clientY, e.pointerId);
        const onPointerUp = (e: PointerEvent) => releaseDrag(true, e.pointerId);
        const onPointerCancel = (e: PointerEvent) => releaseDrag(false, e.pointerId);
        const onWindowBlur = () => {
            isDragging = false;
            activePointerId = null;
            pendingImageId = null;
            document.body.style.cursor = "default";
        };

        let lastMouseX = 0;
        let lastMouseY = 0;
        const onMouseMoveParallax = (e: MouseEvent) => {
            if (!introFinished || isMobile) return;
            lastMouseX = e.clientX;
            lastMouseY = e.clientY;
            if (mouseMoveRafPending) return;
            mouseMoveRafPending = true;
            window.requestAnimationFrame(() => {
                mouseMoveRafPending = false;
                const xStr = (lastMouseX / window.innerWidth - 0.5) * 2;
                const yStr = (lastMouseY / window.innerHeight - 0.5) * 2;
                gsap.to(sceneWrapper, { rotationY: xStr * 3, rotationX: -yStr * 3, duration: 2, ease: "power2.out" });
                gsap.to(titleContainer, { x: -xStr * 60, y: -yStr * 60, duration: 2, ease: "power2.out" });
            });
        };

        const onWheel = (e: WheelEvent) => {
            if (!introFinished) return;
            targetScale = Math.max(0.85, Math.min(targetScale - e.deltaY * 0.0015, 3));
            startRaf();
        };

        function renderLoop() {
            const dx = targetX - currentX;
            const dy = targetY - currentY;
            const ds = targetScale - currentScale;
            currentX += dx * 0.12;
            currentY += dy * 0.12;
            dragContainer?.style.setProperty("transform", `translate3d(${currentX}px, ${currentY}px, 0)`);
            currentScale += ds * 0.12;
            zoomWrapper?.style.setProperty("transform", `scale(${currentScale})`);
            if (!isDragging && Math.abs(dx) < 0.15 && Math.abs(dy) < 0.15 && Math.abs(ds) < 0.001) {
                rafRunning = false;
                rafId = 0;
                return;
            }
            rafId = window.requestAnimationFrame(renderLoop);
        }

        window.addEventListener("mousemove", onMouseMoveParallax);
        window.addEventListener("wheel", onWheel, { passive: true });
        window.addEventListener("pointerdown", onPointerDown);
        window.addEventListener("pointermove", onPointerMove);
        window.addEventListener("pointerup", onPointerUp);
        window.addEventListener("pointercancel", onPointerCancel);
        window.addEventListener("blur", onWindowBlur);

        return () => {
            window.removeEventListener("mousemove", onMouseMoveParallax);
            window.removeEventListener("wheel", onWheel);
            window.removeEventListener("pointerdown", onPointerDown);
            window.removeEventListener("pointermove", onPointerMove);
            window.removeEventListener("pointerup", onPointerUp);
            window.removeEventListener("pointercancel", onPointerCancel);
            window.removeEventListener("blur", onWindowBlur);
            window.cancelAnimationFrame(rafId);
            tl.kill();
            gsap.killTweensOf([sceneWrapper, titleContainer, ...gridItems]);
            dragContainer.innerHTML = "";
            document.body.style.cursor = "";
        };
    }, [items]);

    return (
        <>
            <style>{`
        .mk-gallery-page {
          position: fixed; inset: 0; width: 100%; height: 100%;
          background-color: #050505;
          overflow: hidden; user-select: none; -webkit-user-select: none;
        }
        .mk-gallery-page #viewport {
          position: relative; width: 100vw; height: 100vh;
          perspective: 2000px; overflow: hidden;
        }
        .mk-gallery-page #title-container {
          position: absolute; top: 50%; left: 50%;
          transform-style: preserve-3d; z-index: 1; text-align: center;
        }
        .mk-gallery-page #title {
          position: absolute; transform: translate(-50%, -50%);
          font-family: "Cormorant Garamond", serif;
          font-size: clamp(4rem, 8vw, 10rem);
          font-weight: 300; font-style: italic; letter-spacing: 0.05em;
          color: #e3e4e0; pointer-events: none; margin: 0;
          white-space: nowrap; text-shadow: 0 10px 40px rgba(0,0,0,0.8);
        }
        .mk-gallery-page #zoom-wrapper {
          width: 100%; height: 100%; position: absolute;
          transform-origin: center center; transform-style: preserve-3d; z-index: 5;
          will-change: transform;
        }
        .mk-gallery-page #scene-wrapper {
          width: 100%; height: 100%; position: absolute; transform-style: preserve-3d;
          will-change: transform;
        }
        .mk-gallery-page #drag-container {
          position: absolute; top: 0; left: 0;
          transform-style: preserve-3d; cursor: grab; touch-action: none;
          will-change: transform;
        }
        .mk-gallery-page #drag-container:active { cursor: grabbing; }
        .mk-gallery-page .grid-item {
          position: absolute; object-fit: cover;
          box-shadow: 0 15px 40px rgba(0,0,0,0.4);
          pointer-events: auto; -webkit-user-drag: none;
          background-color: #111; color: transparent; border-radius: 4px;
        }
        .mk-gallery-page .grid-item--ready {
          transition: transform 0.45s cubic-bezier(0.16,1,0.3,1), opacity 0.35s ease;
          opacity: 0.75;
        }
        .mk-gallery-page .grid-item--ready:hover { transform: scale(1.03); z-index: 100; opacity: 1; }
        @media (max-width: 768px) { .mk-gallery-page #title { font-size: 12vw; } }
        @media (max-width: 480px) { .mk-gallery-page #title { font-size: 14vw; } }

        /* Lightbox */
        .mk-lb-backdrop {
          position: fixed; inset: 0; z-index: 9999;
          background: rgba(5,5,5,0.96);
          display: flex; align-items: center; justify-content: center;
          animation: lb-in 0.25s ease;
        }
        @keyframes lb-in { from { opacity: 0 } to { opacity: 1 } }
        .mk-lb-img-wrap {
          position: relative;
          max-width: min(92vw, 1200px);
          max-height: 88vh;
          display: flex; align-items: center; justify-content: center;
        }
        .mk-lb-img {
          max-width: 100%; max-height: 88vh;
          object-fit: contain; border-radius: 2px;
          animation: lb-img-in 0.3s cubic-bezier(0.22,1,0.36,1);
        }
        @keyframes lb-img-in { from { opacity:0; transform: scale(0.97) } to { opacity:1; transform: scale(1) } }
        .mk-lb-btn {
          position: fixed; top: 20px; right: 24px;
          width: 40px; height: 40px; border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.18);
          background: transparent; color: #e3e4e0;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: border-color 0.2s, background 0.2s;
          z-index: 10000;
        }
        .mk-lb-btn:hover { border-color: rgba(255,255,255,0.5); background: rgba(255,255,255,0.08); }
        .mk-lb-arrow {
          position: fixed; top: 50%; transform: translateY(-50%);
          width: 44px; height: 44px; border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.15);
          background: transparent; color: #e3e4e0;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: border-color 0.2s, background 0.2s;
          z-index: 10000;
        }
        .mk-lb-arrow:hover { border-color: rgba(196,154,58,0.6); background: rgba(196,154,58,0.08); }
        .mk-lb-arrow-left { left: 20px; }
        .mk-lb-arrow-right { right: 20px; }
        .mk-lb-counter {
          position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
          font-family: var(--font-geist-sans), sans-serif;
          font-size: 0.7rem; letter-spacing: 0.2em; color: rgba(255,255,255,0.35);
          z-index: 10000;
        }
      `}</style>

            <main className="mk-gallery-page">
                <div id="viewport">
                    <div id="title-container" ref={titleContainerRef}>
                        <h1 id="title">Gallery</h1>
                    </div>
                    <div id="zoom-wrapper" ref={zoomWrapperRef}>
                        <div id="scene-wrapper" ref={sceneWrapperRef}>
                            <div id="drag-container" ref={dragContainerRef} />
                        </div>
                    </div>
                </div>
            </main>

            {lightbox && (
                <div className="mk-lb-backdrop" onClick={closeLightbox}>
                    {/* Close */}
                    <button className="mk-lb-btn" onClick={closeLightbox} aria-label="Close">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                    </button>

                    {/* Prev */}
                    {lightbox.images.length > 1 && (
                        <button className="mk-lb-arrow mk-lb-arrow-left" onClick={(e) => { e.stopPropagation(); prev(); }} aria-label="Previous">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    )}

                    {/* Image */}
                    <div className="mk-lb-img-wrap" onClick={(e) => e.stopPropagation()}>
                        <Image
                            key={lightbox.images[lightbox.index]}
                            src={lightbox.images[lightbox.index]}
                            alt=""
                            width={1200}
                            height={800}
                            className="mk-lb-img"
                            priority
                        />
                    </div>

                    {/* Next */}
                    {lightbox.images.length > 1 && (
                        <button className="mk-lb-arrow mk-lb-arrow-right" onClick={(e) => { e.stopPropagation(); next(); }} aria-label="Next">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <path d="M5 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    )}

                    {/* Counter */}
                    {lightbox.images.length > 1 && (
                        <span className="mk-lb-counter">
                            {lightbox.index + 1} / {lightbox.images.length}
                        </span>
                    )}
                </div>
            )}
        </>
    );
}
