"use client";

import { motion } from "framer-motion";

interface Project {
  title: string;
  tagline: string;
  tags: string[];
  problem: string;
  solution: string;
  stack: string;
  result: string;
}

const PROJECTS: Project[] = [
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
