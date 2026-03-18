"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { SERVICES } from "@/lib/services-data";

export default function ServicesBlocks({ showSectionLabel = false }: { showSectionLabel?: boolean }) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggle = (i: number) => setOpenIndex((prev) => (prev === i ? null : i));

    return (
        <section style={{ background: "#050505", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            {showSectionLabel && (
                <div style={{
                    padding: "clamp(40px, 6vw, 72px) clamp(24px, 6vw, 80px) clamp(24px, 3vw, 36px)",
                }}>
                    <p style={{
                        fontSize: "0.65rem",
                        letterSpacing: "0.4em",
                        textTransform: "uppercase",
                        color: "#C49A3A",
                        fontFamily: "var(--font-geist-sans), sans-serif",
                        marginBottom: "10px",
                    }}>
                        Our Expertise
                    </p>
                    <h2 style={{
                        fontFamily: "var(--font-cormorant), serif",
                        fontSize: "clamp(2rem, 4.5vw, 3.5rem)",
                        fontWeight: 400,
                        color: "#E3E4E0",
                        letterSpacing: "0.02em",
                        margin: 0,
                    }}>
                        Services
                    </h2>
                </div>
            )}
            {SERVICES.map((service, i) => (
                <ServiceBlock
                    key={service.slug}
                    service={service}
                    index={i}
                    isOpen={openIndex === i}
                    onToggle={() => toggle(i)}
                />
            ))}
        </section>
    );
}

function ServiceBlock({
    service,
    index,
    isOpen,
    onToggle,
}: {
    service: (typeof SERVICES)[number];
    index: number;
    isOpen: boolean;
    onToggle: () => void;
}) {
    const bodyRef = useRef<HTMLDivElement>(null);
    const [height, setHeight] = useState(0);

    useEffect(() => {
        const el = bodyRef.current;
        if (!el) return;
        setHeight(isOpen ? el.scrollHeight : 0);
    }, [isOpen]);

    const num = String(index + 1).padStart(2, "0");

    return (
        <div
            style={{
                borderBottom: "1px solid rgba(255,255,255,0.07)",
            }}
        >
            {/* Header row */}
            <button
                onClick={onToggle}
                aria-expanded={isOpen}
                style={{
                    width: "100%",
                    display: "grid",
                    gridTemplateColumns: "3rem 1fr auto",
                    alignItems: "center",
                    gap: "clamp(16px, 3vw, 40px)",
                    padding: "clamp(24px, 4vw, 36px) clamp(24px, 6vw, 80px)",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    color: "#E3E4E0",
                }}
            >
                {/* Number */}
                <span
                    style={{
                        fontFamily: "var(--font-cormorant), serif",
                        fontSize: "clamp(0.75rem, 1.2vw, 1rem)",
                        color: "#C49A3A",
                        letterSpacing: "0.1em",
                        opacity: 0.8,
                        userSelect: "none",
                    }}
                >
                    {num}
                </span>

                {/* Title + subtitle */}
                <div>
                    <h3
                        style={{
                            fontFamily: "var(--font-cormorant), serif",
                            fontSize: "clamp(1.5rem, 3.5vw, 2.8rem)",
                            fontWeight: 400,
                            letterSpacing: "0.02em",
                            color: isOpen ? "#C49A3A" : "#E3E4E0",
                            transition: "color 0.4s ease",
                            margin: 0,
                            lineHeight: 1.1,
                        }}
                    >
                        {service.title}
                    </h3>
                </div>

                {/* Toggle icon */}
                <span
                    aria-hidden
                    style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        border: "1px solid rgba(255,255,255,0.15)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        transition: "border-color 0.3s ease, transform 0.5s cubic-bezier(0.22,1,0.36,1)",
                        transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                        borderColor: isOpen ? "rgba(196,154,58,0.5)" : "rgba(255,255,255,0.15)",
                    }}
                >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                        <line x1="6" y1="1" x2="6" y2="11" stroke="currentColor" strokeWidth="1.2" />
                        <line x1="1" y1="6" x2="11" y2="6" stroke="currentColor" strokeWidth="1.2" />
                    </svg>
                </span>
            </button>

            {/* Expandable body */}
            <div
                ref={bodyRef}
                style={{
                    height: `${height}px`,
                    overflow: "hidden",
                    transition: "height 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
                }}
            >
                <div
                    style={{
                        padding: "0 clamp(24px, 6vw, 80px) clamp(32px, 5vw, 56px)",
                        paddingLeft: `calc(clamp(24px, 6vw, 80px) + 3rem + clamp(16px, 3vw, 40px))`,
                    }}
                >
                    {/* Description + scope */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: "clamp(24px, 4vw, 60px)",
                            marginBottom: "clamp(28px, 4vw, 48px)",
                        }}
                        className="svc-body-grid"
                    >
                        <p
                            style={{
                                fontFamily: "var(--font-geist-sans), sans-serif",
                                fontSize: "clamp(0.82rem, 1.1vw, 0.95rem)",
                                lineHeight: 1.85,
                                color: "rgba(227,228,224,0.65)",
                            }}
                        >
                            {service.description}
                        </p>

                        <div>
                            <p
                                style={{
                                    fontSize: "0.65rem",
                                    letterSpacing: "0.3em",
                                    textTransform: "uppercase",
                                    color: "#C49A3A",
                                    marginBottom: "14px",
                                    fontFamily: "var(--font-geist-sans), sans-serif",
                                }}
                            >
                                Scope
                            </p>
                            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                                {service.scope.map((item) => (
                                    <li
                                        key={item}
                                        style={{
                                            fontFamily: "var(--font-geist-sans), sans-serif",
                                            fontSize: "clamp(0.78rem, 1vw, 0.88rem)",
                                            color: "rgba(227,228,224,0.55)",
                                            paddingBottom: "8px",
                                            borderBottom: "1px solid rgba(255,255,255,0.05)",
                                            marginBottom: "8px",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "10px",
                                        }}
                                    >
                                        <span style={{ color: "#C49A3A", fontSize: "0.5rem" }}>◆</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <p
                                style={{
                                    marginTop: "16px",
                                    fontSize: "0.72rem",
                                    color: "rgba(227,228,224,0.3)",
                                    fontStyle: "italic",
                                    fontFamily: "var(--font-cormorant), serif",
                                    letterSpacing: "0.03em",
                                }}
                            >
                                Ideal for: {service.idealFor}
                            </p>
                        </div>
                    </div>

                    {/* Image strip */}
                    <div
                        style={{
                            display: "flex",
                            gap: "12px",
                            overflowX: "auto",
                            paddingBottom: "4px",
                            scrollbarWidth: "none",
                        }}
                    >
                        {service.images.map((img) => (
                            <div
                                key={img.src}
                                style={{
                                    position: "relative",
                                    flexShrink: 0,
                                    width: "clamp(180px, 22vw, 280px)",
                                    height: "clamp(120px, 15vw, 180px)",
                                    borderRadius: "4px",
                                    overflow: "hidden",
                                    background: "#111",
                                }}
                            >
                                <Image
                                    src={img.src}
                                    alt={img.title}
                                    fill
                                    sizes="280px"
                                    className="object-cover"
                                    style={{
                                        filter: "brightness(0.85)",
                                        transition: "transform 0.5s ease, filter 0.4s ease",
                                    }}
                                    onMouseEnter={(e) => {
                                        (e.currentTarget as HTMLImageElement).style.transform = "scale(1.04)";
                                        (e.currentTarget as HTMLImageElement).style.filter = "brightness(1)";
                                    }}
                                    onMouseLeave={(e) => {
                                        (e.currentTarget as HTMLImageElement).style.transform = "scale(1)";
                                        (e.currentTarget as HTMLImageElement).style.filter = "brightness(0.85)";
                                    }}
                                />
                                <span
                                    style={{
                                        position: "absolute",
                                        bottom: "10px",
                                        left: "12px",
                                        fontSize: "0.6rem",
                                        letterSpacing: "0.1em",
                                        textTransform: "uppercase",
                                        color: "rgba(255,255,255,0.6)",
                                        fontFamily: "var(--font-geist-sans), sans-serif",
                                    }}
                                >
                                    {img.title}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
                @media (max-width: 768px) {
                    .svc-body-grid {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>
        </div>
    );
}
