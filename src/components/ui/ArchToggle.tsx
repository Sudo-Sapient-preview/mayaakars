"use client";

interface ArchToggleProps {
    value: "residential" | "commercial";
    onChange: (v: "residential" | "commercial") => void;
}

// Pill dimensions
const W = 54;
const H = 126;
const PAD = 6;
const KNOB_H = 54;

export default function ArchToggle({ value, onChange }: ArchToggleProps) {
    const isResidential = value === "residential";

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            {/* Top label — COMMERCIAL */}
            <span
                onClick={() => onChange("commercial")}
                style={{
                    fontFamily: "Georgia, serif",
                    fontSize: 7,
                    fontWeight: "bold",
                    letterSpacing: "1.8px",
                    color: "#C49A3A",
                    opacity: isResidential ? 0.3 : 1,
                    transition: "opacity 0.4s ease",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    userSelect: "none",
                }}
            >
                COMMERCIAL
            </span>

            {/* Pill */}
            <div
                onClick={() => onChange(isResidential ? "commercial" : "residential")}
                style={{ position: "relative", width: W, height: H, cursor: "pointer", userSelect: "none", flexShrink: 0 }}
            >
                {/* Shell */}
                <div style={{
                    position: "absolute", inset: 0,
                    borderRadius: W / 2,
                    background: "#0d0b06",
                    boxShadow: `
                        2px 2px 5px rgba(196,154,58,0.16),
                        -1px -1px 3px rgba(0,0,0,0.9),
                        inset 3px 3px 10px rgba(0,0,0,0.95),
                        inset -2px -2px 6px rgba(196,154,58,0.07),
                        inset 0 0 16px rgba(0,0,0,0.8)
                    `,
                    border: "1px solid rgba(196,154,58,0.12)",
                }} />

                {/* Track */}
                <div style={{
                    position: "absolute",
                    left: PAD, right: PAD, top: PAD, bottom: PAD,
                    borderRadius: W / 2 - 2,
                    background: "#080602",
                    boxShadow: "inset 2px 2px 8px rgba(0,0,0,0.98), inset -1px -1px 4px rgba(196,154,58,0.05)",
                }} />

                {/* Knob */}
                <div style={{
                    position: "absolute",
                    left: PAD, right: PAD,
                    height: KNOB_H,
                    borderRadius: W / 2 - 4,
                    background: "linear-gradient(160deg, #e8c860 0%, #c49a3a 35%, #a07820 65%, #7a5c10 100%)",
                    boxShadow: `
                        0 -2px 6px rgba(240,200,80,0.28),
                        0  2px 6px rgba(0,0,0,0.7),
                        inset 0 2px 5px rgba(255,235,140,0.32),
                        inset 0 -2px 6px rgba(0,0,0,0.5)
                    `,
                    top: isResidential ? H - PAD - KNOB_H : PAD,
                    transition: "top 0.75s cubic-bezier(0.45, 0.05, 0.55, 0.95)",
                    overflow: "hidden",
                }}>
                    {/* Shine */}
                    <div style={{
                        position: "absolute",
                        top: 4, left: 5, right: 5,
                        height: "35%",
                        borderRadius: "20px 20px 50% 50%",
                        background: "linear-gradient(180deg, rgba(255,240,160,0.38) 0%, rgba(255,220,100,0) 100%)",
                    }} />
                </div>
            </div>

            {/* Bottom label — RESIDENTIAL */}
            <span
                onClick={() => onChange("residential")}
                style={{
                    fontFamily: "Georgia, serif",
                    fontSize: 7,
                    fontWeight: "bold",
                    letterSpacing: "1.8px",
                    color: "#C49A3A",
                    opacity: isResidential ? 1 : 0.3,
                    transition: "opacity 0.4s ease",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    userSelect: "none",
                }}
            >
                RESIDENTIAL
            </span>
        </div>
    );
}
