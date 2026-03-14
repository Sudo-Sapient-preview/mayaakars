"use client";

import { useParams } from "next/navigation";
import { getServiceBySlug } from "@/lib/services-data";
import ServiceSlider from "@/components/services/ServiceSlider";

export default function ServiceDetailPage() {
    const params = useParams();
    const slug = params.slug as string;
    const service = getServiceBySlug(slug);

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
            <section className="svc-intro">
                <span className="svc-label">{service.subtitle}</span>
                <h1 className="svc-title">{service.title}</h1>
                <p className="svc-desc">{service.description}</p>
            </section>

            {/* ── Section 2: 3D Slider Hero ── */}
            <ServiceSlider slides={service.images} />

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
        </main>
    );
}

const PAGE_STYLES = `
  /* ── Intro Section ── */
  .svc-intro {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 120px 24px 80px;
    position: relative;
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

  @media (max-width: 768px) {
	    .svc-intro {
	      padding: 88px 20px 44px;
	      min-height: auto;
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
	  }
`;
