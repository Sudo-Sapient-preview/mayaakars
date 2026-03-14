"use client";

import { useEffect, useRef } from "react";

export default function PrivacyPage() {
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
        <h1 className="mk-reveal mk-reveal-d1 font-serif text-[clamp(2.75rem,9vw,7rem)] font-medium leading-[0.95] tracking-[0.06em]">
          PRIVACY POLICY
        </h1>
      </section>

      {/* Content */}
      <section
        data-light-section
        className="mk-light-section border-t border-[var(--border)] px-6 py-20"
      >
        <div className="mk-reveal mk-legal-prose mx-auto">

          <p>
            At <strong>Mayaakars</strong>, we respect your privacy and are committed to protecting
            the personal information you share with us. This Privacy Policy outlines how we collect,
            use, and safeguard your information when you interact with our website or services.
          </p>

          <h2>Information We Collect</h2>
          <p>We may collect personal information including, but not limited to:</p>
          <ul>
            <li>Name, email address, and phone number</li>
            <li>Project requirements or enquiry details</li>
            <li>Information submitted through contact or consultation forms</li>
            <li>Technical data such as browser type, IP address, and device information</li>
          </ul>

          <h2>How We Use Your Information</h2>
          <p>Your information is used solely to:</p>
          <ul>
            <li>Respond to enquiries and consultation requests</li>
            <li>Provide design-related services</li>
            <li>Improve our website experience</li>
            <li>Communicate relevant updates or information (only when necessary)</li>
          </ul>
          <p>
            We do not sell, rent, or share your personal information with third parties for
            marketing purposes.
          </p>

          <h2>Data Protection &amp; Security</h2>
          <p>
            We take appropriate technical and organisational measures to protect your information
            against unauthorised access, misuse, or disclosure.
          </p>

          <h2>Cookies &amp; Analytics</h2>
          <p>
            Our website may use cookies to enhance user experience and analyse website traffic.
            You may choose to disable cookies through your browser settings.
          </p>

          <h2>Third-Party Links</h2>
          <p>
            Our website may contain links to third-party platforms. Mayaakars is not responsible
            for the privacy practices of external websites.
          </p>

          <h2>Your Consent</h2>
          <p>
            By using our website, you consent to the collection and use of information as outlined
            in this policy.
          </p>

          <h2>Policy Updates</h2>
          <p>
            This Privacy Policy may be updated periodically. Any changes will be reflected on
            this page.
          </p>

          <h2>Contact Us</h2>
          <p>
            For any questions regarding this Privacy Policy, please contact us at{" "}
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
