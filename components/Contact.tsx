"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Mail,
  Calendar,
  Phone,
  FileText,
  Hammer,
  Rocket,
  Repeat,
  ChevronRight,
} from "lucide-react";
import { FaLinkedin, FaFacebook } from "react-icons/fa";
import Link from "next/link";

const ROADMAP_STEPS = [
  {
    icon: Phone,
    label: "Discovery Call",
    blurb: "30-minute scope chat. We pinpoint the bleeding workflow.",
  },
  {
    icon: FileText,
    label: "Brainstorm + Spec",
    blurb: "I map angles, score paths, then carve a tight build spec.",
  },
  {
    icon: Hammer,
    label: "Build",
    blurb: "Vertical slices, real tests, honest logs every step.",
  },
  {
    icon: Rocket,
    label: "Deploy",
    blurb: "Ship to production with monitoring and a rollback plan.",
  },
  {
    icon: Repeat,
    label: "Maintain",
    blurb: "Tune, extend, and keep the workflow healthy as scale grows.",
  },
];

/**
 * ⚙️  TO ACTIVATE THE CALENDAR BOOKING WIDGET:
 *
 * 1. Go to calendar.google.com
 * 2. Click "Create" → "Appointment schedule"
 * 3. Configure: title "Discovery Call", duration (30 min), availability, buffer
 * 4. Save, then click "Share" → "Open booking page" → copy the URL
 * 5. The URL looks like:
 *      https://calendar.google.com/calendar/appointments/schedules/AcZssZ...
 * 6. Replace the entire value of CALENDAR_EMBED_URL below with that URL + "?gv=true"
 *
 * Until you do this, the iframe will show a Google placeholder.
 */
const CALENDAR_EMBED_URL =
  "https://calendar.google.com/calendar/appointments/schedules/AcZssZ0u39E0PltuOypVfPXrb3vnf4j9tdFFgTERHg0Omu8wzt6xhk-S-5GytsHFIIEPc9YOXCNRHuJG";

const CALENDAR_CONFIGURED = !CALENDAR_EMBED_URL.includes("YOUR_SCHEDULE_ID");

export default function Contact() {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const subject = `Project Inquiry from ${formData.get("name")}`;
    const body =
      `Name: ${formData.get("name")}\n` +
      `Email: ${formData.get("email")}\n` +
      `Project type: ${formData.get("projectType")}\n\n` +
      `${formData.get("message")}`;
    window.location.href = `mailto:jeffrey.v.quemuel@gmail.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    setSubmitting(false);
  };

  return (
    <section id="contact" className="relative z-10 py-32 px-6 md:px-12">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-3 text-xs uppercase tracking-widest text-muted"
        >
          How We Work Together
        </motion.div>

        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ delay: 0.1 }}
          className="text-2xl md:text-4xl font-bold uppercase tracking-wide mb-3"
        >
          From Discovery Call to Live Production
        </motion.h3>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ delay: 0.2 }}
          className="text-base text-muted mb-10 max-w-2xl"
        >
          The five stops every project moves through. No surprises, no
          consultant theater.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <div className="hidden md:flex items-stretch gap-2">
            {ROADMAP_STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.label} className="flex items-center flex-1">
                  <div className="flex-1 rounded-2xl border border-white/10 bg-surface/30 backdrop-blur-sm p-5 h-full">
                    <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 border border-primary/30">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="text-sm font-bold uppercase tracking-wide text-foreground mb-2">
                      {step.label}
                    </div>
                    <p className="text-xs text-muted leading-relaxed">
                      {step.blurb}
                    </p>
                  </div>
                  {i < ROADMAP_STEPS.length - 1 && (
                    <ChevronRight className="h-5 w-5 text-primary/60 shrink-0 mx-1" />
                  )}
                </div>
              );
            })}
          </div>

          <div className="md:hidden space-y-3">
            {ROADMAP_STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.label}
                  className="rounded-2xl border border-white/10 bg-surface/30 backdrop-blur-sm p-5 flex gap-4"
                >
                  <div className="shrink-0 inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 border border-primary/30">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-bold uppercase tracking-wide text-foreground mb-1">
                      {step.label}
                    </div>
                    <p className="text-xs text-muted leading-relaxed">
                      {step.blurb}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="mt-6 text-xs text-muted">
            Powered by QoreX.{" "}
            <Link
              href="/qorex"
              className="text-primary/80 hover:text-primary underline-offset-4 hover:underline transition"
            >
              Meet the team →
            </Link>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ delay: 0.4 }}
          className="mb-3 mt-20 text-xs uppercase tracking-widest text-muted"
        >
          Contact
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl font-bold uppercase tracking-wide mb-4"
        >
          Let&rsquo;s Build Something That Runs Itself
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ delay: 0.2 }}
          className="text-lg text-muted mb-16 max-w-2xl"
        >
          Tell me what&rsquo;s breaking, bleeding hours, or just needs to work
          without anyone touching it.
        </motion.p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-sm uppercase tracking-widest text-primary mb-6">
              Send a Message
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Name"
                required
                className="w-full rounded-xl border border-white/10 bg-surface/40 px-4 py-3 text-foreground placeholder:text-muted backdrop-blur-sm focus:border-primary/50 focus:outline-none"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                required
                className="w-full rounded-xl border border-white/10 bg-surface/40 px-4 py-3 text-foreground placeholder:text-muted backdrop-blur-sm focus:border-primary/50 focus:outline-none"
              />
              <select
                name="projectType"
                defaultValue="Marketplace API"
                className="w-full rounded-xl border border-white/10 bg-surface/40 px-4 py-3 text-foreground backdrop-blur-sm focus:border-primary/50 focus:outline-none"
              >
                <option value="Marketplace API">Marketplace API Integration</option>
                <option value="n8n Workflow">n8n Workflow Automation</option>
                <option value="Data Pipeline">Data Pipeline / BigQuery</option>
                <option value="Prompt Engineering">Prompt Engineering / AI Agent</option>
                <option value="Email Automation">Email Automation</option>
                <option value="Software Development">Software Development</option>
                <option value="Other">Other</option>
              </select>
              <textarea
                name="message"
                placeholder="Tell me about your project..."
                required
                rows={6}
                className="w-full rounded-xl border border-white/10 bg-surface/40 px-4 py-3 text-foreground placeholder:text-muted backdrop-blur-sm focus:border-primary/50 focus:outline-none resize-none"
              />
              <button
                type="submit"
                disabled={submitting}
                className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-background transition hover:shadow-[0_0_30px_rgba(103,232,249,0.5)] disabled:opacity-50"
              >
                Send Message →
              </button>
            </form>

            <div className="mt-12 space-y-3">
              <a
                href="mailto:jeffrey.v.quemuel@gmail.com"
                className="flex items-center gap-3 text-muted hover:text-primary transition"
              >
                <Mail className="h-4 w-4" />
                <span className="text-sm">jeffrey.v.quemuel@gmail.com</span>
              </a>
              <a
                href="https://www.linkedin.com/in/jeffrey-quemuel-060551297/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-muted hover:text-primary transition"
              >
                <FaLinkedin className="h-4 w-4" />
                <span className="text-sm">LinkedIn</span>
              </a>
              <a
                href="https://www.facebook.com/JeffreyQuemuelOfficial"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-muted hover:text-primary transition"
              >
                <FaFacebook className="h-4 w-4" />
                <span className="text-sm">Facebook</span>
              </a>
            </div>

            <div className="mt-8 flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
              </span>
              <span className="text-xs text-muted">
                Open to work · Replies within 24 hours
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-sm uppercase tracking-widest text-primary mb-6">
              Book a Discovery Call
            </h3>

            {CALENDAR_CONFIGURED ? (
              <div className="rounded-2xl border border-white/10 bg-surface/30 backdrop-blur-sm overflow-hidden">
                <iframe
                  src={CALENDAR_EMBED_URL}
                  className="w-full h-[640px] border-0"
                  style={{
                    filter: "invert(1) hue-rotate(180deg)",
                    colorScheme: "light",
                  }}
                  title="Book a Discovery Call"
                />
              </div>
            ) : (
              <div className="rounded-2xl border border-primary/20 bg-surface/30 backdrop-blur-sm p-8 text-center">
                <Calendar className="h-12 w-12 text-primary mx-auto mb-4" />
                <div className="text-foreground font-bold mb-2">
                  Calendar booking coming soon
                </div>
                <p className="text-sm text-muted mb-6">
                  Configure your Google Calendar Appointment Schedule to activate
                  inline booking. See <code className="text-primary">Contact.tsx</code>{" "}
                  for setup instructions.
                </p>
                <a
                  href="mailto:jeffrey.v.quemuel@gmail.com?subject=Discovery Call Request"
                  className="inline-block rounded-full bg-primary px-6 py-3 text-sm font-medium text-background transition hover:shadow-[0_0_30px_rgba(103,232,249,0.5)]"
                >
                  Request a Call →
                </a>
              </div>
            )}

            <p className="mt-4 text-xs text-muted">
              30-minute discovery call. We discuss your automation needs,
              timeline, and next steps — no commitment.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
