"use client";

import { useEffect, useRef, useState } from "react";

export default function CareersPage() {
  const pageRef = useRef<HTMLElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [submitMessage, setSubmitMessage] = useState("");

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
      { threshold: 0.1 }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("submitting");
    setSubmitMessage("Submitting your application...");

    try {
      const formElement = e.currentTarget;
      const formData = new FormData(formElement);

      const response = await fetch("/api/careers", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        setSubmitStatus("error");
        setSubmitMessage(data.error || "Failed to submit application. Please try again.");
        return;
      }

      setSubmitStatus("success");
      formElement.reset();
    } catch (error) {
      console.error("Submission error:", error);
      setSubmitStatus("error");
      setSubmitMessage("An error occurred. Please try again or email careers@mayaakars.com");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main ref={pageRef} className="mk-light-page min-h-screen" data-interactive>

      {/* Hero */}
      <section
        data-light-section
        className="mk-light-section flex min-h-[55vh] flex-col items-center justify-center px-6 py-24 text-center"
      >
        <p className="mk-reveal mb-4 font-sans text-[0.75rem] tracking-[0.2em] uppercase text-[var(--gold)]">
          Join the Studio
        </p>
        <h1 className="mk-reveal mk-reveal-d1 font-serif text-[clamp(3rem,10vw,8rem)] font-medium leading-[0.95] tracking-[0.06em]">
          CAREERS
        </h1>
        <p className="mk-reveal mk-reveal-d2 mt-6 max-w-[52ch] font-sans text-[clamp(0.95rem,2vw,1.1rem)] leading-relaxed text-[var(--text-dark-soft)]">
          At Mayaakars, we are always looking for curious minds and thoughtful designers
          who believe in creating meaningful spaces.
        </p>
      </section>

      {/* Why Work With Us */}
      <section
        data-light-section
        className="mk-light-section border-t border-[var(--border)] px-6 py-20"
      >
        <div className="mx-auto max-w-4xl">
          <p className="mk-reveal font-sans text-[0.75rem] tracking-[0.2em] uppercase text-[var(--gold)]">
            Why Us
          </p>
          <h2 className="mk-reveal mk-reveal-d1 mt-3 font-serif text-[clamp(2rem,5vw,3.5rem)] font-medium leading-tight">
            Design With Purpose
          </h2>
          <ul className="mk-reveal mk-reveal-d2 mt-8 grid gap-4 sm:grid-cols-2 font-sans text-[var(--text-dark-soft)] text-base leading-relaxed">
            {[
              "Exposure to integrated architecture and interior design projects",
              "A collaborative, design-focused studio culture",
              "Opportunities to work on residential and commercial projects",
              "Emphasis on learning, craft, and design integrity",
            ].map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--gold)]" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Life at Mayaakars */}
      <section
        data-light-section
        className="mk-light-section border-t border-[var(--border)] px-6 py-20 text-center"
      >
        <div className="mx-auto max-w-2xl">
          <h2 className="mk-reveal font-serif text-[clamp(1.75rem,4vw,3rem)] font-medium leading-tight">
            Life at Mayaakars
          </h2>
          <p className="mk-reveal mk-reveal-d1 mt-5 font-sans text-[clamp(0.9rem,1.8vw,1.05rem)] leading-relaxed text-[var(--text-dark-soft)]">
            We believe great design emerges from collaboration, curiosity, and commitment
            to craft. If you're passionate about thoughtful design, we&apos;d love to hear
            from you.
          </p>
        </div>
      </section>

      {/* Application Form */}
      <section
        data-light-section
        className="mk-light-section border-t border-[var(--border)] px-6 py-20"
      >
        <div className="mx-auto max-w-2xl">
          <p className="mk-reveal font-sans text-[0.75rem] tracking-[0.2em] uppercase text-[var(--gold)]">
            Apply
          </p>
          <h2 className="mk-reveal mk-reveal-d1 mt-3 font-serif text-[clamp(2rem,5vw,3rem)] font-medium leading-tight">
            How to Apply
          </h2>
          <p className="mk-reveal mk-reveal-d2 mt-3 font-sans text-sm text-[var(--text-dark-soft)]">
            Send your portfolio and resume to{" "}
            <a href="mailto:careers@mayaakars.com" className="text-[var(--gold)] underline underline-offset-2">
              careers@mayaakars.com
            </a>{" "}
            — or fill out the form below.
          </p>

          {submitStatus !== "success" ? (
            <form
              className="mk-reveal mk-reveal-d3 mt-10 flex flex-col gap-5"
              onSubmit={handleFormSubmit}
            >
              {/* Section 1: Basic Information */}
              <fieldset className="flex flex-col gap-4">
                <legend className="mb-1 font-sans text-[0.7rem] tracking-[0.18em] uppercase text-[var(--text-dark-muted)]">
                  Basic Information
                </legend>
                <input className="mk-careers-input" name="fullName" type="text" placeholder="Full Name" required data-cursor-ignore />
                <input className="mk-careers-input" name="email" type="email" placeholder="Email Address" required data-cursor-ignore />
                <input className="mk-careers-input" name="phone" type="tel" placeholder="Phone Number" required data-cursor-ignore />
                <input className="mk-careers-input" name="city" type="text" placeholder="Current City" required data-cursor-ignore />
              </fieldset>

              {/* Section 2: Position Details */}
              <fieldset className="flex flex-col gap-4">
                <legend className="mb-1 font-sans text-[0.7rem] tracking-[0.18em] uppercase text-[var(--text-dark-muted)]">
                  Position Details
                </legend>
                <select className="mk-careers-input" name="position" defaultValue="" data-cursor-ignore required>
                  <option value="" disabled>Position Applying For</option>
                  <option>Architect</option>
                  <option>Interior Designer</option>
                  <option>3D Visualizer</option>
                  <option>Site Supervisor / Project Coordinator</option>
                  <option>Intern (Architecture / Interior Design)</option>
                  <option>Other</option>
                </select>
                <select className="mk-careers-input" name="experience" defaultValue="" data-cursor-ignore>
                  <option value="" disabled>Years of Experience</option>
                  <option>Student / Intern</option>
                  <option>0–1 year</option>
                  <option>1–3 years</option>
                  <option>3–5 years</option>
                  <option>5+ years</option>
                </select>
                <select className="mk-careers-input" name="availability" defaultValue="" data-cursor-ignore>
                  <option value="" disabled>Availability</option>
                  <option>Immediate</option>
                  <option>15 days</option>
                  <option>30 days</option>
                  <option>More than 30 days</option>
                </select>
              </fieldset>

              {/* Section 3: Professional Information */}
              <fieldset className="flex flex-col gap-4">
                <legend className="mb-1 font-sans text-[0.7rem] tracking-[0.18em] uppercase text-[var(--text-dark-muted)]">
                  Professional Information
                </legend>
                <input className="mk-careers-input" name="qualification" type="text" placeholder="Highest Qualification" data-cursor-ignore />
                <input className="mk-careers-input" name="organization" type="text" placeholder="Current Organisation / Institute" data-cursor-ignore />
                <input className="mk-careers-input" name="portfolioLink" type="url" placeholder="Portfolio Link (URL)" data-cursor-ignore />
              </fieldset>

              {/* Section 4: Document Links */}
              <fieldset className="flex flex-col gap-4">
                <legend className="mb-1 font-sans text-[0.7rem] tracking-[0.18em] uppercase text-[var(--text-dark-muted)]">
                  Document Links (Google Drive)
                </legend>
                <div className="flex flex-col gap-1">
                  <label className="font-sans text-xs text-[var(--text-dark-soft)]">Resume Link (Required)</label>
                  <input className="mk-careers-input" name="resumeLink" type="url" placeholder="https://drive.google.com/file/d/..." data-cursor-ignore required />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-sans text-xs text-[var(--text-dark-soft)]">Cover Letter (Optional)</label>
                  <input className="mk-careers-input" name="coverLetterLink" type="url" placeholder="https://drive.google.com/file/d/..." data-cursor-ignore />
                </div>
                <p className="font-sans text-xs text-[var(--text-dark-soft)] italic">
                  💡 Tip: Right-click your file in Google Drive → Share → Copy link and paste it here
                </p>
              </fieldset>

              {/* Status Message - Error Only */}
              {submitStatus === "error" && (
                <div className="rounded bg-red-50 p-3 text-center font-sans text-sm text-red-800">
                  {submitMessage}
                </div>
              )}

              <div className="pt-2 text-center">
                <button 
                  type="submit" 
                  className="mk-careers-btn font-sans" 
                  data-interactive
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </button>
              </div>
            </form>
          ) : (
            <div
              className="mk-reveal mk-reveal-d3 mt-10 flex justify-center"
              role="status"
              aria-live="polite"
            >
              <div className="mk-thankyou-card">
                <div className="mk-thankyou-icon" aria-hidden="true">✓</div>
                <p className="mk-thankyou-text">Thank you for your application!</p>
                <p className="font-sans text-sm text-[var(--text-dark-soft)] text-center">
                  We've received your submission and will review your profile carefully. We'll get back to you soon.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
