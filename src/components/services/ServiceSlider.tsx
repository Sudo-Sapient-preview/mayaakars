"use client";

import React from 'react';
import Image from 'next/image';

type SlideData = { title: string; src: string };

export default function ServiceSlider({ slides }: { slides: SlideData[] }) {
    if (!slides || slides.length === 0) return null;

    return (
        <section className="w-full bg-[#050505] pb-16 px-6 md:px-12 lg:px-16 flex justify-center">
            <div className="grid w-full max-w-[1400px] grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {slides.map((s, i) => (
                    <div key={i} className="flex flex-col gap-3">
                        <div className="group relative h-[320px] md:h-[420px] w-full overflow-hidden rounded-3xl bg-[#111] shadow-xl">
                            <Image
                                src={s.src}
                                alt={s.title}
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                className="object-cover transition-transform duration-[800ms] ease-out group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-500 pointer-events-none" />
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
    );
}
