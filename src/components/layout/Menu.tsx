"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";

const COL1 = [
    { label: "About", href: "/about" },
    { label: "Projects", href: "/projects" },
    { label: "Services", href: "/services" },
    { label: "Gallery", href: "/gallery" },
];
const COL2 = [
    { label: "Journal", href: "/journal" },
    { label: "Contact", href: "/contact" },
    { label: "Careers", href: "/careers" },
];

export default function Menu({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}) {
    const menuRef = useRef<HTMLDivElement>(null);
    const tlRef = useRef<gsap.core.Timeline | null>(null);
    const easeReady = useRef(false);

    useEffect(() => {
        if (!menuRef.current) return;

        if (!easeReady.current) {
            gsap.registerPlugin(CustomEase);
            CustomEase.create("hop", "0.85, 0, 0.15, 1");
            easeReady.current = true;
        }

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ paused: true });

            tl.to(
                ".menu-bg-left-inner",
                { rotate: 0, duration: 1.2, ease: "hop" },
                0
            )
                .to(
                    ".menu-bg-right-inner",
                    { rotate: 0, duration: 1.2, ease: "hop" },
                    0
                )
                .to(
                    ".menu-col-1 .line",
                    { y: 0, duration: 0.8, ease: "power3.out", stagger: 0.05 },
                    0.6
                )
                .to(
                    ".menu-col-2 .line",
                    { y: 0, duration: 0.8, ease: "power3.out", stagger: 0.05 },
                    "<"
                )
                .to(
                    ".menu-footer .line",
                    { y: 0, duration: 0.8, ease: "power3.out", stagger: 0.05 },
                    "<"
                );

            tlRef.current = tl;
        }, menuRef);

        gsap.set(menuRef.current, { autoAlpha: 0 });

        return () => ctx.revert();
    }, []);

    useEffect(() => {
        const tl = tlRef.current;
        const menuEl = menuRef.current;
        if (!menuEl) return;

        if (!tl) {
            gsap.set(menuEl, { autoAlpha: isOpen ? 1 : 0 });
            return;
        }

        if (isOpen) {
            tl.eventCallback("onReverseComplete", null);
            gsap.set(menuEl, { autoAlpha: 1 });
            tl.play();
        } else {
            tl.eventCallback("onReverseComplete", () => {
                if (menuRef.current) {
                    gsap.set(menuRef.current, { autoAlpha: 0 });
                }
            });
            tl.reverse();
        }

        return () => {
            tl.eventCallback("onReverseComplete", null);
        };
    }, [isOpen]);

    return (
        <div
            ref={menuRef}
            aria-hidden={!isOpen}
            className={`fixed inset-0 w-full h-dvh overflow-hidden ${
                isOpen ? "pointer-events-auto" : "pointer-events-none"
            }`}
            style={{ zIndex: 200, opacity: 0, visibility: "hidden" }}
        >
            <div className="absolute inset-0">
                <div className="menu-bg-left absolute left-0 top-0 w-1/2 h-full overflow-hidden max-[1000px]:w-full">
                    <div
                        className="menu-bg-left-inner absolute inset-0 will-change-transform"
                        style={{
                            backgroundColor: "#e5e3d9",
                            transformOrigin: "100% 50%",
                            transform: "rotate(180deg) scale(2, 2)",
                        }}
                    />
                </div>
                <div className="menu-bg-right absolute right-0 top-0 w-1/2 h-full overflow-hidden max-[1000px]:hidden">
                    <div
                        className="menu-bg-right-inner absolute inset-0 will-change-transform"
                        style={{
                            backgroundColor: "#e5e3d9",
                            transformOrigin: "0% 50%",
                            transform: "rotate(-180deg) scale(2, 2)",
                        }}
                    />
                </div>
            </div>

            <div
                className="menu-items absolute inset-0 flex gap-[clamp(2rem,4vw,4.5rem)] max-[1000px]:flex-col-reverse max-[1000px]:gap-14 max-[480px]:gap-10 overflow-y-auto"
                style={{
                    zIndex: 6,
                    paddingTop: "max(7rem, env(safe-area-inset-top))",
                    paddingBottom: "max(6.5rem, env(safe-area-inset-bottom))",
                    paddingLeft: "clamp(1.5rem, 6vw, 3rem)",
                    paddingRight: "clamp(1.5rem, 6vw, 3rem)",
                }}
            >
                <div className="menu-col-1 flex-1 flex flex-col justify-center items-center gap-18 max-[1000px]:items-start max-[1000px]:gap-7">
                    {COL1.map((item) => (
                        <div key={item.label} className="menu-link overflow-hidden">
                            <Link
                                href={item.href}
                                data-interactive
                                data-route-transition="false"
                                onClick={onClose}
                                className="uppercase font-medium tracking-[0.05em] text-black no-underline leading-none block"
                                style={{ fontSize: "clamp(3.2rem, 6.4vw, 9rem)" }}
                            >
                                <span className="line block translate-y-[110%] will-change-transform">
                                    {item.label}
                                </span>
                            </Link>
                        </div>
                    ))}
                </div>

                <div className="menu-col-2 flex-1 flex flex-col justify-center items-center gap-18 max-[1000px]:items-start max-[1000px]:gap-7">
                    {COL2.map((item) => (
                        <div key={item.label} className="menu-link overflow-hidden">
                            <Link
                                href={item.href}
                                data-interactive
                                data-route-transition="false"
                                onClick={onClose}
                                className="font-display italic text-black no-underline leading-none block"
                                style={{ fontSize: "clamp(2.9rem, 5.3vw, 7.2rem)" }}
                            >
                                <span className="line block translate-y-[110%] will-change-transform">
                                    {item.label}
                                </span>
                            </Link>
                        </div>
                    ))}
                </div>

                <div
                    className="menu-footer absolute bottom-0 left-0 w-full flex items-end max-[1000px]:static max-[1000px]:mt-3 max-[1000px]:p-0 max-[1000px]:items-start"
                    style={{ padding: "2.5rem clamp(1.5rem, 6vw, 3rem)" }}
                >
                    <div className="flex gap-12 max-[1000px]:flex-col max-[1000px]:gap-3">
                        {[
                            { label: "Privacy", href: "/privacy" },
                            { label: "Terms", href: "/terms" },
                            { label: "Disclaimer", href: "/disclaimer" },
                        ].map((item) => (
                            <div key={item.label} className="menu-link overflow-hidden">
                                <Link
                                    href={item.href}
                                    data-interactive
                                    data-route-transition="false"
                                    onClick={onClose}
                                    className="menu-footer-link uppercase text-xl text-black no-underline leading-none block"
                                >
                                    <span className="line block translate-y-[110%] will-change-transform">
                                        {item.label}
                                    </span>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
