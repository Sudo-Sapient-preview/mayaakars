"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { getServiceBySlug } from "@/lib/services-data";
import ServiceSlider from "@/components/services/ServiceSlider";

export default function ServiceDetailPage() {
    const params = useParams();
    const slug = params.slug as string;
    const service = getServiceBySlug(slug);
    const introRef = useRef<HTMLElement>(null);

    useEffect(() => {
        if (!introRef.current) return;

        gsap.registerPlugin(CustomEase);
        CustomEase.create("hop", "0.85, 0, 0.15, 1");

        const ctx = gsap.context(() => {
            gsap.to(".svc-intro-line", {
                y: 0,
                duration: 0.9,
                ease: "power3.out",
                stagger: 0.1,
                delay: 1.0,
            });
        }, introRef);

        return () => ctx.revert();
    }, [slug]);

    if (!service) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#050505] text-white">
                <h1 className="text-2xl">Service not found</h1>
            </div>
        );
    }

    return (
        <main className="bg-[#050505] text-[#E3E4E0]">
            <style dangerouslySetInnerHTML={{ __html: PAGE_STYLES }} />

            {/* ── Section 1: Title + Description ── */}
            <section ref={introRef} className="svc-intro">
                <div className="svc-intro-clip">
                    <span className="svc-label svc-intro-line">{service.subtitle}</span>
                </div>
                <div className="svc-intro-clip">
                    <h1 className="svc-title svc-intro-line">{service.title}</h1>
                </div>
                <div className="svc-intro-clip">
                    <p className="svc-desc svc-intro-line">{service.description}</p>
                </div>
            </section>

            {/* ── Section 2: Image Layout ── */}
            {slug === "architecture" ? (
                <section className="arch-layout">
                    <div className="arch-steps-list">
                        {service.images.slice(1).map((img, i) => (
                            <div key={i} className="arch-step-item">
                                <div className="arch-step-meta">
                                    <span className="arch-step-num">0{i + 1}</span>
                                    <span className="arch-step-name">{img.title}</span>
                                </div>
                                <div className={`arch-step-img-wrap${i === 0 ? " arch-step-img-wrap--portrait" : ""}`}>
                                    <img src={img.src} alt={img.title} className="arch-step-img" />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            ) : (
                <ServiceSlider slides={service.images} />
            )}

            {/* ── Section 3: Scope ── */}
            <section className="svc-scope">
                <div className="svc-scope-inner">
                    <div className="svc-scope-left">
                        <span className="svc-scope-label">Scope Includes</span>
                        <ul className="svc-scope-list">
                            {service.scope.map((item, i) => (
                                <li key={i}>{item}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="svc-scope-right">
                        <span className="svc-scope-label">Ideal For</span>
                        <p className="svc-ideal">{service.idealFor}</p>
                    </div>
                </div>
            </section>

              <section className="svc-back-wrap">
                <Link href="/services" className="svc-back-btn" data-interactive>
                  Back to Services
                </Link>
              </section>
        </main>
    );
}

const PAGE_STYLES = `
  /* ── Intro Section ── */
  .svc-intro {
    min-height: 50vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: clamp(80px, 12vh, 120px) 24px clamp(40px, 6vh, 56px);
    position: relative;
  }
  .svc-intro-clip {
    overflow: hidden;
  }
  .svc-intro-line {
    display: block;
    transform: translateY(110%);
    will-change: transform;
  }
  .svc-label {
    font-size: 0.7rem;
    letter-spacing: 0.42em;
    text-transform: uppercase;
    color: #C49A3A;
    font-weight: 600;
    margin-bottom: 24px;
    display: block;
  }
  .svc-title {
    font-family: var(--font-cormorant), 'Cormorant Garamond', serif;
    font-size: clamp(2.5rem, 6vw, 5rem);
    font-weight: 400;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    line-height: 1.1;
    margin-bottom: 32px;
  }
  .svc-desc {
    max-width: 640px;
    font-size: 1.05rem;
    line-height: 1.8;
    color: rgba(227, 228, 224, 0.65);
    font-weight: 400;
  }

  /* ── Architecture Layout ── */
  .arch-layout {
    max-width: 960px;
    margin: 0 auto;
    padding: 20px 24px 80px;
  }
  .arch-steps-header {
    margin-bottom: 48px;
  }
  .arch-steps-title {
    font-family: var(--font-cormorant), 'Cormorant Garamond', serif;
    font-size: clamp(2rem, 4vw, 3.5rem);
    font-weight: 400;
    letter-spacing: 0.04em;
    line-height: 1.15;
    color: #E3E4E0;
    margin-top: 16px;
    text-transform: uppercase;
  }
  .arch-steps-list {
    display: flex;
    flex-direction: column;
  }
  .arch-step-item {
    display: grid;
    grid-template-columns: 1fr 1.6fr;
    gap: 40px;
    align-items: center;
    padding: 36px 0;
    border-bottom: 1px solid rgba(196, 154, 58, 0.12);
  }
  .arch-step-item:first-child {
    border-top: 1px solid rgba(196, 154, 58, 0.12);
  }
  .arch-step-meta {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .arch-step-num {
    font-size: 0.65rem;
    letter-spacing: 0.35em;
    color: #C49A3A;
    font-weight: 600;
  }
  .arch-step-name {
    font-family: var(--font-cormorant), 'Cormorant Garamond', serif;
    font-size: clamp(1.3rem, 2vw, 1.8rem);
    font-weight: 400;
    color: rgba(227, 228, 224, 0.85);
    letter-spacing: 0.02em;
    line-height: 1.3;
  }
  .arch-step-img-wrap {
    overflow: hidden;
    aspect-ratio: 16 / 9;
    border-radius: 2px;
  }
  .arch-step-img-wrap--portrait {
    aspect-ratio: 2 / 2.5;
  }
  .arch-step-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.6s ease;
  }
  .arch-step-item:hover .arch-step-img {
    transform: scale(1.04);
  }

  @media (max-width: 640px) {
    .arch-layout {
      padding: 40px 20px 60px;
    }
    .arch-step-item {
      grid-template-columns: 1fr;
      gap: 20px;
    }
  }

  /* ── Scope Section ── */
  .svc-scope {
    padding: 100px 24px 120px;
    background: #050505;
    position: relative;
  }
  .svc-scope::before {
    content: '';
    position: absolute;
    inset: 0;
    opacity: 0.04;
    background-image:
      linear-gradient(#C49A3A 1px, transparent 1px),
      linear-gradient(90deg, #C49A3A 1px, transparent 1px);
    background-size: 60px 60px;
    pointer-events: none;
  }
  .svc-scope-inner {
    max-width: 960px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1.5fr 1fr;
    gap: 80px;
    position: relative;
    z-index: 1;
  }
  .svc-scope-label {
    font-size: 0.7rem;
    letter-spacing: 0.42em;
    text-transform: uppercase;
    color: #C49A3A;
    font-weight: 600;
    margin-bottom: 32px;
    display: block;
  }
  .svc-scope-list {
    list-style: none;
    padding: 0;
  }
  .svc-scope-list li {
    font-family: var(--font-cormorant), serif;
    font-size: 1.35rem;
    font-weight: 400;
    padding: 18px 0;
    border-bottom: 1px solid rgba(196, 154, 58, 0.12);
    color: rgba(227, 228, 224, 0.8);
    letter-spacing: 0.02em;
  }
  .svc-scope-list li:first-child {
    border-top: 1px solid rgba(196, 154, 58, 0.12);
  }
  .svc-ideal {
    font-size: 1.05rem;
    line-height: 1.8;
    color: rgba(227, 228, 224, 0.55);
  }
  .svc-back-wrap {
    padding: 0 24px 120px;
    display: flex;
    justify-content: center;
  }
  .svc-back-btn {
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
  .svc-back-btn:hover {
    background: #e3e4e0;
    color: #050505;
    border-color: #e3e4e0;
  }

  @media (max-width: 768px) {
	    .svc-intro {
	      padding: 88px 20px 36px;
	      min-height: 65vh;
	    }
	    .svc-title {
	      font-size: clamp(2rem, 8.4vw, 2.8rem);
	      margin-bottom: 24px;
	    }
	    .svc-desc {
	      font-size: 0.98rem;
	      line-height: 1.7;
	    }
	    .svc-scope-inner {
	      grid-template-columns: 1fr;
	      gap: 48px;
	    }
	    .svc-scope {
	      padding: 52px 20px 72px;
	    }
      .svc-back-wrap {
        padding: 0 20px 72px;
      }
      .svc-back-btn {
        width: 100%;
        max-width: 320px;
        text-align: center;
        font-size: 0.82rem;
        letter-spacing: 0.12em;
      }
	  }
`;
