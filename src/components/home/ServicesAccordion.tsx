"use client";

import { useState, useCallback } from "react";
import { SERVICES } from "@/lib/services-data";
import { useRouteTransition } from "@/components/navigation/RouteTransitionProvider";

const STRIPS = SERVICES.map((service) => ({
    subtitle: service.subtitle,
    title: service.title,
    slug: service.slug,
    bg:
        service.images[0]?.src ??
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=80",
}));

type ServicesAccordionProps = {
    touchPreview?: boolean;
    compactTitles?: boolean;
    titleScale?: "default" | "medium" | "compact";
};

export default function ServicesAccordion({
    touchPreview = true,
    compactTitles = false,
    titleScale = "default",
}: ServicesAccordionProps) {
    const [activeTouch, setActiveTouch] = useState<number | null>(null);
    const { navigate } = useRouteTransition();
    const isTouchDevice =
        typeof window !== "undefined" &&
        ("ontouchstart" in window || window.matchMedia("(hover: none)").matches);
    const resolvedScale = compactTitles ? "compact" : titleScale;
    const titleScaleMap = {
        default: {
            mobile: "clamp(1rem, 5vw, 2.5rem)",
            desktopClass: "text-[clamp(0.5rem,6vw,5rem)]",
        },
        medium: {
            mobile: "clamp(0.85rem, 4vw, 2rem)",
            desktopClass: "text-[clamp(0.65rem,4.9vw,3.7rem)]",
        },
        compact: {
            mobile: "clamp(1.35rem, 6.8vw, 2.6rem)",
            desktopClass: "text-[clamp(0.65rem,3.2vw,2.2rem)]",
        },
    } as const;
    const mobileTitleSize = titleScaleMap[resolvedScale].mobile;
    const desktopTitleClass = titleScaleMap[resolvedScale].desktopClass;

    const handleStripClick = useCallback(
        (index: number) => {
            if (!isTouchDevice || !touchPreview) return;
            if (activeTouch === index) {
                navigate(`/services/${STRIPS[index].slug}`);
            } else {
                setActiveTouch(index);
            }
        },
        [isTouchDevice, touchPreview, activeTouch, navigate],
    );

    return (
        <section className="mk-home-dark-section relative z-[2] h-screen min-h-screen w-full overflow-hidden">
            <div className="mk-home-dark-texture" />
            <style dangerouslySetInnerHTML={{
                __html: `
        @media (hover: hover) {
          .service-strip:hover > .strip-bg-img {
            transform: scale(1) !important;
            filter: grayscale(0%) brightness(0.6) !important;
          }
          .service-strip:hover {
            flex: 6 !important;
          }
          .service-strip:hover .strip-subtitle {
            opacity: 1 !important;
            transform: translateY(-5px) !important;
          }
          .service-strip:hover .strip-title {
            letter-spacing: 0px !important;
          }
        }
        @media (max-width: 768px) {
          .service-strip {
            transition: flex 0.6s cubic-bezier(0.2, 1, 0.2, 1) !important;
            min-height: 72px;
          }
	          .strip-title {
	            font-size: ${mobileTitleSize} !important;
	            letter-spacing: -1px !important;
	            line-height: 1 !important;
	          }
          .strip-subtitle {
            font-size: 9px !important;
            letter-spacing: 3px !important;
            margin-bottom: 8px !important;
          }
        }
      ` }} />
            <div className="relative z-[1] flex h-full w-full flex-col">
                {STRIPS.map((strip, i) => {
                    const isActive = activeTouch === i;
                    return (
                        <div
                            key={i}
                            className="service-strip group relative flex cursor-pointer items-center justify-center overflow-hidden border-b border-white/[0.08]"
                            style={{
                                flex: isActive ? 6 : 1,
                                transition: "flex 0.9s cubic-bezier(0.2, 1, 0.2, 1)",
                            }}
                            onClick={() => {
                                if (isTouchDevice && touchPreview) {
                                    handleStripClick(i);
                                } else {
                                    navigate(`/services/${strip.slug}`);
                                }
                            }}
                        >
                            <div
                                className="strip-bg-img absolute inset-0 bg-cover bg-center"
                                data-cursor-media
                                style={{
                                    backgroundImage: `url('${strip.bg}')`,
                                    filter: isActive
                                        ? "grayscale(0%) brightness(0.6)"
                                        : "grayscale(100%) brightness(0.3)",
                                    transform: isActive ? "scale(1)" : "scale(1.15)",
                                    transition:
                                        "transform 1.2s cubic-bezier(0.2, 1, 0.2, 1), filter 0.8s ease",
                                }}
                            />

                            <div className="pointer-events-none relative z-[5] w-[90%] text-center">
                                <span
                                    className="strip-subtitle mb-3 block text-[clamp(10px,0.8vw,14px)] uppercase tracking-[6px] font-sans"
                                    style={{
                                        opacity: isActive ? 1 : 0.5,
                                        transform: isActive ? "translateY(-5px)" : "translateY(0)",
                                        transition: "opacity 0.5s, transform 0.5s",
                                        fontFamily: "var(--font-mplus), 'Inter', sans-serif",
                                    }}
                                >
                                    {strip.subtitle}
                                </span>
                                <h2
                                    className={`strip-title ${desktopTitleClass} font-black uppercase leading-[0.9] text-white`}
                                    style={{
                                        letterSpacing: isActive ? "0px" : "-2px",
                                        transition: "letter-spacing 0.8s ease",
                                        fontFamily: "var(--font-cormorant), 'Outfit', sans-serif",
                                    }}
                                >
                                    {strip.title}
                                </h2>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
