"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useRouteTransition } from "@/components/navigation/RouteTransitionProvider";

import manifest from "@/data/gallery-manifest.json";
import ImageGallery from "@/components/ui/image-gallery";

type GalleryItem = { id: string; title: string; category: string; coverImage: string };
const ALL_PROJECTS = manifest as GalleryItem[];

type Tab = "architectural" | "interior";
type Filter = "all" | "commercial" | "residential";

const TAB_CATEGORIES: Record<Tab, string[]> = {
    architectural: ["architect-commercial", "architect-residence"],
    interior: ["interior-commercial", "interior-residencial"],
};

const FILTER_CATEGORIES: Record<Exclude<Filter, "all">, string[]> = {
    commercial: ["architect-commercial", "interior-commercial"],
    residential: ["architect-residence", "interior-residencial"],
};

export default function ProjectsGrid() {
    const searchParams = useSearchParams();
    const { navigate } = useRouteTransition();

    // Derive state directly from URL — makes refresh work correctly
    const urlView = searchParams.get("view") as "selection" | "gallery" | null;
    const urlTab = searchParams.get("tab") as Tab | null;
    const urlFilter = searchParams.get("filter") as Filter | null;

    const viewMode: "selection" | "gallery" = urlView === "gallery" ? "gallery" : "selection";
    const tab: Tab = urlTab === "interior" ? "interior" : "architectural";
    const filter: Filter = (urlFilter as Filter) ?? "all";

    // Keep state in sync when navigating via category param (from external links)
    useEffect(() => {
        const categorySlug = searchParams.get("category");
        if (categorySlug) {
            let newTab: Tab = "architectural";
            let newFilter: Filter = "all";
            if (categorySlug === "residential-architecture") {
                newTab = "architectural"; newFilter = "residential";
            } else if (categorySlug === "commercial-architecture") {
                newTab = "architectural"; newFilter = "commercial";
            } else if (categorySlug === "residential-interiors") {
                newTab = "interior"; newFilter = "residential";
            } else if (categorySlug === "commercial-interior") {
                newTab = "interior"; newFilter = "commercial";
            }
            navigate(`/projects?view=gallery&tab=${newTab}&filter=${newFilter}`, { replace: true });
        }
    }, [searchParams, navigate]);

    // Navigation helpers
    function handleFilterChange(f: Filter) {
        navigate(`/projects?view=gallery&tab=${tab}&filter=${f}`, { scroll: false });
    }

    function goToGallery(selectedTab: Tab) {
        navigate(`/projects?view=gallery&tab=${selectedTab}&filter=all`, { scroll: false });
    }

    function goToSelection() {
        navigate(`/projects`, { scroll: false });
    }

    const tabCats = TAB_CATEGORIES[tab];
    const visibleProjects = ALL_PROJECTS.filter((p) => {
        if (!tabCats.includes(p.category)) return false;
        if (filter === "all") return true;
        return FILTER_CATEGORIES[filter].includes(p.category);
    });

    return (
        <>
            <style>{`
                .pg-wrap {
                    min-height: 100vh;
                    background: #050505;
                    display: flex;
                    flex-direction: column;
                }
                .pg-wrap--gallery {
                    min-height: 0;
                    padding: 0;
                }
                .pg-selection-view {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: clamp(140px, 18vh, 180px) clamp(24px, 6vw, 80px) clamp(60px, 10vh, 100px);
                }
                .pg-selection-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 20px;
                    width: 100%;
                    max-width: 1060px;
                    margin-top: 48px;
                }
                @media (min-width: 640px) {
                    .pg-selection-grid {
                        grid-template-columns: 1fr 1fr;
                        gap: 28px;
                    }
                }
                .pg-header-top {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }
                .pg-back-btn {
                    align-self: flex-start;
                    background: none;
                    border: none;
                    color: rgba(227,228,224,0.6);
                    font-family: var(--font-geist-sans), sans-serif;
                    font-size: 0.75rem;
                    text-transform: uppercase;
                    letter-spacing: 0.15em;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 8px 0;
                    transition: color 0.3s ease;
                }
                .pg-back-btn:hover {
                    color: #fff;
                }
                .pg-back-section {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 24px;
                    padding: clamp(56px, 10vh, 100px) clamp(24px, 6vw, 80px);
                    border-top: 1px solid rgba(255,255,255,0.06);
                }
                .pg-back-circle {
                    width: 52px;
                    height: 52px;
                    border-radius: 50%;
                    border: 1.5px solid #C49A3A;
                    flex-shrink: 0;
                }
                .pg-back-cta {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0;
                    padding: 16px 40px;
                    border: 1px solid rgba(255,255,255,0.55);
                    border-radius: 999px;
                    color: #fff;
                    background: transparent;
                    font-family: var(--font-geist-sans), sans-serif;
                    font-size: 0.72rem;
                    letter-spacing: 0.22em;
                    text-transform: uppercase;
                    cursor: pointer;
                    transition: background 0.35s ease, border-color 0.35s ease;
                }
                .pg-back-cta:hover {
                    background: rgba(255,255,255,0.06);
                    border-color: rgba(255,255,255,0.85);
                }
                .pg-header {
                    padding: clamp(40px, 6vh, 60px) clamp(24px, 6vw, 80px) clamp(32px, 5vw, 56px);
                    border-bottom: 1px solid rgba(255,255,255,0.06);
                }
                .pg-eyebrow {
                    font-size: 0.65rem;
                    letter-spacing: 0.4em;
                    text-transform: uppercase;
                    color: #C49A3A;
                    font-family: var(--font-geist-sans), sans-serif;
                    margin-bottom: 12px;
                    display: block;
                }
                .pg-heading {
                    font-family: var(--font-cormorant), serif;
                    font-size: clamp(2.2rem, 5.5vw, 4rem);
                    font-weight: 400;
                    color: #E3E4E0;
                    letter-spacing: 0.02em;
                    margin: 0 0 32px;
                    line-height: 1.05;
                }
                .pg-tabs {
                    display: inline-flex;
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 999px;
                    overflow: hidden;
                    gap: 0;
                }
                .pg-tab {
                    padding: 10px 28px;
                    font-size: 0.7rem;
                    letter-spacing: 0.18em;
                    text-transform: uppercase;
                    font-family: var(--font-geist-sans), sans-serif;
                    cursor: pointer;
                    border: none;
                    background: transparent;
                    color: rgba(227,228,224,0.4);
                    transition: background 0.3s ease, color 0.3s ease;
                }
                .pg-tab.active {
                    background: #C49A3A;
                    color: #050505;
                }

                .pg-body {
                    display: flex;
                    flex: 1;
                }

                /* Left sidebar */
                .pg-sidebar {
                    width: 180px;
                    flex-shrink: 0;
                    padding: clamp(32px, 4vw, 48px) clamp(24px, 3vw, 40px);
                    border-right: 1px solid rgba(255,255,255,0.06);
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                    position: sticky;
                    top: 0;
                    height: fit-content;
                }
                .pg-filter-label {
                    font-size: 0.6rem;
                    letter-spacing: 0.3em;
                    text-transform: uppercase;
                    color: rgba(255,255,255,0.25);
                    font-family: var(--font-geist-sans), sans-serif;
                    margin-bottom: 12px;
                }
                .pg-filter-btn {
                    background: none;
                    border: none;
                    cursor: pointer;
                    text-align: left;
                    padding: 8px 0;
                    font-family: var(--font-geist-sans), sans-serif;
                    font-size: 0.78rem;
                    letter-spacing: 0.08em;
                    color: rgba(227,228,224,0.35);
                    transition: color 0.25s ease;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .pg-filter-btn.active {
                    color: #E3E4E0;
                }
                .pg-filter-dot {
                    width: 4px;
                    height: 4px;
                    border-radius: 50%;
                    background: #C49A3A;
                    flex-shrink: 0;
                    opacity: 0;
                    transition: opacity 0.25s ease;
                }
                .pg-filter-btn.active .pg-filter-dot {
                    opacity: 1;
                }

                /* Grid */
                .pg-grid-wrap {
                    flex: 1;
                    padding: clamp(32px, 4vw, 48px) clamp(24px, 4vw, 56px);
                }
                .pg-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
                    gap: 2px;
                }
                .pg-card {
                    position: relative;
                    aspect-ratio: 3/4;
                    overflow: hidden;
                    background: #111;
                    cursor: pointer;
                }
                .pg-card-img {
                    transition: transform 0.7s cubic-bezier(0.22,1,0.36,1);
                }
                .pg-card:hover .pg-card-img {
                    transform: scale(1.06);
                }
                .pg-card-overlay {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(to top, rgba(5,5,5,0.85) 0%, transparent 55%);
                    transition: opacity 0.4s ease;
                }
                .pg-card-info {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    padding: 20px;
                }
                .pg-card-title {
                    font-family: var(--font-cormorant), serif;
                    font-size: clamp(1rem, 1.6vw, 1.25rem);
                    font-weight: 400;
                    color: #E3E4E0;
                    letter-spacing: 0.02em;
                    line-height: 1.2;
                    margin: 0;
                }
                .pg-card-arrow {
                    position: absolute;
                    top: 16px;
                    right: 16px;
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    border: 1px solid rgba(255,255,255,0.2);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0;
                    transform: scale(0.85);
                    transition: opacity 0.3s ease, transform 0.3s ease;
                    color: #fff;
                }
                .pg-card:hover .pg-card-arrow {
                    opacity: 1;
                    transform: scale(1);
                }
                .pg-empty {
                    grid-column: 1/-1;
                    padding: 80px 0;
                    text-align: center;
                    color: rgba(227,228,224,0.25);
                    font-family: var(--font-cormorant), serif;
                    font-size: 1.2rem;
                    font-style: italic;
                }

                @media (max-width: 768px) {
                    .pg-body { flex-direction: column; }
                    .pg-sidebar {
                        width: 100%;
                        flex-direction: row;
                        align-items: center;
                        padding: 16px clamp(24px, 4vw, 40px);
                        border-right: none;
                        border-bottom: 1px solid rgba(255,255,255,0.06);
                        position: static;
                        gap: 0;
                    }
                    .pg-filter-label { display: none; }
                    .pg-filter-btn { padding: 6px 14px; font-size: 0.72rem; }
                    .pg-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }
            `}</style>

            <main className={`pg-wrap animate-in fade-in duration-700${viewMode === "gallery" ? " pg-wrap--gallery" : ""}`}>
                {viewMode === "selection" ? (
                    <div className="pg-selection-view">
                        <span className="pg-eyebrow text-center mb-4">Our Work</span>
                        <h1 className="pg-heading text-center mb-8">Explore Our Projects</h1>
                        
                        <div className="pg-selection-grid">
                            {[
                                { 
                                    id: "architectural", 
                                    title: "Architectural", 
                                    img: "/Mayaakars/architect-residence/panorama-house/05.webp"
                                },
                                { 
                                    id: "interior", 
                                    title: "Interior", 
                                    img: "/Mayaakars/Residential Interior .webp"
                                }
                            ].map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => goToGallery(cat.id as Tab)}
                                    className="group relative flex flex-col justify-end aspect-[3/4] w-full overflow-hidden rounded-[4px] bg-[#111] shadow-2xl outline-none text-left"
                                >
                                    {cat.img && (
                                        <Image
                                            src={cat.img}
                                            alt={cat.title}
                                            fill
                                            className="object-cover transition-transform duration-[800ms] ease-out group-hover:scale-105"
                                        />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-500 group-hover:opacity-100" />
                                    <div className="relative z-10 p-6 md:p-8 transform transition-transform duration-500 group-hover:-translate-y-1 flex flex-col items-start">
                                        <h3 className="text-2xl md:text-3xl font-serif text-white tracking-wide mb-4">{cat.title} Projects</h3>
                                        <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-md transition-colors duration-300 group-hover:bg-white/20 group-hover:border-white/40">
                                            <span className="text-[11px] font-sans tracking-widest text-white uppercase">
                                                Explore
                                            </span>
                                            <span className="text-white text-sm">→</span>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Spotlight Gallery — starts immediately */}
                        <ImageGallery
                            projects={visibleProjects}
                            tabLabel={tab === "architectural" ? "Architectural" : "Interior"}
                            key={`${tab}-${filter}`}
                        />

                        {/* Back to Categories — bottom CTA */}
                        <div className="pg-back-section">
                            <button onClick={goToSelection} className="pg-back-cta">
                                Back to Categories
                            </button>
                        </div>
                    </>
                )}
            </main>
        </>
    );
}
