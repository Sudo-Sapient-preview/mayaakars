"use client";

import { useEffect, useRef } from "react";

export default function ContactPage() {
  const pageRef = useRef<HTMLElement>(null);

  useEffect(() => {
    document.body.setAttribute("data-navbar-variant", "light");
    return () => document.body.removeAttribute("data-navbar-variant");
  }, []);

  useEffect(() => {
    const page = pageRef.current;
    if (!page) {
      return;
    }

    const sections = page.querySelectorAll<HTMLElement>("[data-contact-section]");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-visible", "true");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <main
      ref={pageRef}
      className="mk-contact-page min-h-screen bg-[var(--bg-light)] text-[var(--text-dark)]"
      data-interactive
    >
      <section
        data-contact-section
        className="mk-contact-section flex min-h-[70vh] flex-col items-center justify-center px-6 py-20 text-center"
      >
        <div className="flex flex-col items-center">
          <h1 className="mk-contact-reveal text-balance font-serif text-[clamp(2.75rem,12vw,9.5rem)] font-medium leading-[0.95] tracking-[0.08em]">
            MAYAAKARS
          </h1>
          <div className="mk-contact-reveal mk-contact-delay-1 mt-4 flex flex-col font-sans">
            <p className="m-0 text-base">Phone: +91 88844 96888</p>
            <p className="m-0 text-base">Email: info@mayaakars.com</p>
            <address className="mt-4 not-italic text-[clamp(1rem,2vw,1.35rem)] leading-relaxed text-[var(--text-dark-soft)]">
              303, 2nd Floor, 15th A Cross Rd,
              <br />
              Sector A, Yelahanka Satellite Town,
              <br />
              Yelahanka New Town,
              <br />
              Bengaluru, Karnataka 560064
            </address>
          </div>
        </div>
      </section>

      <section
        data-contact-section
        className="mk-contact-section flex min-h-[70vh] flex-col items-center justify-center px-6 py-20 text-center"
      >
        <h2 className="mk-contact-reveal text-balance font-serif text-[clamp(2rem,5vw,3.5rem)] font-medium leading-tight">
          We are always happy to help
        </h2>

        <form
          className="mk-contact-reveal mk-contact-delay-1 mt-8 flex w-full max-w-[420px] flex-col gap-4 font-sans"
          onSubmit={(event) => event.preventDefault()}
        >
          <input type="email" placeholder="Enter your email" className="mk-contact-input" data-cursor-ignore />
          <input type="tel" placeholder="Enter your phone number" className="mk-contact-input" data-cursor-ignore />
        </form>

        <div className="mk-contact-reveal mk-contact-delay-2 mt-8">
          <button type="button" className="mk-contact-btn" data-interactive>
            Send Enquiry
          </button>
        </div>
      </section>
    </main>
  );
}
