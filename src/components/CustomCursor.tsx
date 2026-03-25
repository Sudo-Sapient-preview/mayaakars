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

        const ringWrapper = document.getElementById("cursor-ring-wrapper");

        if (!ringWrapper) return;

        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;

        const updateTarget = (e: MouseEvent) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            ringWrapper!.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
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

        ringWrapper!.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;

        return () => {
            window.removeEventListener("mousemove", updateTarget as EventListener);
            window.removeEventListener("mousedown", onMouseDown);
            window.removeEventListener("mouseup", onMouseUp);
            document.removeEventListener("mouseover", onMouseOver);
            document.removeEventListener("mouseout", onMouseOut);
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

        #cursor-ring-wrapper {
          position: fixed;
          top: 0;
          left: 0;
          pointer-events: none;
          z-index: 99999;
          will-change: transform;
        }

        #cursor-ring {
          width: 32px;
          height: 32px;
          border: 1.5px solid rgba(10, 10, 10, 0.7);
          box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.55);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          transition: width 0.4s cubic-bezier(0.22, 1, 0.36, 1),
                      height 0.4s cubic-bezier(0.22, 1, 0.36, 1),
                      border-color 0.35s ease,
                      box-shadow 0.35s ease;
        }

        body.cursor-hovering #cursor-ring {
          width: 48px;
          height: 48px;
          border-color: #C49A3A;
          box-shadow: 0 0 0 1px rgba(196, 154, 58, 0.3);
        }

        body.cursor-clicking #cursor-ring {
          width: 22px;
          height: 22px;
          border-color: #C49A3A;
          box-shadow: 0 0 0 1px rgba(196, 154, 58, 0.5);
        }
      `,
                }}
            />

            <div id="cursor-ring-wrapper">
                <div id="cursor-ring" />
            </div>
        </>
    );
}
