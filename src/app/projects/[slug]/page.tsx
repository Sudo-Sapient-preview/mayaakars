"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProjectPerPageSlider from "@/components/projects/ProjectPerPageSlider";
import type { ProjectCategory } from "@/lib/projects-data";

export default function ProjectDetailPage() {
    const params = useParams();
    const slug = params.slug as string;
    const [project, setProject] = useState<ProjectCategory | null | undefined>(
        undefined
    );

    useEffect(() => {
        fetch("/api/projects")
            .then((r) => r.json())
            .then((projects: ProjectCategory[]) => {
                const found = projects.find((p) => p.slug === slug);
                setProject(found ?? null);
            })
            .catch(() => setProject(null));
    }, [slug]);

    // Still loading
    if (project === undefined) return null;

    if (!project) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#050505] px-6 text-center text-[#E3E4E0]">
                <div>
                    <p className="mb-3 text-xs uppercase tracking-[0.35em] text-[#C49A3A]">Projects</p>
                    <h1
                        className="mb-4 text-3xl uppercase text-white"
                        style={{ fontFamily: "var(--font-cormorant), serif" }}
                    >
                        Project not found
                    </h1>
                    <p className="text-white/65">The project route you requested does not exist.</p>
                </div>
            </main>
        );
    }

    const highlights = project.slides.slice(0, 4).map((slide) => slide.title);

    return (
        <main className="bg-[#050505] text-[#E3E4E0]">
            <style dangerouslySetInnerHTML={{ __html: PAGE_STYLES }} />

            <section className="prj-intro">
                <span className="prj-label">{project.category}</span>
                <h1 className="prj-title">{project.title}</h1>
                <p className="prj-desc">{project.description}</p>
            </section>

            <ProjectPerPageSlider slides={project.slides} />

            <section className="prj-cta">
                <div className="prj-cta-inner">
                    <div className="prj-cta-left">
                        <span className="prj-cta-label">Project Highlights</span>
                        <ul className="prj-highlight-list">
                            {highlights.map((item) => (
                                <li key={item}>{item}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="prj-cta-right">
                        <span className="prj-cta-label">Ready To Build Yours</span>
                        <p className="prj-cta-text">
                            From concept sketches to full execution planning, we design projects with material depth,
                            technical clarity, and timeless character.
                        </p>
                        <Link href="/contact" data-interactive className="prj-cta-button">
                            Start Your Project
                        </Link>
                    </div>
                </div>
            </section>
            <section className="prj-back-wrap">
                <Link href="/projects" className="prj-back-btn" data-interactive>
                    Back to Projects
                </Link>
            </section>
        </main>
    );
}

const PAGE_STYLES = `
    .prj-intro {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: 120px 24px 80px;
        position: relative;
    }
    .prj-label {
        font-size: 0.7rem;
        letter-spacing: 0.42em;
        text-transform: uppercase;
        color: #c49a3a;
        font-weight: 600;
        margin-bottom: 24px;
        display: block;
    }
    .prj-title {
        font-family: var(--font-cormorant), "Cormorant Garamond", serif;
        font-size: clamp(2rem, 5.6vw, 4rem);
        font-weight: 400;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        line-height: 1.08;
        margin-bottom: 32px;
        color: #ffffff;
    }
    .prj-desc {
        max-width: 680px;
        font-size: 1rem;
        line-height: 1.8;
        color: rgba(227, 228, 224, 0.66);
        font-weight: 400;
    }

    .prj-cta {
        padding: 100px 24px 120px;
        background: #050505;
        position: relative;
    }
    .prj-cta::before {
        content: "";
        position: absolute;
        inset: 0;
        opacity: 0.04;
        background-image:
            linear-gradient(#c49a3a 1px, transparent 1px),
            linear-gradient(90deg, #c49a3a 1px, transparent 1px);
        background-size: 60px 60px;
        pointer-events: none;
    }
    .prj-cta-inner {
        max-width: 980px;
        margin: 0 auto;
        display: grid;
        grid-template-columns: 1.4fr 1fr;
        gap: 80px;
        position: relative;
        z-index: 1;
    }
    .prj-cta-label {
        font-size: 0.7rem;
        letter-spacing: 0.42em;
        text-transform: uppercase;
        color: #c49a3a;
        font-weight: 600;
        margin-bottom: 32px;
        display: block;
    }
    .prj-highlight-list {
        list-style: none;
        padding: 0;
        margin: 0;
    }
    .prj-highlight-list li {
        font-family: var(--font-cormorant), serif;
        font-size: 1.15rem;
        font-weight: 400;
        padding: 18px 0;
        border-bottom: 1px solid rgba(196, 154, 58, 0.12);
        color: rgba(227, 228, 224, 0.84);
        letter-spacing: 0.02em;
    }
    .prj-highlight-list li:first-child {
        border-top: 1px solid rgba(196, 154, 58, 0.12);
    }
    .prj-cta-text {
        font-size: 0.98rem;
        line-height: 1.8;
        color: rgba(227, 228, 224, 0.56);
        margin-bottom: 28px;
    }
    .prj-cta-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 48px;
        padding: 0.6rem 1.5rem;
        border-radius: 9999px;
        border: 1px solid rgba(196, 154, 58, 0.55);
        color: #e3e4e0;
        text-transform: uppercase;
        letter-spacing: 0.2em;
        font-size: 0.68rem;
        text-decoration: none;
        transition: background-color 0.28s ease, color 0.28s ease, border-color 0.28s ease;
    }
    .prj-cta-button:hover {
        background: #c49a3a;
        border-color: #c49a3a;
        color: #050505;
    }
    .prj-back-wrap {
        padding: 0 24px 120px;
        display: flex;
        justify-content: center;
    }
    .prj-back-btn {
        border: 1px solid rgba(227, 228, 224, 0.85);
        border-radius: 9999px;
        background: transparent;
        color: #e3e4e0;
        padding: 0.85rem 2rem;
        font-size: 0.9rem;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        text-decoration: none;
        transition: background-color 0.25s ease, color 0.25s ease, border-color 0.25s ease;
    }
    .prj-back-btn:hover {
        background: #e3e4e0;
        color: #050505;
        border-color: #e3e4e0;
    }

    @media (max-width: 768px) {
        .prj-intro {
            padding: 88px 20px 44px;
            min-height: auto;
        }
        .prj-title {
            font-size: clamp(1.6rem, 6.8vw, 2.4rem);
            margin-bottom: 24px;
        }
        .prj-desc {
            font-size: 0.94rem;
            line-height: 1.7;
        }
        .prj-cta {
            padding: 52px 20px 72px;
        }
        .prj-cta-inner {
            grid-template-columns: 1fr;
            gap: 48px;
        }
        .prj-highlight-list li {
            font-size: 1.05rem;
            padding: 15px 0;
        }
        .prj-back-wrap {
            padding: 0 20px 72px;
        }
        .prj-back-btn {
            width: 100%;
            max-width: 320px;
            text-align: center;
            font-size: 0.78rem;
            letter-spacing: 0.12em;
        }
    }
`;
