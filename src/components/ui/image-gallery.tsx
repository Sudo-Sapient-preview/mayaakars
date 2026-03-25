"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface GalleryItem {
  id: string;
  title: string;
  category: string;
  coverImage: string;
}

interface ImageGalleryProps {
  projects: GalleryItem[];
}

const PAGE_SIZE = 8; // 4 rows × 2 cols

export default function ImageGallery({ projects }: ImageGalleryProps) {
  const [page, setPage] = useState(0);
  const router = useRouter();

  if (!projects || projects.length === 0) {
    return (
      <div className="flex items-center justify-center py-24 text-white/30 font-serif italic text-lg">
        No projects found.
      </div>
    );
  }

  const totalPages = Math.ceil(projects.length / PAGE_SIZE);
  const pageProjects = projects.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div className="w-full flex flex-col pb-10">
      {/* 2-column grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "3px",
        }}
      >
        {pageProjects.map((project) => (
          <button
            key={project.id}
            type="button"
            className="relative group overflow-hidden outline-none"
            style={{ aspectRatio: "4/3" }}
            onClick={() => router.push(`/projects/${project.id}`)}
            aria-label={project.title}
          >
            <img
              src={project.coverImage}
              alt={project.title}
              className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            />
            {/* Base gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            {/* Hover gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Title */}
            <div className="absolute bottom-0 left-0 right-0 p-5 md:p-7 translate-y-1 group-hover:translate-y-0 transition-transform duration-500">
              <p
                className="text-white leading-tight drop-shadow-md overflow-hidden text-ellipsis whitespace-nowrap"
                style={{
                  fontFamily: '"Cormorant Garamond", serif',
                  fontSize: "clamp(1rem, 1.8vw, 1.4rem)",
                  fontWeight: 400,
                  letterSpacing: "0.02em",
                }}
              >
                {project.title}
              </p>
            </div>

            {/* Arrow indicator on hover */}
            <div className="absolute top-4 right-4 w-8 h-8 rounded-full border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-300">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 10L10 2M10 2H4M10 2v6" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </button>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-10">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="flex items-center gap-2 rounded-full border border-white/20 bg-transparent px-6 py-2.5 text-xs font-sans uppercase tracking-widest text-white/70 transition-all duration-300 hover:bg-white/10 hover:text-white hover:border-white/40 disabled:opacity-25 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4" />
            Prev
          </button>
          <span className="text-xs text-white/30 font-sans tracking-wider">
            {page + 1} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
            className="flex items-center gap-2 rounded-full border border-white/20 bg-transparent px-6 py-2.5 text-xs font-sans uppercase tracking-widest text-white/70 transition-all duration-300 hover:bg-white/10 hover:text-white hover:border-white/40 disabled:opacity-25 disabled:cursor-not-allowed"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
