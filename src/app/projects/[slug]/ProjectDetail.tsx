"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";


type Project = {
    id: string;
    title: string;
    category: string;
    coverImage: string;
    images: string[];
    description?: string;
};

const CATEGORY_LABELS: Record<string, string> = {
    "architect-commercial": "Commercial Architecture",
    "architect-residence": "Residential Architecture",
    "interior-commercial": "Commercial Interior",
    "interior-residencial": "Residential Interior",
};

const BACK_URLS: Record<string, string> = {
    "architect-commercial": "/projects?view=gallery&tab=architectural&filter=all",
    "architect-residence": "/projects?view=gallery&tab=architectural&filter=all",
    "interior-commercial": "/projects?view=gallery&tab=interior&filter=all",
    "interior-residencial": "/projects?view=gallery&tab=interior&filter=all",
};

/**
 * Repeating 8-image bento pattern (3-col grid):
 * Row 1: [wide 2col] [tall 1col 2rows]
 * Row 2: [normal]   [normal] (tall cont.)
 * Row 3: [tall 2rows] [wide 2col]
 * Row 4: (tall cont.) [normal] [normal]
 */
function getBentoStyle(index: number): React.CSSProperties {
    const pos = index % 8;
    const cycle = Math.floor(index / 8);
    const r = cycle * 4; // row offset (1-indexed base below)
    switch (pos) {
        case 0: return { gridColumn: "1 / 3", gridRow: `${r + 1}` };
        case 1: return { gridColumn: "3", gridRow: `${r + 1} / ${r + 3}` };
        case 2: return { gridColumn: "1", gridRow: `${r + 2}` };
        case 3: return { gridColumn: "2", gridRow: `${r + 2}` };
        case 4: return { gridColumn: "1", gridRow: `${r + 3} / ${r + 5}` };
        case 5: return { gridColumn: "2 / 4", gridRow: `${r + 3}` };
        case 6: return { gridColumn: "2", gridRow: `${r + 4}` };
        case 7: return { gridColumn: "3", gridRow: `${r + 4}` };
        default: return {};
    }
}

export default function ProjectDetail({ project }: { project: Project }) {
    const categoryLabel = CATEGORY_LABELS[project.category] ?? project.category;
    const backUrl = BACK_URLS[project.category] ?? "/projects";

    const introRef = useRef<HTMLElement>(null);

    useEffect(() => {
        if (!introRef.current) return;
        const ctx = gsap.context(() => {
            gsap.to(".pd-intro-line", {
                y: 0,
                duration: 0.9,
                ease: "power3.out",
                stagger: 0.1,
                delay: 0.2,
            });
        }, introRef);
        return () => ctx.revert();
    }, []);



    return (
        <>
            <style>{`
                .pd-wrap { min-height: 100vh; background: #050505; color: #E3E4E0; }

                /* Hero — text only */
                .pd-hero {
                    min-height: 60vh;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                    padding: clamp(120px, 16vh, 180px) clamp(24px, 6vw, 80px) clamp(40px, 6vh, 64px);
                    position: relative;
                    border-bottom: 1px solid rgba(255,255,255,0.06);
                }
                .pd-back {
                    display: inline-flex; align-items: center; gap: 10px;
                    color: rgba(227,228,224,0.7); text-decoration: none;
                    font-size: 0.68rem; letter-spacing: 0.22em; text-transform: uppercase;
                    font-family: var(--font-geist-sans), sans-serif;
                    transition: color 0.25s ease;
                }
                .pd-back:hover { color: #fff; }
                .pd-back svg { transition: transform 0.25s ease; }
                .pd-back:hover svg { transform: translateX(-3px); }

                .pd-intro-clip { overflow: hidden; }
                .pd-eyebrow {
                    font-size: 0.7rem; letter-spacing: 0.42em; text-transform: uppercase;
                    color: #C49A3A; font-family: var(--font-geist-sans), sans-serif;
                    font-weight: 600; margin-bottom: 24px; display: block;
                }
                .pd-title {
                    font-family: var(--font-cormorant), "Cormorant Garamond", serif;
                    font-size: clamp(2.5rem, 6vw, 5rem);
                    font-weight: 400;
                    letter-spacing: 0.05em;
                    text-transform: uppercase;
                    color: #E3E4E0; margin: 0 0 32px; line-height: 1.1;
                }
                .pd-count {
                    max-width: 640px;
                    font-size: 1rem; line-height: 1.8;
                    color: rgba(227, 228, 224, 0.5);
                    font-family: var(--font-geist-sans), sans-serif;
                    letter-spacing: 0.05em;
                }

                /* Bento grid */
                .pd-grid-section {
                    padding: clamp(32px, 4vw, 64px) clamp(8px, 2vw, 24px);
                }
                .pd-bento {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    grid-auto-rows: clamp(220px, 26vw, 380px);
                    gap: 4px;
                }
                .pd-bento-item {
                    position: relative;
                    overflow: hidden;
                    background: #111;
                }
                .pd-bento-item img {
                    position: absolute; inset: 0;
                    width: 100%; height: 100%; object-fit: cover;
                    transition: transform 0.6s cubic-bezier(0.22,1,0.36,1), opacity 0.3s ease;
                    opacity: 0.88;
                }
                .pd-bento-item:hover img { transform: scale(1.04); opacity: 1; }
                @media (max-width: 640px) {
                    .pd-bento {
                        grid-template-columns: 1fr;
                        grid-auto-rows: unset;
                    }
                    .pd-bento-item {
                        grid-column: 1 !important;
                        grid-row: auto !important;
                        position: relative;
                        height: auto;
                    }
                    .pd-bento-item img {
                        position: relative;
                        width: 100%;
                        height: auto;
                        display: block;
                        opacity: 0.88;
                        image-orientation: from-image;
                    }
                }


                /* CTA */
                .pd-cta {
                    width: 100%;
                    padding: clamp(100px, 15vh, 200px) 24px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    text-align: center;
                }
                .pd-cta-btn {
                    display: inline-flex; align-items: center; gap: 12px;
                    padding: 0.85rem 2.5rem; border: 1px solid rgba(227, 228, 224, 0.8);
                    border-radius: 9999px; color: #e3e4e0; text-decoration: none;
                    font-size: 0.85rem; letter-spacing: 0.14em; text-transform: uppercase;
                    font-family: var(--font-geist-sans), sans-serif;
                    transition: background 0.3s ease, border-color 0.3s ease, color 0.3s ease;
                }
                .pd-cta-btn:hover {
                    background: #e3e4e0; border-color: #e3e4e0; color: #050505;
                }

                @media (max-width: 480px) {
                    .pd-grid { grid-template-columns: 1fr; }
                    .pd-lb-nav { display: none; }
                }
            `}</style>

            <div className="pd-wrap">
                {/* Hero — text only */}
                <section ref={introRef} className="pd-hero">

                    <div className="pd-intro-clip">
                        <span className="pd-eyebrow pd-intro-line" style={{ transform: "translateY(110%)" }}>{categoryLabel}</span>
                    </div>
                    <div className="pd-intro-clip">
                        <h1 className="pd-title pd-intro-line" style={{ transform: "translateY(110%)" }}>{project.title}</h1>
                    </div>
                    <div className="pd-intro-clip">
                        <p className="pd-count pd-intro-line" style={{ transform: "translateY(110%)" }}>
                            {project.description ?? `${project.images.length} Photographs`}
                        </p>
                    </div>
                </section>

                {/* Bento Image Grid */}
                <section className="pd-grid-section">
                    <div className="pd-bento">
                        {project.images.map((src, i) => (
                            <div
                                key={i}
                                className="pd-bento-item"
                                style={getBentoStyle(i)}
                            >
                                <img
                                    src={src}
                                    alt=""
                                    loading={i < 4 ? "eager" : "lazy"}
                                />
                            </div>
                        ))}
                    </div>
                </section>

                {/* Simplified CTA */}
                <section className="pd-cta">
                    <Link href={backUrl} className="pd-cta-btn" data-interactive>
                        Back to Projects
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M11 7H3M6 4L3 7l3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </Link>
                </section>
            </div>


        </>
    );
}
