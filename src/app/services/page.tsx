import ServicesAccordion from "@/components/home/ServicesAccordion";
import Philosophy from "@/components/home/Philosophy";

export default function ServicesPage() {
  return (
    <main className="bg-[#050505] text-[#E3E4E0]">
      <section className="border-b border-white/[0.08] px-6 py-24 text-center md:py-28">
        <p
          className="mb-5 text-[0.68rem] uppercase tracking-[0.42em] text-[#C49A3A]"
          style={{ fontFamily: "var(--font-mplus), 'Inter', sans-serif" }}
        >
          Our Services
        </p>
        <h1
          className="mx-auto mb-6 max-w-5xl text-[clamp(2.2rem,7vw,5rem)] uppercase leading-[0.92] text-white"
          style={{ fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif" }}
        >
          Explore What We Design
        </h1>
        <p className="mx-auto max-w-2xl text-sm leading-relaxed text-white/65 md:text-base">
          Select a service to view detailed scope, process, and examples.
        </p>
      </section>
      <ServicesAccordion touchPreview={false} compactTitles />
      <Philosophy />
    </main>
  );
}
