"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Menu from "./Menu";

const BRAND_NAME = "Mayaakars";

interface NavbarProps {
    variant?: "dark" | "light";
}

export default function Navbar({ variant }: NavbarProps) {
    const pathname = usePathname();
    const isHomeRoute = pathname === "/";
    const [menuOpen, setMenuOpen] = useState(false);
    const [homeIntroComplete, setHomeIntroComplete] = useState(false);
    const [navbarVariant, setNavbarVariant] = useState<"dark" | "light">("dark");

    /* Home route waits for intro completion; other routes always show brand */
    useEffect(() => {
        if (!isHomeRoute) {
            return;
        }

        const onIntroComplete = () => setHomeIntroComplete(true);
        window.addEventListener("mayaakars:intro-complete", onIntroComplete);

        let rafId: number | null = null;
        if (document.documentElement.getAttribute("data-intro-complete") === "true") {
            rafId = window.requestAnimationFrame(onIntroComplete);
        }

        return () => {
            window.removeEventListener("mayaakars:intro-complete", onIntroComplete);
            if (rafId !== null) {
                window.cancelAnimationFrame(rafId);
            }
        };
    }, [isHomeRoute]);

    /* Check for navbar variant on body */
    useEffect(() => {
        const checkVariant = () => {
            const bodyVariant = document.body.getAttribute("data-navbar-variant");
            setNavbarVariant(bodyVariant === "light" ? "light" : "dark");
        };
        checkVariant();
        const observer = new MutationObserver(checkVariant);
        observer.observe(document.body, { attributes: true, attributeFilter: ["data-navbar-variant"] });
        return () => observer.disconnect();
    }, []);

    /* Adaptive foreground: dark text on light bg or open menu, white on dark page */
    const effectiveVariant = variant || navbarVariant;
    const fgColor = menuOpen ? "text-black" : effectiveVariant === "light" ? "text-black" : "text-white";
    const brandVisible = !isHomeRoute || homeIntroComplete;

    return (
        <>
            <nav
                data-menu-open={menuOpen}
                className="fixed top-0 left-0 w-full flex items-center justify-between px-10 py-10 max-[480px]:px-4 max-[480px]:py-5"
                style={{ zIndex: 300, paddingTop: "max(1.5rem, env(safe-area-inset-top))" }}
            >
                {/* Left — empty spacer */}
                <div className="flex-1" />

                {/* Center — brand slot used by intro docking animation */}
                <div className="flex-1 flex items-center justify-center">
                    <Link
                        href="/"
                        data-interactive
                        onClick={() => setMenuOpen(false)}
                        data-navbar-brand-slot
                        className={`relative inline-flex items-center justify-center gap-2 sm:gap-4 transition-opacity duration-300 ${
                            brandVisible ? "opacity-100" : "opacity-0"
                        }`}
                        aria-hidden={!brandVisible}
                    >
                        <img
                            src="/logo-gold.webp"
                            alt="Mayaakars logo"
                            className="h-7 w-7 object-contain max-[360px]:h-6 max-[360px]:w-6 sm:h-10 sm:w-10"
                            draggable={false}
                        />
                        <h1 className={`whitespace-nowrap font-serif text-[14px] uppercase leading-none tracking-[0.12em] max-[360px]:text-[13px] sm:text-[22px] sm:tracking-[0.15em] ${fgColor}`}>
                            {BRAND_NAME.split("").map((char, index) => (
                                <span key={`${char}-${index}`} className="inline-block" aria-hidden="true">
                                    {char}
                                </span>
                            ))}
                            <span className="sr-only">{BRAND_NAME}</span>
                        </h1>
                    </Link>
                </div>

                {/* Right — hamburger / close */}
                <div className="flex-1 flex items-center justify-end">
                    <button
                        type="button"
                        data-interactive
                        onClick={() => setMenuOpen((prev) => !prev)}
                        className={`flex items-center justify-center transition-colors duration-300 hover:opacity-70 bg-transparent border-none cursor-none ${fgColor}`}
                        aria-label={menuOpen ? "Close menu" : "Open menu"}
                    >
                        {menuOpen ? (
                            /* X icon */
                            <svg
                                width="28"
                                height="28"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        ) : (
                            /* Hamburger icon */
                            <svg
                                width="28"
                                height="28"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <line x1="4" y1="12" x2="20" y2="12" />
                                <line x1="4" y1="6" x2="20" y2="6" />
                                <line x1="4" y1="18" x2="20" y2="18" />
                            </svg>
                        )}
                    </button>
                </div>
            </nav>

            <Menu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
        </>
    );
}
