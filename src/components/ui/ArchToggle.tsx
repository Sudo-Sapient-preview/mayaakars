"use client";

interface ArchToggleProps {
    value: "residential" | "commercial";
    onChange: (v: "residential" | "commercial") => void;
}

export default function ArchToggle({ value, onChange }: ArchToggleProps) {
    const isResidential = value === "residential";

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 12,
            }}
        >
            {/* Top label */}
            <span
                style={{
                    fontFamily: "Georgia, serif",
                    fontSize: 9,
                    fontWeight: "bold",
                    letterSpacing: "2px",
                    color: "#C49A3A",
                    opacity: isResidential ? 0.3 : 1,
                    transition: "opacity 0.4s ease",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    userSelect: "none",
                }}
                onClick={() => onChange("commercial")}
            >
                COMMERCIAL
            </span>

            {/* Pill toggle */}
            <div
                onClick={() => onChange(isResidential ? "commercial" : "residential")}
                style={{
                    position: "relative",
                    width: 90,
                    height: 200,
                    cursor: "pointer",
                    userSelect: "none",
                    flexShrink: 0,
                }}
            >
                {/* Outer shell */}
                <div style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: 45,
                    background: "#0d0b06",
                    boxShadow: `
                        2px 2px 6px rgba(196,154,58,0.18),
                        -1px -1px 4px rgba(0,0,0,0.9),
                        inset 4px 4px 12px rgba(0,0,0,0.95),
                        inset -2px -2px 8px rgba(196,154,58,0.08),
                        inset 0 0 20px rgba(0,0,0,0.8)
                    `,
                    border: "1px solid rgba(196,154,58,0.12)",
                }} />

                {/* Inner track */}
                <div style={{
                    position: "absolute",
                    left: 10, right: 10, top: 10, bottom: 10,
                    borderRadius: 40,
                    background: "#080602",
                    boxShadow: `
                        inset 3px 3px 10px rgba(0,0,0,0.98),
                        inset -1px -1px 6px rgba(196,154,58,0.06)
                    `,
                }} />

                {/* Sliding knob */}
                <div style={{
                    position: "absolute",
                    left: 10,
                    right: 10,
                    height: 88,
                    borderRadius: 36,
                    background: "linear-gradient(160deg, #e8c860 0%, #c49a3a 35%, #a07820 65%, #7a5c10 100%)",
                    boxShadow: `
                        0 -3px 8px rgba(240,200,80,0.3),
                        0  3px 8px rgba(0,0,0,0.7),
                        2px 0  6px rgba(0,0,0,0.5),
                        -2px 0 6px rgba(240,200,80,0.15),
                        inset 0 2px 6px rgba(255,235,140,0.35),
                        inset 0 -3px 8px rgba(0,0,0,0.5)
                    `,
                    top: isResidential ? "calc(100% - 98px)" : 10,
                    transition: "top 0.75s cubic-bezier(0.45, 0.05, 0.55, 0.95)",
                    overflow: "hidden",
                }}>
                    {/* Knob shine */}
                    <div style={{
                        position: "absolute",
                        top: 6, left: 8, right: 8,
                        height: "35%",
                        borderRadius: "30px 30px 50% 50%",
                        background: "linear-gradient(180deg, rgba(255,240,160,0.4) 0%, rgba(255,220,100,0) 100%)",
                    }} />
                </div>
            </div>

            {/* Bottom label */}
            <span
                style={{
                    fontFamily: "Georgia, serif",
                    fontSize: 9,
                    fontWeight: "bold",
                    letterSpacing: "2px",
                    color: "#C49A3A",
                    opacity: isResidential ? 1 : 0.3,
                    transition: "opacity 0.4s ease",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    userSelect: "none",
                }}
                onClick={() => onChange("residential")}
            >
                RESIDENTIAL
            </span>
        </div>
    );
}
