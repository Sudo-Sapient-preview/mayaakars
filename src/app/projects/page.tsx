import ProjectsCarousel from "@/components/home/ProjectsCarousel";
import Philosophy from "@/components/home/Philosophy";

export default function ProjectsPage() {
    return (
        <main className="bg-[#050505] text-[#E3E4E0]">
            <section className="px-6 py-24 text-center md:py-28">
                <p
                    className="mb-5 text-[0.68rem] uppercase tracking-[0.42em] text-[#C49A3A]"
                    style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
                >
                    Our Work
                </p>
                <h1
                    className="mx-auto mb-6 max-w-5xl text-[clamp(2.2rem,7vw,5rem)] uppercase leading-[0.92] text-white"
                    style={{ fontFamily: "var(--font-cormorant), serif" }}
                >
                    Explore Our Projects
                </h1>
                <p className="mx-auto max-w-2xl text-sm leading-relaxed text-white/65 md:text-base">
                    Drag through selected work across architecture, interiors, and execution.
                </p>
            </section>
            <ProjectsCarousel />
            <Philosophy />
        </main>
    );
}
