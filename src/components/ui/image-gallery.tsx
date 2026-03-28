"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

interface GalleryItem {
  id: string;
  title: string;
  category: string;
  coverImage: string;
}

interface ImageGalleryProps {
  projects: GalleryItem[];
  tabLabel?: string;
}

export default function ImageGallery({
  projects,
  tabLabel = "Our Projects",
}: ImageGalleryProps) {
  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<any>(null);
  const resizeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!projects || projects.length === 0 || !wrapperRef.current) return;

    let mounted = true;

    const init = async () => {
      const { default: gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      if (!mounted || !wrapperRef.current) return;

      const section = wrapperRef.current.querySelector(
        ".psl-section"
      ) as HTMLElement;
      if (!section) return;

      const titlesContainer = section.querySelector(
        ".psl-titles-container"
      ) as HTMLElement;
      const titlesWrap = section.querySelector(".psl-titles") as HTMLElement;
      const bgImg = section.querySelector(".psl-bg-img img") as HTMLImageElement;
      const imagesWrap = section.querySelector(".psl-images") as HTMLElement;
      const titleEls = Array.from(
        titlesWrap.querySelectorAll("h1")
      ) as HTMLElement[];
      const imageEls = Array.from(
        imagesWrap.querySelectorAll(".psl-img")
      ) as HTMLElement[];

      const count = projects.length;
      const gap = count > 1 ? Math.min(0.08, 0.65 / (count - 1)) : 0.08;
      const speed = 0.3;
      const scrollMult = Math.max(8, count + 4);

      let currentActive = 0;

      function calcArc() {
        const small = window.innerWidth <= 768;
        const cw = window.innerWidth * (small ? 0.55 : 0.3);
        const ch = window.innerHeight;
        const sx = cw - (small ? 140 : 220);
        return {
          sx, sy: -200, ey: ch + 200,
          cx: sx + (small ? 500 * 0.45 : 500), cy: ch / 2,
        };
      }

      let arc = calcArc();

      function bezier(t: number) {
        const x = (1 - t) * (1 - t) * arc.sx + 2 * (1 - t) * t * arc.cx + t * t * arc.sx;
        const y = (1 - t) * (1 - t) * arc.sy + 2 * (1 - t) * t * arc.cy + t * t * arc.ey;
        return { x, y };
      }

      function imgProg(i: number, overall: number) {
        const s = i * gap;
        const e = s + speed;
        if (overall < s) return -1;
        if (overall > e) return 2;
        return (overall - s) / speed;
      }

      // Initial state: first title centered, rest below
      const vh = window.innerHeight;
      gsap.set(titlesWrap, { y: vh * 0.3 });
      imageEls.forEach((img) => gsap.set(img, { opacity: 0 }));
      titlesContainer.style.setProperty("--bo", "1");
      titlesContainer.style.setProperty("--ao", "1");

      if (triggerRef.current) {
        triggerRef.current.kill();
        triggerRef.current = null;
      }
      if (!mounted) return;

      triggerRef.current = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => `+=${window.innerHeight * scrollMult}px`,
        pin: true,
        pinSpacing: true,
        scrub: 1.5,
        onUpdate: (self: any) => {
          if (!mounted) return;
          const p = self.progress;
          const sp = p; // 0 → 1 maps directly

          const vh = window.innerHeight;
          const th = titlesWrap.scrollHeight;
          // Start from 30% down, scroll to fully above viewport
          const startY = vh * 0.3;
          const endY = -(th + 50);
          const currentY = startY + sp * (endY - startY);
          gsap.set(titlesWrap, { y: currentY });

          imageEls.forEach((img, i) => {
            const ip = imgProg(i, sp);
            if (ip < 0 || ip > 1) {
              gsap.set(img, { opacity: 0 });
            } else {
              const pos = bezier(ip);
              gsap.set(img, { x: pos.x - 100, y: pos.y - 75, opacity: 1 });
            }
          });

          // Active title
          const mid = vh / 2;
          let ci = 0, cd = Infinity;
          titleEls.forEach((t, i) => {
            const r = t.getBoundingClientRect();
            const d = Math.abs(r.top + r.height / 2 - mid);
            if (d < cd) { cd = d; ci = i; }
          });
          if (ci !== currentActive) {
            titleEls[currentActive].style.opacity = "0.25";
            titleEls[ci].style.opacity = "1";
            if (bgImg && projects[ci]) bgImg.src = projects[ci].coverImage;
            currentActive = ci;
          }
        },
      });

      resizeRef.current = () => {
        arc = calcArc();
        ScrollTrigger.refresh();
      };
      window.addEventListener("resize", resizeRef.current);
    };

    init();

    return () => {
      mounted = false;
      if (triggerRef.current) {
        triggerRef.current.kill();
        triggerRef.current = null;
      }
      if (resizeRef.current) {
        window.removeEventListener("resize", resizeRef.current);
        resizeRef.current = null;
      }
    };
  }, [projects, tabLabel]);

  if (!projects || projects.length === 0) {
    return (
      <div className="flex items-center justify-center py-24 text-white/30 font-serif italic text-lg">
        No projects found.
      </div>
    );
  }

  return (
    <div ref={wrapperRef}>
      <style>{`
        .psl-section {
          position: relative;
          width: 100%;
          height: 100dvh;
          overflow: hidden;
          background: #0a0a0a;
        }
        .psl-bg-img {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
        }
        .psl-bg-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.55;
        }
        .psl-bg-img::after {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at center, rgba(10,10,10,0.05), rgba(10,10,10,0.55) 75%);
        }
        .psl-titles-container {
          position: absolute;
          top: 0;
          left: 15vw;
          width: 100%;
          height: 100%;
          overflow: hidden;
          clip-path: polygon(50vh 0px, 0px 50%, 50vh 100%, 100% calc(100% + 100vh), 100% -100vh);
          --bo: 1;
          --ao: 1;
        }
        .psl-titles-container::before,
        .psl-titles-container::after {
          content: "";
          position: absolute;
          width: 100vh;
          height: 2.5px;
          background: #C49A3A;
          pointer-events: none;
          transition: opacity 0.3s ease;
          z-index: 10;
        }
        .psl-titles-container::before {
          top: 0; left: 0;
          transform: rotate(-45deg) translate(-7rem);
          opacity: var(--bo);
        }
        .psl-titles-container::after {
          bottom: 0; left: 0;
          transform: rotate(45deg) translate(-7rem);
          opacity: var(--ao);
        }
        .psl-titles {
          position: relative;
          left: 15%;
          width: 75%;
          height: 100%;
          display: flex;
          flex-direction: column;
          gap: 5rem;
          z-index: 2;
          will-change: transform;
        }
        .psl-titles h1 {
          font-family: var(--font-cormorant), serif;
          font-size: clamp(2rem, 5.5vw, 3.8rem);
          font-weight: 400;
          color: #E3E4E0;
          opacity: 0.25;
          transition: opacity 0.35s ease;
          cursor: pointer;
          letter-spacing: 0.02em;
          line-height: 1.1;
          white-space: nowrap;
        }
        .psl-titles h1:hover {
          text-decoration: underline;
          text-underline-offset: 6px;
          text-decoration-color: rgba(196,154,58,0.4);
        }
        .psl-images {
          position: absolute;
          top: 0;
          right: 0;
          width: 50%;
          min-width: 300px;
          height: 100%;
          z-index: 1;
          pointer-events: none;
        }
        .psl-img {
          position: absolute;
          width: 200px;
          height: 150px;
          will-change: transform, opacity;
          border-radius: 4px;
          overflow: hidden;
        }
        .psl-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .psl-header {
          position: absolute;
          top: 50%;
          left: 10%;
          transform: translateY(-50%);
          color: #C49A3A;
          z-index: 2;
          font-family: var(--font-geist-sans), sans-serif;
          font-size: clamp(0.7rem, 1.2vw, 0.85rem);
          letter-spacing: 0.3em;
          text-transform: uppercase;
        }
        @media (max-width: 1000px) {
          .psl-titles-container { clip-path: none; }
          .psl-titles-container::before,
          .psl-titles-container::after { display: none; }
          .psl-titles { left: 5%; width: 90%; }
          .psl-header { display: none; }
        }
        @media (max-width: 768px) {
          .psl-titles-container { left: 0; width: 100%; padding: 0 1.5rem; }
          .psl-titles { left: 0; width: 100%; gap: 2.5rem; }
          .psl-titles h1 { font-size: clamp(1.4rem, 7.5vw, 2.2rem); white-space: normal; }
          .psl-images { display: none; }
        }
      `}</style>

      <section className="psl-section">
        <div className="psl-bg-img">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={projects[0]?.coverImage} alt="background" />
        </div>

        <div className="psl-titles-container">
          <div className="psl-titles">
            {projects.map((project, index) => (
              <h1
                key={project.id}
                style={{ opacity: index === 0 ? 1 : 0.25 }}
                onClick={() => router.push(`/projects/${project.id}`)}
              >
                {project.title}
              </h1>
            ))}
          </div>
        </div>

        <div className="psl-images">
          {projects.map((project) => (
            <div key={project.id} className="psl-img">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={project.coverImage} alt={project.title} />
            </div>
          ))}
        </div>

        <div className="psl-header">
          <p>{tabLabel}</p>
        </div>
      </section>
    </div>
  );
}
