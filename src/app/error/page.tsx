"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorPage() {
  useEffect(() => {
    const root = document.documentElement;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;

    let animationFrameId = 0;

    const animate = () => {
      currentX += (targetX - currentX) * 0.1;
      currentY += (targetY - currentY) * 0.1;

      root.style.setProperty("--x", `${currentX}px`);
      root.style.setProperty("--y", `${currentY}px`);

      animationFrameId = window.requestAnimationFrame(animate);
    };

    const onMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      targetX = t.clientX;
      targetY = t.clientY;
    };

    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      targetX = t.clientX;
      targetY = t.clientY;
    };

    const onDeviceOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma !== null && e.beta !== null) {
        const gamma = Math.max(-45, Math.min(45, e.gamma));
        targetX = window.innerWidth / 2 + (gamma / 45) * (window.innerWidth / 2);

        let beta = e.beta - 45;
        beta = Math.max(-45, Math.min(45, beta));
        targetY = window.innerHeight / 2 + (beta / 45) * (window.innerHeight / 2);
      }
    };

    animate();

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("touchmove", onTouchMove, { passive: true });
    document.addEventListener("touchstart", onTouchStart, { passive: true });

    if (window.DeviceOrientationEvent) {
      window.addEventListener("deviceorientation", onDeviceOrientation);
    }

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchstart", onTouchStart);

      if (window.DeviceOrientationEvent) {
        window.removeEventListener("deviceorientation", onDeviceOrientation);
      }
    };
  }, []);

  return (
    <>
      <style>{`
        .mk-error-overlay {
          position: fixed;
          inset: 0;
          width: 100%;
          height: 100%;
          background-color: var(--bg-dark);
          overflow: hidden;
          z-index: 1000000;
          isolation: isolate;
        }

        .mk-error-overlay * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        @media (pointer: fine) {
          .mk-error-overlay {
            cursor: none;
          }
        }

        .mk-error-overlay .background-layer {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: url("https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000")
            no-repeat center center;
          background-size: cover;
          z-index: 1;
          filter: brightness(0.6) contrast(1.1) grayscale(0.2);
        }

        .mk-error-overlay .darkness-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(5, 5, 5, 0.98);
          z-index: 2;
          mask-image: radial-gradient(
            circle min(600px, 80vw) at var(--x, 50%) var(--y, 50%),
            transparent 5%,
            rgba(0, 0, 0, 1) 85%
          );
          -webkit-mask-image: radial-gradient(
            circle min(600px, 80vw) at var(--x, 50%) var(--y, 50%),
            transparent 5%,
            rgba(0, 0, 0, 1) 85%
          );
        }

        .mk-error-overlay .text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 3;
          text-align: center;
          user-select: none;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
        }

        .mk-error-overlay .text .subtitle {
          font-family: "Geist", sans-serif;
          color: var(--gold);
          font-size: 11px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          font-weight: 500;
          opacity: 0.8;
          text-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
        }

        .mk-error-overlay .text h1 {
          font-family: "Cormorant Garamond", serif;
          color: var(--text-light);
          font-size: clamp(6rem, 15vw, 15rem);
          line-height: 0.8;
          font-weight: 400;
          font-style: italic;
          text-shadow: 0 10px 40px rgba(0, 0, 0, 0.8);
        }

        .mk-error-overlay .text .description {
          font-family: "Geist", sans-serif;
          color: rgba(227, 228, 224, 0.7);
          font-size: clamp(0.9rem, 2vw, 1.1rem);
          letter-spacing: 0.05em;
          font-weight: 300;
          max-width: 400px;
          text-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
        }

        .mk-error-overlay .text .return-home {
          margin-top: 1rem;
          padding: 12px 24px;
          font-family: "Geist", sans-serif;
          font-size: 13px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--gold);
          text-decoration: none;
          border: 1px solid rgba(196, 154, 58, 0.3);
          border-radius: 4px;
          transition: all 0.3s ease;
          pointer-events: auto;
          backdrop-filter: blur(2px);
          background: rgba(0, 0, 0, 0.2);
        }

        .mk-error-overlay .text .return-home:hover {
          background: rgba(196, 154, 58, 0.1);
          border-color: rgba(196, 154, 58, 0.8);
          transform: translateY(-2px);
        }

        .mk-error-overlay .torch-blur {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 4;
          backdrop-filter: blur(4px);
          mask-image: radial-gradient(
            circle min(500px, 70vw) at var(--x, 50%) var(--y, 50%),
            transparent 0%,
            rgba(0, 0, 0, 1) 100%
          );
          -webkit-mask-image: radial-gradient(
            circle min(500px, 70vw) at var(--x, 50%) var(--y, 50%),
            transparent 0%,
            rgba(0, 0, 0, 1) 100%
          );
        }

        .mk-error-overlay .torch-glow {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 10;
          background: radial-gradient(
            circle min(800px, 90vw) at var(--x, 50%) var(--y, 50%),
            rgba(196, 154, 58, 0.05) 0%,
            rgba(255, 255, 255, 0.02) 40%,
            transparent 100%
          );
          mix-blend-mode: screen;
        }
      `}</style>

      <main className="mk-error-overlay">
        <div className="background-layer" />
        <div className="darkness-overlay" />
        <div className="torch-blur" />
        <div className="torch-glow" />

        <div className="text">
          <p className="subtitle">404 Error</p>
          <h1>Lost</h1>
          <p className="description">This suite appears to be unoccupied.</p>
          <Link href="/" className="return-home">
            Return Home
          </Link>
        </div>
      </main>
    </>
  );
}
