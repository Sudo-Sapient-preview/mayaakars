"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface GalleryItem {
  id: string;
  title: string;
  category: string;
  coverImage: string;
}

interface ImageGalleryProps {
  projects: GalleryItem[];
  itemsPerRow?: number;
}

const ROWS_PER_PAGE = 3;

export default function ImageGallery({ projects, itemsPerRow = 5 }: ImageGalleryProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const PAGE_SIZE = itemsPerRow * ROWS_PER_PAGE;

  if (!projects || projects.length === 0) {
    return (
      <div className="flex items-center justify-center py-24 text-white/30 font-serif italic text-lg">
        No projects found.
      </div>
    );
  }

  const totalPages = Math.ceil(projects.length / PAGE_SIZE);
  const pageProjects = projects.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  // Split into rows of itemsPerRow
  const rows: GalleryItem[][] = [];
  for (let i = 0; i < pageProjects.length; i += itemsPerRow) {
    rows.push(pageProjects.slice(i, i + itemsPerRow));
  }

  return (
    <div className="w-full flex flex-col gap-[3px] px-6 md:px-12 lg:px-16 pb-10">
      {/* Rows */}
      <div className="flex flex-col gap-[3px]">
        {rows.map((row, rowIdx) => {
          const isSparse = row.length < itemsPerRow;
          const rowH = isSparse ? "clamp(600px, 75vh, 860px)" : "clamp(440px, 55vh, 620px)";
          return (
          <div
            key={rowIdx}
            className="flex items-center gap-[3px] w-full"
            style={{ height: rowH }}
          >
            {row.map((project) => {
              const isHovered = hovered === project.id;
              const isAnyHovered = hovered !== null;
              const N = row.length;

              return (
                <button
                  key={project.id}
                  type="button"
                  className="relative group overflow-hidden rounded-[2px] h-full outline-none flex-shrink-0"
                  style={{
                    width: isHovered
                      ? `min(500px, 48%)`
                      : isAnyHovered
                      ? `calc((100% - min(500px, 48%) - ${(N - 1) * 3}px) / ${N - 1})`
                      : `calc((100% - ${(N - 1) * 3}px) / ${N})`,
                    transition: "width 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
                  }}
                  onClick={() => {}}
                  onMouseEnter={() => setHovered(project.id)}
                  onMouseLeave={() => setHovered(null)}
                  aria-label={project.title}
                >
                  <img
                    src={project.coverImage}
                    alt={project.title}
                    className="h-full w-full object-cover object-center transition-transform duration-[700ms] ease-out group-hover:scale-105"
                  />
                  {/* Gradient always-on (subtle) */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  {/* Stronger on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

                  {/* Title */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-1 group-hover:translate-y-0 transition-transform duration-400">
                    <p className="font-serif text-sm md:text-base text-white leading-tight drop-shadow-md whitespace-nowrap overflow-hidden text-ellipsis">
                      {project.title}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
          );
        })}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-8">
          <button
            onClick={() => { setPage((p) => Math.max(0, p - 1)); setHovered(null); }}
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
            onClick={() => { setPage((p) => Math.min(totalPages - 1, p + 1)); setHovered(null); }}
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
