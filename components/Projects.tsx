"use client";

import { motion } from "framer-motion";
import ZoomableImage from "@/components/ZoomableImage";

interface Project {
  title: string;
  tagline: string;
  tags: string[];
  problem: string;
  solution: string;
  stack: string;
  result: string;
  screenshots?: ProjectScreenshot[];
  links?: ProjectLink[];
}

interface ProjectScreenshot {
  src: string;
  alt: string;
  caption: string;
  aspect?: "wide" | "square" | "tall";
}

interface ProjectLink {
  label: string;
  href: string;
}

const PROJECTS: Project[] = [
  {
    title: "AutomaQue CRM — Self-Hosted, AI-Augmented Personal CRM",
    tagline: "Pipedrive replaced. Data owned. AI built in.",
    tags: [
      "Next.js",
      "BigQuery",
      "Claude AI",
      "n8n",
      "Gmail API",
      "Google Calendar",
      "Vercel",
    ],
    problem:
      "Off-the-shelf CRMs (Pipedrive, HubSpot) are bloated, charge per seat, and lock your data inside someone else's database. Spreadsheets give you ownership but nothing else — no pipeline, no AI, no email, no calendar. A solo operator running a service business needed all of Pipedrive's smart features, plus modern AI, on their own cloud, with the data sitting in BigQuery for any future analytics or RAG.",
    solution:
      "A full-stack CRM running on Vercel with BigQuery as the data store. Drag-and-drop Kanban pipeline with optimistic UI, full Gmail integration with one-click AI-suggested replies, AI-drafted email campaigns with throttled batch send and open tracking, a RAG chatbot that answers plain-English questions over the entire CRM, and AI meeting extraction that reads an email thread and creates a Google Calendar event + linked CRM activity in one click. n8n handles cron-driven email reminders by calling the CRM's API on a schedule — the CRM stays the single source of truth, n8n owns no data.",
    stack:
      "Next.js 14 (App Router) · TypeScript · Tailwind · shadcn-style components · BigQuery (9-table schema, soft-delete) · googleapis (Gmail + Calendar OAuth) · Anthropic SDK (Haiku 4.5 for fast paths, Sonnet 4.5 for chatbot reasoning) · NextAuth (Google OAuth + email allowlist) · Vercel Blob · Tiptap · TanStack Query/Table · @dnd-kit · n8n (Docker) · Recharts",
    result:
      "Phase 1 (contacts, deals, pipeline, activities, notes, attachments, dashboard, search, auth) shipped in a single build push. Phase 2 layered in Gmail + AI replies, email campaigns, RAG chatbot, n8n reminders, and AI calendar extraction. Zero per-seat fees, full data ownership in BigQuery, and a public showcase of all four service offerings — automation, SaaS dev, web dev, lead gen — in one working product.",
    screenshots: [
      {
        src: "/images/projects/automaque_crm_dashboard1.png",
        alt: "AutomaQue CRM dashboard with pipeline value, won revenue, win rate, contacts, and charts",
        caption: "CRM dashboard",
      },
      {
        src: "/images/projects/automaque_crm_analysis.png",
        alt: "AutomaQue CRM AI chat answer analyzing stale follow-ups and missing last-contact data",
        caption: "Direct-context CRM analysis",
      },
      {
        src: "/images/projects/automaque_crm_ai_campaign2.png",
        alt: "AutomaQue CRM email campaign editor with AI draft controls and segment filters",
        caption: "AI campaign editor",
      },
      {
        src: "/images/projects/automaque_crm_ai_campaign1.png",
        alt: "AutomaQue CRM draft with AI modal for campaign goal, audience, and tone",
        caption: "Draft with AI modal",
        aspect: "square",
      },
      {
        src: "/images/projects/automaque_crm_ai_campaign3.png",
        alt: "AutomaQue CRM email content form with generated subject and email body",
        caption: "Generated email body",
      },
    ],
  },
  {
    title: "QolAssist — Real-Time Desktop AI Overlay",
    tagline: "Speech in. Answers out. Both streaming.",
    tags: [
      "Python",
      "PyQt6",
      "Vosk",
      "Anthropic SDK",
      "WASAPI",
      "PyInstaller",
    ],
    problem:
      "Most 'AI assistant' demos send one big request and wait for one big answer — and the lag breaks the conversation. I wanted to find out what real-time AI assistance actually feels like when both speech transcription and LLM tokens stream into the UI at the same time.",
    solution:
      "A Windows productivity overlay built around two concurrent streams. Local streaming ASR (Vosk) captions live system audio word-by-word in a frameless, always-on-top Transcript panel. Press space and the latest captions are sent to Claude — grounded in a reference text file you maintain — with tokens streaming back into a second always-on-top Answer panel. Audio capture, VAD, and transcription all run on-device; only the Claude API call leaves the machine.",
    stack:
      "Python 3.11 · PyQt6 (frameless overlays + signals/slots) · Vosk (streaming ASR on CPU) · soundcard (WASAPI loopback) · Anthropic SDK (streaming + prompt caching) · keyboard (global hotkeys) · PyInstaller (one-folder Windows distribution)",
    result:
      "Sub-second caption latency on CPU. ~10x cheaper repeat asks against the same reference file via Anthropic prompt caching. Single-key listen → ask → listen workflow. Bundled as a self-contained ~190 MB Windows folder — no Python install required on the target machine.",
    screenshots: [
      {
        src: "/images/projects/qolassist.png",
        alt: "QolAssist desktop overlay with live interviewer transcript and Claude answer panel",
        caption: "Live ASR plus Claude streaming overlay",
      },
    ],
  },
  {
    title: "Ask AutomaQue — AI Sales Intelligence",
    tagline: "Plain English in. Sales data out.",
    tags: [
      "Claude AI",
      "BigQuery",
      "Natural Language Query",
      "n8n",
      "AI Agent",
    ],
    problem:
      "Non-technical stakeholders needed sales insights but couldn't write SQL. Every question meant a developer's time. Ad-hoc analytics requests were eating hours weekly.",
    solution:
      "Built a custom AI chat interface wired to live marketplace sales data. Pipeline: raw marketplace orders → BigQuery aggregation → Google Sheets sync via n8n → AI query layer. Business users ask questions in plain English, get data-driven answers instantly. Added a History Log for named snapshots + trend comparison.",
    stack:
      "Claude AI · BigQuery · Google Sheets · n8n · Custom AI intelligence layer · JavaScript Code nodes",
    result:
      "Self-service analytics for the entire non-technical team. Zero SQL literacy required. Ad-hoc data requests to developers eliminated. Named dashboard snapshots for trend comparison over time.",
    screenshots: [
      {
        src: "/images/projects/dashboard_ecommerce2.png",
        alt: "Ask AutomaQue dark dashboard chat input for querying Shopee and Lazada sales data",
        caption: "Ask AutomaQue query layer",
      },
    ],
  },
  {
    title: "Shopee × Lazada Multi-Market Order Sync",
    tagline: "3.4 million orders. Zero manual refresh.",
    tags: [
      "Shopee API",
      "Lazada API",
      "HMAC/SHA256",
      "OAuth2",
      "BigQuery",
      "Google Sheets",
    ],
    problem:
      "Multi-market e-commerce operation across SG/MY/TH had no unified view of sales, SKU performance, or revenue across Shopee and Lazada. Teams were aggregating spreadsheets manually every week.",
    solution:
      "End-to-end n8n automations for both marketplaces: HMAC-SHA256 request signing written from scratch, OAuth2 access token refresh flows, paginated order history sync, daily revenue aggregation. Pipeline: API → BigQuery → Google Sheets → live dashboard.",
    stack:
      "Shopee Open API · Lazada Open API · n8n · HMAC/SHA256 · OAuth2 · BigQuery · Google Sheets · JavaScript Code nodes",
    result:
      "3,431,798 orders · 15,946 active SKUs · 15.3M units sold, synced continuously across 3 country markets. Real-time dashboard with Hot/Active/Slow/Dead SKU labels, Lazada CVR + visitor metrics, CSV export for stakeholder reporting.",
    screenshots: [
      {
        src: "/images/projects/dashboard_ecommerce.png",
        alt: "Dark sales dashboard showing total orders, units sold, active SKUs, zero-sales SKUs, and top SKU table",
        caption: "Multi-market sales dashboard",
      },
    ],
  },
  {
    title: "TasQ Tab - Task Manager Desktop App",
    tagline: "Tasks, time, and context in one working surface.",
    tags: [
      "Desktop App",
      "Task Management",
      "Time Tracking",
      "Gmail",
      "Calendar",
      "Hubstaff",
    ],
    problem:
      "Deep work was spread across separate tools: task lists in one place, timers in another, email and calendar context elsewhere. Switching between them made execution tracking harder than the work itself.",
    solution:
      "Built a compact desktop command center that keeps the active project, subtasks, timers, embedded Hubstaff, Gmail status, calendar status, and timezone glance visible in one panel. The goal is simple: keep the current work loop on screen without opening five browser tabs.",
    stack:
      "Desktop UI · Task/subtask tracker · Embedded time tracking · Gmail status · Calendar status · Timezone panel",
    result:
      "A persistent execution cockpit for project work: active subtasks, elapsed time, external work tools, and communication status stay visible while the build is running.",
    screenshots: [
      {
        src: "/images/projects/tasq_tab.png",
        alt: "TasQ Tab desktop panel showing filter timezones bar, four world clocks, a Portfolio task with five subtasks, embed notepad, Gmail and Calendar panels, and ClickUp status pill",
        caption: "Desktop execution cockpit",
        aspect: "tall",
      },
    ],
    links: [
      {
        label: "Download (GitHub)",
        href: "https://github.com/Shinikara08/tasQtab",
      },
    ],
  },
  {
    title: "BIGSELLER Sales Report Automation",
    tagline: "When there was no public API, I built one.",
    tags: [
      "n8n",
      "JavaScript",
      "Cookie Auth",
      "Reverse-Engineering",
      "Google Drive",
    ],
    problem:
      "Client needed daily SKU sales reports for 5,461+ products — but the platform exposed no public API. Manual exports ate 45 minutes of human clicking every single day.",
    solution:
      "Reverse-engineered the internal export API via Chrome DevTools network inspection. Built an n8n polling state machine: POST trigger export → extract processKey → loop checkProcess endpoint → detect completion URL → download .xlsx → save to Google Drive.",
    stack:
      "n8n (self-hosted) · Custom JavaScript Code nodes · Cookie-based auth · Google Drive API · Cron (daily 08:00 SGT)",
    result:
      "5,461+ SKUs reported daily, fully hands-off. 40-iteration retry cap with timeout exception. Manual labor reclaimed permanently.",
  },
];

export default function Projects() {
  return (
    <section id="projects" className="relative z-10 py-32 px-6 md:px-12">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-3 text-xs uppercase tracking-widest text-muted"
        >
          Selected Work
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl font-bold uppercase tracking-wide mb-4"
        >
          Recent Projects
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ delay: 0.2 }}
          className="text-lg text-muted mb-16 max-w-2xl"
        >
          Three automations, running in production today.
        </motion.p>

        <div className="space-y-8">
          {PROJECTS.map((project, i) => (
            <motion.article
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl border border-white/10 bg-surface/30 backdrop-blur-sm p-8 md:p-10 transition hover:border-primary/40 hover:shadow-[0_0_40px_rgba(103,232,249,0.1)]"
            >
              <p className="text-primary italic text-sm md:text-base mb-3">
                &ldquo;{project.tagline}&rdquo;
              </p>
              <h3 className="text-2xl md:text-4xl font-bold uppercase tracking-wide mb-4">
                {project.title}
              </h3>
              <div className="flex flex-wrap gap-2 mb-8">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-primary/20 px-3 py-1 text-xs text-primary"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {project.links && project.links.length > 0 && (
                <div className="flex flex-wrap gap-3 mb-8">
                  {project.links.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition hover:border-primary hover:bg-primary/20"
                    >
                      {link.label}
                      <span aria-hidden="true">↗</span>
                    </a>
                  ))}
                </div>
              )}

              {project.screenshots && project.screenshots.length > 0 && (
                <ProjectGallery screenshots={project.screenshots} />
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <CaseStudyBlock label="The Problem" body={project.problem} />
                <CaseStudyBlock label="The Solution" body={project.solution} />
                <CaseStudyBlock label="The Stack" body={project.stack} />
                <CaseStudyBlock
                  label="The Result"
                  body={project.result}
                  highlight
                />
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectGallery({
  screenshots,
}: {
  screenshots: ProjectScreenshot[];
}) {
  return (
    <div className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-2">
      {screenshots.map((screenshot, index) => (
        <figure
          key={screenshot.src}
          className={`overflow-hidden rounded-xl border border-white/10 bg-background/50 ${
            screenshots.length === 1 ? "md:col-span-2" : ""
          } ${index === 0 && screenshots.length > 2 ? "md:col-span-2" : ""}`}
        >
          <div
            className={`relative ${
              screenshot.aspect === "square"
                ? "aspect-square"
                : screenshot.aspect === "tall"
                ? "aspect-[9/16] max-h-[720px]"
                : "aspect-[16/9]"
            }`}
          >
            <ZoomableImage
              src={screenshot.src}
              alt={screenshot.alt}
              sizes={
                screenshots.length === 1 || index === 0
                  ? "(max-width: 768px) 100vw, 1024px"
                  : "(max-width: 768px) 100vw, 512px"
              }
              className="object-contain"
            />
          </div>
          <figcaption className="border-t border-white/10 px-4 py-3 text-xs uppercase tracking-widest text-muted">
            {screenshot.caption}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

function CaseStudyBlock({
  label,
  body,
  highlight = false,
}: {
  label: string;
  body: string;
  highlight?: boolean;
}) {
  return (
    <div>
      <div className="text-xs uppercase tracking-widest text-primary mb-2">
        {label}
      </div>
      <p
        className={`leading-relaxed ${
          highlight ? "text-foreground" : "text-muted"
        }`}
      >
        {body}
      </p>
    </div>
  );
}
