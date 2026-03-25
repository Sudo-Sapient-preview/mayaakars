"use client";

import { SERVICES } from "@/lib/services-data";
import HoverRevealCards from "@/components/ui/hover-reveal-cards";
import { useRouteTransition } from "@/components/navigation/RouteTransitionProvider";

const CARD_ITEMS = SERVICES.map((service) => ({
    id: service.slug,
    title: service.title,
    subtitle: service.subtitle,
    slug: service.slug,
    description: service.description || `Discover our specialized approach to ${service.title}.`,
    imageUrl:
        service.images[0]?.src ??
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=80",
}));

type ServicesAccordionProps = {
    touchPreview?: boolean;
    compactTitles?: boolean;
    titleScale?: "default" | "medium" | "compact";
};

export default function ServicesAccordion({
    // Keeping props signature to not break parent pages importing this
    touchPreview = true,
    compactTitles = false,
    titleScale = "default",
}: ServicesAccordionProps) {
    const { navigate } = useRouteTransition();

    const handleCardClick = (slug: string) => {
        navigate(`/services?service=${slug}`);
    };

    return (
        <section className="mk-home-dark-section relative z-[2] min-h-screen w-full flex flex-col justify-center py-24 overflow-hidden">

            <div className="relative z-10 w-full max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16">
                <div className="mb-12 md:mb-20">
                    <p className="text-[10px] uppercase tracking-[0.4em] text-[#C49A3A] mb-4 font-sans max-[768px]:text-center">
                        Our Expertise
                    </p>
                    <h2 className="text-[clamp(2.5rem,6vw,5rem)] font-serif text-[#E3E4E0] font-light leading-none max-[768px]:text-center">
                        Services
                    </h2>
                </div>

                <div className="flex w-full items-center justify-center">
                    <HoverRevealCards items={CARD_ITEMS} className="max-w-none md:gap-4 lg:gap-6" onCardClick={handleCardClick} />
                </div>
            </div>
        </section>
    );
}
