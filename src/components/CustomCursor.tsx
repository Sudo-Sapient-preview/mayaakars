"use client";

import { useEffect, useState } from "react";

const PRIMARY_INTERACTIVE_SELECTOR = "[data-interactive]";

const FALLBACK_INTERACTIVE_SELECTOR = [
    "a[href]",
    "button",
    "input",
    "textarea",
    "select",
    "summary",
    "[role='button']",
    "[role='link']",
    "[contenteditable='true']",
    "[tabindex]:not([tabindex='-1'])",
].join(", ");

const CURSOR_IGNORE_SELECTOR = "[data-cursor-ignore]";
const CURSOR_MEDIA_SELECTOR = "[data-cursor-media]";

const getInteractiveTarget = (target: EventTarget | null): Element | null => {
    if (!(target instanceof Element)) return null;
    if (target.closest(CURSOR_IGNORE_SELECTOR)) return null;

    const primaryTarget = target.closest(PRIMARY_INTERACTIVE_SELECTOR);
    const fallbackTarget = target.closest(FALLBACK_INTERACTIVE_SELECTOR);
    const interactiveTarget = primaryTarget ?? fallbackTarget;

    if (!interactiveTarget) return null;
    if (interactiveTarget.closest(CURSOR_IGNORE_SELECTOR)) return null;
    if (interactiveTarget.closest(CURSOR_MEDIA_SELECTOR)) return null;

    return interactiveTarget;
};

export default function CustomCursor() {
    const [enabled, setEnabled] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(pointer: fine)");
        const updateEnabled = () => setEnabled(mediaQuery.matches);

        updateEnabled();
        mediaQuery.addEventListener("change", updateEnabled);

        return () => mediaQuery.removeEventListener("change", updateEnabled);
    }, []);

    useEffect(() => {
        if (!enabled) return;

        const dotWrapper = document.getElementById("cursor-dot-wrapper");
        const ringWrapper = document.getElementById("cursor-ring-wrapper");

        if (!dotWrapper || !ringWrapper) return;

        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let ringX = mouseX;
        let ringY = mouseY;

        const speed = 0.35;

        // Instant tracking for the dot
        const updateTarget = (e: MouseEvent) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            dotWrapper.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
            startAnimate();
        };

        // Click state
        const onMouseDown = () => document.body.classList.add("cursor-clicking");
        const onMouseUp = () => document.body.classList.remove("cursor-clicking");

        // Event delegation — works on dynamically rendered [data-interactive] elements
        const onMouseOver = (e: MouseEvent) => {
            if (getInteractiveTarget(e.target)) {
                document.body.classList.add("cursor-hovering");
            }
        };
        const onMouseOut = (e: MouseEvent) => {
            const currentInteractive = getInteractiveTarget(e.target);
            if (!currentInteractive) return;

            const nextInteractive = getInteractiveTarget(e.relatedTarget);
            if (!nextInteractive) {
                document.body.classList.remove("cursor-hovering");
            }
        };

        window.addEventListener("mousemove", updateTarget as EventListener);
        window.addEventListener("mousedown", onMouseDown);
        window.addEventListener("mouseup", onMouseUp);
        document.addEventListener("mouseover", onMouseOver);
        document.addEventListener("mouseout", onMouseOut);

        // Lerp render loop for the trailing ring — stops when settled
        let animationFrameId: number;
        let rafRunning = false;
        function animate() {
            const dx = mouseX - ringX;
            const dy = mouseY - ringY;
            ringX += dx * speed;
            ringY += dy * speed;
            ringWrapper!.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
            if (Math.abs(dx) < 0.15 && Math.abs(dy) < 0.15) {
                rafRunning = false;
                return;
            }
            animationFrameId = requestAnimationFrame(animate);
        }
        const startAnimate = () => {
            if (rafRunning) return;
            rafRunning = true;
            animationFrameId = requestAnimationFrame(animate);
        };

        dotWrapper.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
        ringWrapper.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;

        return () => {
            window.removeEventListener("mousemove", updateTarget as EventListener);
            window.removeEventListener("mousedown", onMouseDown);
            window.removeEventListener("mouseup", onMouseUp);
            document.removeEventListener("mouseover", onMouseOver);
            document.removeEventListener("mouseout", onMouseOut);
            cancelAnimationFrame(animationFrameId);
            document.body.classList.remove("cursor-hovering", "cursor-clicking");
        };
    }, [enabled]);

    if (!enabled) return null;

    return (
        <>
            <style
                dangerouslySetInnerHTML={{
                    __html: `
                @media (pointer: fine) {
                    body, html, * { cursor: none !important; }
                }

        #cursor-dot-wrapper,
        #cursor-ring-wrapper {
          position: fixed;
          top: 0;
          left: 0;
          pointer-events: none;
          z-index: 99999;
          will-change: transform;
        }

        #cursor-dot {
          width: 6px;
          height: 6px;
          background-color: #fff;
          border-radius: 50%;
          transform: translate(-50%, -50%) scale(1);
          transition: transform 0.2s ease, opacity 0.2s ease;
          box-shadow: 0 0 0 1px rgba(0,0,0,0.25);
        }

        #cursor-ring {
          width: 36px;
          height: 36px;
          border: 1.5px solid rgba(255, 255, 255, 0.55);
          box-shadow: 0 0 0 1px rgba(0,0,0,0.15);
          border-radius: 50%;
          transform: translate(-50%, -50%) scale(1);
          transition: transform 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275),
                      opacity 0.3s ease, border-color 0.3s ease;
        }

        body.cursor-hovering #cursor-dot {
          opacity: 0;
          transform: translate(-50%, -50%) scale(0);
        }

        body.cursor-hovering #cursor-ring {
          transform: translate(-50%, -50%) scale(3.05);
          border-color: rgba(255, 255, 255, 0.25);
        }

        body.cursor-clicking #cursor-ring {
          transform: translate(-50%, -50%) scale(0.7);
        }
      `,
                }}
            />

            <div id="cursor-ring-wrapper">
                <div id="cursor-ring" />
            </div>
            <div id="cursor-dot-wrapper">
                <div id="cursor-dot" />
            </div>
        </>
    );
}
