"use client";

import React, { useState, useEffect, useCallback, useRef, type TouchEvent } from 'react';
import Image from 'next/image';

type SlideData = { title: string; src: string; gallery?: string[] };

export default function ServiceSlider({ slides }: { slides: SlideData[] }) {
    const [lightbox, setLightbox] = useState<{ images: string[]; index: number } | null>(null);
    const [isMobileViewport, setIsMobileViewport] = useState(false);
    const [slideDirection, setSlideDirection] = useState<'next' | 'prev'>('next');
    const touchRef = useRef({ startX: 0, startY: 0 });

    const close = useCallback(() => setLightbox(null), []);
    const prev = useCallback(() => setLightbox(l => {
        if (!l || l.index <= 0) return l;
        setSlideDirection('prev');
        return { ...l, index: l.index - 1 };
    }), []);
    const next = useCallback(() => setLightbox(l => {
        if (!l || l.index >= l.images.length - 1) return l;
        setSlideDirection('next');
        return { ...l, index: l.index + 1 };
    }), []);

    useEffect(() => {
        if (!lightbox) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') close();
            if (e.key === 'ArrowLeft') prev();
            if (e.key === 'ArrowRight') next();
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [lightbox, close, prev, next]);

    useEffect(() => {
        const checkViewport = () => setIsMobileViewport(window.innerWidth <= 768);
        checkViewport();
        window.addEventListener('resize', checkViewport);
        return () => window.removeEventListener('resize', checkViewport);
    }, []);

    const onLightboxTouchStart = (event: TouchEvent<HTMLDivElement>) => {
        const touch = event.touches[0];
        if (!touch) return;
        touchRef.current = { startX: touch.clientX, startY: touch.clientY };
    };

    const onLightboxTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
        const touch = event.changedTouches[0];
        if (!touch) return;

        const dx = touch.clientX - touchRef.current.startX;
        const dy = touch.clientY - touchRef.current.startY;
        const isSwipe = Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.2;
        if (!isSwipe) return;

        event.stopPropagation();
        if (dx < 0) next();
        else prev();
    };

    if (!slides || slides.length === 0) return null;

    return (
        <>
            <style>{`
              @keyframes svc-lb-slide-next {
                from { opacity: 0; transform: translateX(22px) scale(0.985); }
                to { opacity: 1; transform: translateX(0) scale(1); }
              }
              @keyframes svc-lb-slide-prev {
                from { opacity: 0; transform: translateX(-22px) scale(0.985); }
                to { opacity: 1; transform: translateX(0) scale(1); }
              }
              .svc-lb-slide-next { animation: svc-lb-slide-next 0.3s cubic-bezier(0.22, 1, 0.36, 1); }
              .svc-lb-slide-prev { animation: svc-lb-slide-prev 0.3s cubic-bezier(0.22, 1, 0.36, 1); }
            `}</style>

            <section className="w-full bg-[#050505] pb-16 px-6 md:px-12 lg:px-16 flex justify-center">
                <div className="grid w-full max-w-[1400px] grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {slides.map((s, i) => (
                        <div key={i} className="flex flex-col gap-3">
                            <div
                                className={`group relative h-[200px] md:h-[260px] w-full overflow-hidden rounded-3xl bg-[#111] shadow-xl ${s.gallery ? 'cursor-pointer' : ''}`}
                                onClick={() => {
                                    if (!s.gallery) return;
                                    setSlideDirection('next');
                                    setLightbox({ images: s.gallery, index: 0 });
                                }}
                            >
                                <Image
                                    src={s.src}
                                    alt={s.title}
                                    fill
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    className="object-cover transition-transform duration-[800ms] ease-out group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-500 pointer-events-none" />
                                {s.gallery && (
                                    <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm text-[#C49A3A] text-[0.6rem] tracking-[0.25em] uppercase px-3 py-1.5 rounded-full pointer-events-none">
                                        View All
                                    </div>
                                )}
                            </div>
                            {s.title && (
                                <p className="text-center text-[0.7rem] uppercase tracking-[0.3em] text-[#E3E4E0]/50"
                                   style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}>
                                    {s.title}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* Lightbox */}
            {lightbox && (
                <div
                    className="fixed inset-0 z-[999] bg-black/95 flex items-center justify-center"
                    onClick={close}
                >
                    {/* Close */}
                    <button
                        className="absolute top-5 right-6 text-[#E3E4E0]/60 hover:text-[#E3E4E0] text-3xl leading-none transition-colors z-10"
                        onClick={close}
                    >
                        ×
                    </button>

                    {/* Counter */}
                    <span className="absolute top-6 left-1/2 -translate-x-1/2 text-[0.65rem] tracking-[0.35em] text-[#C49A3A] uppercase">
                        {lightbox.index + 1} / {lightbox.images.length}
                    </span>

	                    {/* Prev */}
	                    {!isMobileViewport && lightbox.index > 0 && (
	                        <button
	                            className="absolute left-4 md:left-8 text-[#E3E4E0]/50 hover:text-[#E3E4E0] transition-colors z-10 text-4xl leading-none select-none"
	                            onClick={e => { e.stopPropagation(); prev(); }}
                        >
                            ‹
                        </button>
                    )}

	                    {/* Image */}
	                    <div
	                        className={`relative ${isMobileViewport ? 'w-[96vw] h-[74vh] mx-0' : 'w-full max-w-4xl mx-16 md:mx-24'}`}
	                        style={isMobileViewport ? { touchAction: 'pan-y' } : { aspectRatio: '16/10', touchAction: 'auto' }}
	                        onClick={e => e.stopPropagation()}
	                        onTouchStart={isMobileViewport ? onLightboxTouchStart : undefined}
	                        onTouchEnd={isMobileViewport ? onLightboxTouchEnd : undefined}
	                    >
	                        <Image
	                            key={lightbox.index}
	                            src={lightbox.images[lightbox.index]}
	                            alt={`Bedroom ${lightbox.index + 1}`}
	                            fill
	                            sizes={isMobileViewport ? "96vw" : "90vw"}
	                            className={`object-contain ${isMobileViewport ? (slideDirection === 'next' ? 'svc-lb-slide-next' : 'svc-lb-slide-prev') : ''}`}
	                            priority
	                        />
	                    </div>

	                    {/* Next */}
	                    {!isMobileViewport && lightbox.index < lightbox.images.length - 1 && (
	                        <button
	                            className="absolute right-4 md:right-8 text-[#E3E4E0]/50 hover:text-[#E3E4E0] transition-colors z-10 text-4xl leading-none select-none"
	                            onClick={e => { e.stopPropagation(); next(); }}
                        >
                            ›
                        </button>
                    )}

	                    {/* Thumbnail strip */}
                        {!isMobileViewport && (
	                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
	                            {lightbox.images.map((src, i) => (
                                <button
                                    key={i}
                                    onClick={e => { e.stopPropagation(); setLightbox(l => l ? { ...l, index: i } : l); }}
                                    className={`relative w-10 h-7 overflow-hidden rounded transition-opacity ${i === lightbox.index ? 'opacity-100 ring-1 ring-[#C49A3A]' : 'opacity-40 hover:opacity-70'}`}
                                >
                                    <Image src={src} alt="" fill sizes="40px" className="object-cover" />
                                </button>
                            ))}
	                        </div>
                        )}
                        {isMobileViewport && (
                            <span className="absolute top-12 left-1/2 -translate-x-1/2 text-[0.55rem] tracking-[0.2em] text-[#E3E4E0]/45 uppercase pointer-events-none">
                                Swipe left or right
                            </span>
                        )}
	                </div>
	            )}
        </>
    );
}
