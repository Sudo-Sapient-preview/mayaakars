    "use client";

import { useState } from "react";
import Image from "next/image";
import { useRouteTransition } from "@/components/navigation/RouteTransitionProvider";
import manifest from "@/data/gallery-manifest.json";
import ProjectSlider from "./ProjectSlider";

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
    const [tab, setTab] = useState<Tab>("architectural");
    const [filter, setFilter] = useState<Filter>("all");
    const { navigate } = useRouteTransition();

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
                .pg-header {
                    padding: clamp(100px, 14vh, 140px) clamp(24px, 6vw, 80px) clamp(32px, 5vw, 56px);
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

            <main className="pg-wrap">
                {/* Header */}
                <div className="pg-header">
                    <span className="pg-eyebrow">Our Work</span>
                    <h1 className="pg-heading">Explore Our Projects</h1>
                    <div className="pg-tabs" role="tablist">
                        {(["architectural", "interior"] as Tab[]).map((t) => (
                            <button
                                key={t}
                                role="tab"
                                aria-selected={tab === t}
                                className={`pg-tab${tab === t ? " active" : ""}`}
                                onClick={() => { setTab(t); setFilter("all"); }}
                            >
                                {t === "architectural" ? "Architectural" : "Interior"}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="pg-body">
                    {/* Sidebar filter */}
                    <aside className="pg-sidebar" aria-label="Filter projects">
                        <p className="pg-filter-label">Filter</p>
                        {(["all", "commercial", "residential"] as Filter[]).map((f) => (
                            <button
                                key={f}
                                className={`pg-filter-btn${filter === f ? " active" : ""}`}
                                onClick={() => setFilter(f)}
                            >
                                <span className="pg-filter-dot" />
                                {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
                            </button>
                        ))}
                    </aside>

                    {/* Grid */}
                    <div className="pg-grid-wrap" style={{ padding: 0, overflow: "hidden" }}>
                        <ProjectSlider projects={visibleProjects} />
                    </div>
                </div>
            </main>
        </>
    );
}
