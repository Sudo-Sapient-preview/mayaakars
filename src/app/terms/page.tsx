"use client";

import { useEffect, useRef } from "react";

export default function TermsPage() {
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
        <h1 className="mk-reveal mk-reveal-d1 font-serif text-[clamp(2.5rem,8vw,7rem)] font-medium leading-[0.95] tracking-[0.06em]">
          TERMS &amp; CONDITIONS
        </h1>
      </section>

      {/* Content */}
      <section
        data-light-section
        className="mk-light-section border-t border-[var(--border)] px-6 py-20"
      >
        <div className="mk-reveal mk-legal-prose mx-auto">

          <p>
            Please read these Terms &amp; Conditions carefully before using the Mayaakars website
            or engaging our services. By accessing our website, you agree to be bound by these terms.
          </p>

          <h2>Use of Website</h2>
          <p>
            The content on this website is for general informational purposes only. You may not
            reproduce, distribute, or commercially exploit any part of this site without prior
            written consent from Mayaakars.
          </p>

          <h2>Services &amp; Engagements</h2>
          <p>
            All design and architecture services offered by Mayaakars are subject to a separate
            service agreement. Enquiries submitted via the website do not constitute a binding
            contract until confirmed in writing by both parties.
          </p>

          <h2>Intellectual Property</h2>
          <p>
            All designs, drawings, concepts, renders, and creative work produced by Mayaakars remain
            the intellectual property of the studio unless explicitly transferred in writing. Clients
            receive a licence to use delivered work for the agreed purpose only.
          </p>

          <h2>Accuracy of Information</h2>
          <p>
            While we strive to keep information on our website current and accurate, Mayaakars makes
            no warranties about the completeness or accuracy of the content. We reserve the right to
            update or remove content at any time.
          </p>

          <h2>Limitation of Liability</h2>
          <p>
            Mayaakars shall not be liable for any indirect, incidental, or consequential damages
            arising from the use of, or inability to use, our website or services. Our total
            liability in any matter is limited to the fees paid for the specific service in question.
          </p>

          <h2>Third-Party Links</h2>
          <p>
            Our website may link to external websites. Mayaakars is not responsible for the content,
            accuracy, or practices of any third-party sites.
          </p>

          <h2>Governing Law</h2>
          <p>
            These Terms &amp; Conditions are governed by and construed in accordance with the laws
            of India. Any disputes shall be subject to the exclusive jurisdiction of the courts
            in Bengaluru, Karnataka.
          </p>

          <h2>Changes to Terms</h2>
          <p>
            Mayaakars reserves the right to update these Terms &amp; Conditions at any time.
            Continued use of the website after changes constitutes acceptance of the revised terms.
          </p>

          <h2>Contact</h2>
          <p>
            For questions regarding these terms, please write to us at{" "}
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
