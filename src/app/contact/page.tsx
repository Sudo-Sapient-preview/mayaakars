"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

type SubmitState = "idle" | "sending" | "done";

export default function ContactPage() {
  const pageRef = useRef<HTMLElement>(null);
  const [status, setStatus] = useState<SubmitState>("idle");
  const [submitError, setSubmitError] = useState<string>("");

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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "sending") return;

    const form = event.currentTarget;
    const formData = new FormData(form);

    setStatus("sending");
    setSubmitError("");

    const payload = {
      fullName: String(formData.get("fullName") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim(),
      company: String(formData.get("company") ?? "").trim(),
      location: String(formData.get("location") ?? "").trim(),
      message: String(formData.get("message") ?? "").trim(),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      setStatus("done");
      form.reset();
    } catch {
      setStatus("idle");
      setSubmitError("We could not send your enquiry right now. Please try again in a moment.");
    }
  };

  const buttonLabel =
    status === "sending" ? "Sending..." : status === "done" ? "Thank you!" : "Send Enquiry";

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
        <div className="flex w-full max-w-3xl flex-col items-center">
          <p className="mk-contact-reveal uppercase tracking-[0.35em] text-[10px] font-semibold text-[var(--gold)]">
            Contact Us
          </p>
          <h1 className="mk-contact-reveal mk-contact-delay-1 mt-3 text-balance font-serif text-[clamp(2.1rem,6vw,4rem)] font-medium leading-[1]">
            Get in Touch
          </h1>
          <p className="mk-contact-reveal mk-contact-delay-1 mt-4 max-w-2xl text-sm leading-relaxed text-[var(--text-dark-soft)] md:text-base">
            Whether you are planning a project, exploring a collaboration, or looking for a long-term design partner, we would be happy to hear from you.
          </p>
          <div className="mk-contact-reveal mk-contact-delay-2 mt-8 flex flex-col font-sans">
            <p className="m-0 text-base font-medium">Mayaakars</p>
            <p className="m-0 text-sm text-[var(--text-dark-soft)]">Architecture &amp; Interior Design Studio</p>
            <p className="m-0 text-base">Phone: +91 97318 47847</p>
            <p className="m-0 text-base">Email: mail@ordientgroup.com</p>
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
          Schedule a Consultation
        </h2>
        <p className="mk-contact-reveal mk-contact-delay-1 mt-4 max-w-2xl text-sm leading-relaxed text-[var(--text-dark-soft)] md:text-base">
          Have a project or collaboration in mind? Share a few details and our team will get back to you shortly.
        </p>

        {status !== "done" ? (
          <form
            className="mk-contact-reveal mk-contact-delay-2 mt-8 flex w-full max-w-3xl flex-col gap-4 font-sans"
            onSubmit={handleSubmit}
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                className="mk-contact-input"
                data-cursor-ignore
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                className="mk-contact-input"
                data-cursor-ignore
                required
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                className="mk-contact-input"
                data-cursor-ignore
                required
              />
              <input
                type="text"
                name="company"
                placeholder="Company Name (optional)"
                className="mk-contact-input"
                data-cursor-ignore
              />
            </div>

            <div className="grid grid-cols-1 gap-4">
              <input
                type="text"
                name="location"
                placeholder="Location / Country"
                className="mk-contact-input"
                data-cursor-ignore
                required
              />
            </div>

            <textarea
              name="message"
              placeholder="Message / Project Brief"
              className="mk-contact-textarea"
              data-cursor-ignore
            />

            <p className="mk-contact-note">
              We respect your privacy. Your information will be used only to respond to your enquiry.
            </p>

            <div className="mk-contact-reveal mk-contact-delay-2 mt-6">
              <button
                type="submit"
                className="mk-contact-btn"
                data-interactive
                data-state={status}
                disabled={status === "sending"}
              >
                {buttonLabel}
              </button>
            </div>

            {submitError ? (
              <p className="mt-4 text-sm text-[var(--text-dark-soft)]" role="alert">
                {submitError}
              </p>
            ) : null}
          </form>
        ) : (
          <div
            className="mk-thankyou-card mk-contact-reveal mk-contact-delay-1 mt-8"
            role="status"
            aria-live="polite"
          >
            <div className="mk-thankyou-icon" aria-hidden="true">✓</div>
            <p className="mk-thankyou-text">Thank you for reaching out. We&apos;ll get back to you shortly.</p>
          </div>
        )}
      </section>
    </main>
  );
}
