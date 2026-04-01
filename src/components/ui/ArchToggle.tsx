"use client";

import React, { useEffect, useRef, useState } from "react";

interface ArchToggleProps {
    value: "residential" | "commercial";
    onChange: (v: "residential" | "commercial") => void;
}

const STIFFNESS = 55;
const DAMPING = 10;
const MASS = 1.4;

export default function ArchToggle({ value, onChange }: ArchToggleProps) {
    // Keep local state for immediate visual feedback
    const [localValue, setLocalValue] = useState(value);
    const isRes = localValue === "residential";

    // Sync local state when external value changes
    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    const springRef = useRef({
        top: { pos: value === "residential" ? 6 : -6, vel: 0, target: value === "residential" ? 6 : -6 },
        bot: { pos: value === "residential" ? -6 : 6, vel: 0, target: value === "residential" ? -6 : 6 }
    });

    const rafIdRef = useRef<number | null>(null);
    const lastTRef = useRef<number | null>(null);

    const panelTopRef = useRef<HTMLDivElement>(null);
    const panelBotRef = useRef<HTMLDivElement>(null);
    const gripTopRef = useRef<HTMLDivElement>(null);
    const gripBotRef = useRef<HTMLDivElement>(null);

    const stylePanel = (el: HTMLElement, grip: HTMLElement, pos: number) => {
        const pressed = pos > 0;
        const t = Math.max(-1, Math.min(1, pos / 6));
        el.style.transform = `translateY(${pos * 1.0}px) scaleY(${1 - Math.abs(t) * 0.012})`;

        if (pressed) {
            el.style.background = `linear-gradient(160deg, hsl(35,${60 + t * 10}%,${18 - t * 6}%) 0%, hsl(35,${55 + t * 8}%,${14 - t * 5}%) 40%, hsl(35,${50 + t * 6}%,${10 - t * 4}%) 100%)`;
            el.style.boxShadow = `0 1px 2px rgba(0,0,0,0.95), inset 0 ${2 + t * 2}px ${6 + t * 3}px rgba(0,0,0,0.95), inset 0 -1px 4px rgba(0,0,0,0.7), inset 2px 0 6px rgba(0,0,0,0.6)`;
            grip.style.background = `rgba(0,0,0,${0.4 + t * 0.12})`;
            grip.style.boxShadow = `inset 0 ${2 + t * 1}px ${6 + t * 2}px rgba(0,0,0,0.95)`;
        } else {
            const lift = Math.abs(t);
            el.style.background = `linear-gradient(160deg, hsl(42,${75 + lift * 8}%,${46 + lift * 6}%) 0%, hsl(38,${65 + lift * 6}%,${36 + lift * 4}%) 35%, hsl(35,${55 + lift * 4}%,${24 + lift * 3}%) 65%, hsl(33,${50 + lift * 3}%,${16 + lift * 2}%) 100%)`;
            el.style.boxShadow = `0 ${2 + lift * 2}px ${8 + lift * 4}px rgba(0,0,0,0.9), 0 -1px 4px rgba(0,0,0,0.5), inset 0 ${1 + lift * 1}px ${4 + lift * 2}px rgba(255,232,${120 + lift * 20},${0.3 + lift * 0.15}), inset 0 -2px 6px rgba(0,0,0,0.5)`;
            grip.style.background = `rgba(0,0,0,${0.3 - lift * 0.05})`;
            grip.style.boxShadow = `inset 0 2px 5px rgba(0,0,0,0.85), 0 1px 1px rgba(196,154,58,${0.1 + lift * 0.12})`;
        }
    };

    const tick = (ts: number) => {
        if (!lastTRef.current) lastTRef.current = ts;
        const dt = Math.min((ts - lastTRef.current) / 1000, 0.05);
        lastTRef.current = ts;

        let moving = false;
        const s = springRef.current;
        (["top", "bot"] as const).forEach((k) => {
            const state = s[k];
            const force = -STIFFNESS * (state.pos - state.target) - DAMPING * state.vel;
            state.vel += (force / MASS) * dt;
            state.pos += state.vel * dt;
            if (Math.abs(state.pos - state.target) > 0.005 || Math.abs(state.vel) > 0.005) moving = true;
        });

        if (panelTopRef.current && gripTopRef.current) stylePanel(panelTopRef.current, gripTopRef.current, s.top.pos);
        if (panelBotRef.current && gripBotRef.current) stylePanel(panelBotRef.current, gripBotRef.current, s.bot.pos);

        if (moving) rafIdRef.current = requestAnimationFrame(tick);
        else { rafIdRef.current = null; lastTRef.current = null; }
    };

    useEffect(() => {
        const s = springRef.current;
        if (isRes) {
            s.top.target = 6; s.top.vel = -4; s.bot.target = -6; s.bot.vel = 4;
        } else {
            s.top.target = -6; s.top.vel = 4; s.bot.target = 6; s.bot.vel = -4;
        }
        if (!rafIdRef.current) {
            lastTRef.current = null;
            rafIdRef.current = requestAnimationFrame(tick);
        }
    }, [isRes]);

    // Initial paint on mount
    useEffect(() => {
        const s = springRef.current;
        if (panelTopRef.current && gripTopRef.current) stylePanel(panelTopRef.current, gripTopRef.current, s.top.pos);
        if (panelBotRef.current && gripBotRef.current) stylePanel(panelBotRef.current, gripBotRef.current, s.bot.pos);
        return () => { if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current); };
    }, []);

    const handleToggle = (v: "residential" | "commercial") => {
        if (v === localValue) return;
        setLocalValue(v);
        onChange(v);
    };

    return (
        <div className="arch-toggle-container">
            <style>{`
                .arch-toggle-container {
                    display: flex; flex-direction: column; align-items: center; justify-content: center;
                    user-select: none; position: relative; z-index: 100;
                }
                .label {
                    font-family: Georgia, serif; font-size: 8px; font-weight: bold;
                    letter-spacing: 2px; color: #C49A3A; transition: opacity 0.6s;
                    cursor: pointer; padding: 4px;
                }
                .label-top { margin-bottom: 8px; }
                .label-bot { margin-top: 8px; }

                .switch-shell {
                    width: 44px; height: 100px; border-radius: 12px;
                    background: #0a0804; border: 1px solid rgba(196,154,58,0.2);
                    box-shadow: -1px -1px 4px rgba(196,154,58,0.1), 1px 1px 4px rgba(0,0,0,0.9), inset 0 0 10px rgba(0,0,0,0.6);
                    padding: 4px; display: flex; flex-direction: column; gap: 3px; cursor: pointer; overflow: hidden;
                }
                .panel {
                   flex: 1; border-radius: 8px; position: relative;
                   display: flex; align-items: center; justify-content: center;
                   will-change: transform;
                }
                .grip { width: 18px; height: 9px; border-radius: 5px; pointer-events: none; }
                .panel-top::before { content:''; position:absolute; top:2px; left:4px; right:4px; height:2px; border-radius:2px; background:linear-gradient(90deg, transparent, rgba(255,232,120,0.3) 30%, rgba(255,232,120,0.3) 70%, transparent); pointer-events:none; }
                .panel-bot::after { content:''; position:absolute; bottom:2px; left:4px; right:4px; height:2px; border-radius:2px; background:linear-gradient(90deg, transparent, rgba(255,232,120,0.3) 30%, rgba(255,232,120,0.3) 70%, transparent); pointer-events:none; }
            `}</style>
            
            <div className="label label-top" style={{ opacity: isRes ? 1 : 0.3 }} onClick={() => handleToggle("residential")}>RESIDENTIAL</div>
            <div className="switch-shell" onClick={() => handleToggle(isRes ? "commercial" : "residential")}>
                <div className="panel panel-top" ref={panelTopRef}><div className="grip" ref={gripTopRef}></div></div>
                <div className="panel panel-bot" ref={panelBotRef}><div className="grip" ref={gripBotRef}></div></div>
            </div>
            <div className="label label-bot" style={{ opacity: isRes ? 0.3 : 1 }} onClick={() => handleToggle("commercial")}>COMMERCIAL</div>
        </div>
    );
}
