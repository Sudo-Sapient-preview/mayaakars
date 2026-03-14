type PagePlaceholderProps = {
  title: string;
  subtitle: string;
};

export default function PagePlaceholder({ title, subtitle }: PagePlaceholderProps) {
  return (
    <main className="min-h-screen bg-[var(--bg-dark)] text-[var(--text-light)]">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center justify-center px-6 text-center">
        <p className="mb-4 font-serif text-sm uppercase tracking-[0.2em] text-[var(--gold)]">Mayaakars</p>
        <h1 className="font-serif text-4xl uppercase tracking-[0.12em] sm:text-5xl md:text-6xl">{title}</h1>
        <p className="mt-5 max-w-2xl font-sans text-sm text-white/70 sm:text-base">{subtitle}</p>
      </section>
    </main>
  );
}
