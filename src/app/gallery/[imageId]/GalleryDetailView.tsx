"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type Props = {
    title: string;
    category: string;
    images: string[];
};

const CATEGORY_LABELS: Record<string, string> = {
    "architect-commercial": "Commercial Architecture",
    "architect-residence": "Residential Architecture",
    constructions: "Construction",
    "interior-commercial": "Commercial Interior",
    "interior-residencial": "Residential Interior",
};

export default function GalleryDetailView({ title, category, images }: Props) {
    const pageRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const page = pageRef.current;
        if (!page) return;

        gsap.registerPlugin(ScrollTrigger);

        const sections = Array.from(page.querySelectorAll<HTMLElement>(".gd-section"));
        const triggers: ScrollTrigger[] = [];

        sections.forEach((section) => {
            const img = section.querySelector<HTMLElement>(".gd-img");
            if (!img) return;

            const st = ScrollTrigger.create({
                trigger: section,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.2,
                onUpdate: (self) => {
                    const p = self.progress;
                    img.style.transform = `translateY(${(p - 0.5) * 20}%) scale(1.15)`;
                },
            });
            triggers.push(st);
        });

        return () => {
            triggers.forEach((t) => t.kill());
        };
    }, [images]);

    const categoryLabel = CATEGORY_LABELS[category] ?? category;

    return (
        <>
            <style>{`
        .gd-page {
          width: 100%;
          background: #080808;
          color: #e3e4e0;
          overflow-x: hidden;
        }
        .gd-hero {
          position: relative;
          width: 100%;
          height: 100dvh;
          display: flex;
          align-items: flex-end;
          overflow: hidden;
        }
        .gd-hero-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 115%;
          object-fit: cover;
          filter: brightness(0.35);
          top: -7.5%;
        }
        .gd-hero-text {
          position: relative;
          z-index: 2;
          padding: clamp(32px, 6vw, 80px);
          padding-bottom: clamp(48px, 8vw, 100px);
        }
        .gd-hero-cat {
          font-family: "Inter", sans-serif;
          font-size: clamp(0.65rem, 1.2vw, 0.8rem);
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: #c49a3a;
          margin-bottom: 16px;
        }
        .gd-hero-title {
          font-family: "Cormorant Garamond", serif;
          font-size: clamp(2.8rem, 7vw, 7rem);
          font-weight: 300;
          font-style: italic;
          line-height: 1.05;
          margin: 0;
          color: #e3e4e0;
        }
        .gd-hero-count {
          font-family: "Inter", sans-serif;
          font-size: clamp(0.65rem, 1vw, 0.75rem);
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(227,228,224,0.4);
          margin-top: 20px;
        }
        .gd-section {
          position: relative;
          width: 100%;
          height: 100dvh;
          overflow: hidden;
        }
        .gd-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: brightness(0.75);
          will-change: transform;
          transform: translateY(-10%) scale(1.15);
        }
        .gd-img-index {
          position: absolute;
          bottom: 28px;
          right: 36px;
          z-index: 2;
          font-family: "Inter", sans-serif;
          font-size: 0.7rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(227,228,224,0.35);
        }
        .gd-footer-spacer { height: 20vh; background: #080808; }

        @media (max-width: 768px) {
          .gd-section { height: 72dvh; }
          .gd-hero { height: 72dvh; }
        }
        @media (max-width: 480px) {
          .gd-section { height: 60dvh; }
          .gd-hero { height: 60dvh; }
        }
      `}</style>

            <main className="gd-page" ref={pageRef}>
                {/* Hero — first image with title */}
                <div className="gd-hero">
                    <img
                        src={images[0]}
                        alt={title}
                        className="gd-hero-img"
                        draggable={false}
                    />
                    <div className="gd-hero-text">
                        <p className="gd-hero-cat">{categoryLabel}</p>
                        <h1 className="gd-hero-title">{title}</h1>
                        <p className="gd-hero-count">{images.length} photographs</p>
                    </div>
                </div>

                {/* Remaining images — full-screen parallax */}
                {images.slice(1).map((src, i) => (
                    <section className="gd-section" key={src}>
                        <img
                            src={src}
                            alt={`${title} — ${i + 2}`}
                            className="gd-img"
                            draggable={false}
                        />
                        <span className="gd-img-index">
                            {String(i + 2).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
                        </span>
                    </section>
                ))}

                <div className="gd-footer-spacer" />
            </main>
        </>
    );
}
