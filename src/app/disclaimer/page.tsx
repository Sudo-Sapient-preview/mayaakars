"use client";

import { useEffect, useRef } from "react";

export default function DisclaimerPage() {
  const pageRef = useRef<HTMLElement>(null);

  useEffect(() => {
    document.body.setAttribute("data-navbar-variant", "light");
    return () => document.body.removeAttribute("data-navbar-variant");
  }, []);

  useEffect(() => {
    const page = pageRef.current;
    if (!page) return;
    const sections = page.querySelectorAll<HTMLElement>("[data-light-section]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-visible", "true");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <main ref={pageRef} className="mk-light-page min-h-screen" data-interactive>

      {/* Hero */}
      <section
        data-light-section
        className="mk-light-section flex min-h-[45vh] flex-col items-center justify-center px-6 py-24 text-center"
      >
        <p className="mk-reveal font-sans text-[0.75rem] tracking-[0.2em] uppercase text-[var(--gold)]">
          Legal
        </p>
        <h1 className="mk-reveal mk-reveal-d1 font-serif text-[clamp(2.75rem,10vw,8rem)] font-medium leading-[0.95] tracking-[0.06em]">
          DISCLAIMER
        </h1>
      </section>

      {/* Content */}
      <section
        data-light-section
        className="mk-light-section border-t border-[var(--border)] px-6 py-20"
      >
        <div className="mk-reveal mk-legal-prose mx-auto">

          <p>
            The information provided on the Mayaakars website is for general informational and
            portfolio purposes only. While we make every effort to keep the content accurate and
            up to date, we make no representations or warranties of any kind — express or implied —
            about the completeness, accuracy, reliability, or suitability of the information.
          </p>

          <h2>No Professional Advice</h2>
          <p>
            The content on this website does not constitute professional architecture or interior
            design advice. All project-specific decisions should be made in consultation with a
            qualified professional engaged directly by you.
          </p>

          <h2>Portfolio &amp; Project Images</h2>
          <p>
            Project images, renders, and photographs displayed on this website are for illustrative
            purposes only. Actual results may vary based on site conditions, material availability,
            and client requirements. All visuals remain the property of Mayaakars unless otherwise
            credited.
          </p>

          <h2>Pricing &amp; Estimates</h2>
          <p>
            Any cost ranges, timelines, or estimates referenced on this website are indicative only
            and do not constitute a formal quotation. Final pricing is subject to detailed scope
            assessment and a signed agreement.
          </p>

          <h2>External Links</h2>
          <p>
            This website may contain links to third-party websites. These are provided for
            convenience only. Mayaakars has no control over the content of those sites and accepts
            no responsibility for them or for any loss or damage that may arise from your use of them.
          </p>

          <h2>Availability</h2>
          <p>
            We do not guarantee that the website will be available at all times or that it will be
            free from errors or viruses. We reserve the right to suspend or withdraw access to the
            website at any time without notice.
          </p>

          <h2>Contact</h2>
          <p>
            If you have any questions about this disclaimer, please contact us at{" "}
            <a href="mailto:info@mayaakars.com" className="text-[var(--gold)] underline underline-offset-2">
              info@mayaakars.com
            </a>
            .
          </p>
        </div>
      </section>
    </main>
  );
}
