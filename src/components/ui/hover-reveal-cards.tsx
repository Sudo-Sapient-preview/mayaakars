import React from 'react';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';


export interface CardItem {
  id: string | number;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  slug: string;
}

export interface HoverRevealCardsProps {
  items: CardItem[];
  className?: string;
  cardClassName?: string;
  onCardClick?: (slug: string) => void;
}

const HoverRevealCards: React.FC<HoverRevealCardsProps> = ({
  items,
  className,
  cardClassName,
  onCardClick,
}) => {
  return (
    <div
      role="list"
      className={cn(
        'group grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4',
        className
      )}
    >
      {items.map((item) => (
        <button
          onClick={() => onCardClick?.(item.slug)}
          key={item.id}
          className="block outline-none text-left w-full h-full"
          type="button"
        >
          <div
            aria-label={`${item.title}, ${item.subtitle}`}
            tabIndex={0}
            className={cn(
              'group/card relative h-[420px] md:h-[500px] lg:h-[600px] w-full cursor-pointer overflow-hidden rounded-2xl border border-[#C49A3A]/20 bg-cover bg-center shadow-lg transition-all duration-700 ease-in-out',
              // On parent hover, apply these styles to all children.
              'group-hover:scale-[0.98] group-hover:opacity-40 group-hover:blur-[2px] group-hover:grayscale-[40%]',
              // On child hover/focus, override parent hover styles to highlight the current item.
              'hover:!scale-[1.02] hover:!opacity-100 hover:!blur-none hover:!grayscale-0 focus-visible:!scale-[1.02] focus-visible:!opacity-100 focus-visible:!blur-none',
              // Accessibility: Add focus ring.
              'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/50 focus-visible:ring-offset-2 ring-offset-background',
              cardClassName
            )}
            style={{ backgroundImage: `url("${item.imageUrl}")` }}
          >
            {/* Gradient overlay for text contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/10 transition-opacity duration-500 group-hover/card:opacity-90" />

            {/* Card Content */}
            <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 text-[#E3E4E0]">
              <div className="transform transition-all duration-500 will-change-transform group-hover/card:-translate-y-1">
                <p className="text-[10px] sm:text-[11px] font-sans uppercase tracking-[0.3em] text-[#C49A3A] opacity-90 mb-4">
                  {item.subtitle}
                </p>
                <h3 className="text-2xl sm:text-3xl font-serif leading-[1.1] font-medium tracking-tight">
                  {item.title}
                </h3>
              </div>

              {/* Expanding Description Block on Hover */}
              <div className="grid grid-rows-[0fr] group-hover/card:grid-rows-[1fr] transition-all duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] mt-2">
                <div className="overflow-hidden">
                  <p className="text-[13px] sm:text-sm font-sans leading-relaxed text-white/70 pt-2 pb-5 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 delay-100">
                    {item.description}
                  </p>
                  <div className="flex items-center gap-3 text-[11px] font-sans uppercase tracking-[0.15em] text-white opacity-0 group-hover/card:opacity-100 transition-all duration-500 delay-200 transform translate-y-4 group-hover/card:translate-y-0 pb-2">
                    <span className="border-b border-white/30 pb-1">Explore Service</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};

export default HoverRevealCards;
