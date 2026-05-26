"use client";

import { motion } from "framer-motion";
import { Database, Layers, Monitor, Network, Plug, Sparkles, Users } from "lucide-react";

const TOP_ROW_SERVICES = [
  {
    Icon: Users,
    title: "Multi-Agent AI Systems",
    description:
      "Custom multi-agent Claude pipelines with shared memory and structured handoffs. Brainstormer, prompt architect, builder, archivist, outward voice; each agent has a defined role and reads from one append-only brain. The QoreX five-agent system runs my daily work and shipped the page you're reading.",
  },
  {
    Icon: Network,
    title: "n8n Workflow Automation",
    description:
      "Self-hosted n8n deployments, custom JavaScript Code nodes, polling state machines, retry logic with exponential backoff, webhook pipelines. From messy ops to hands-off automation.",
  },
  {
    Icon: Plug,
    title: "Marketplace API Integration",
    description:
      "Shopee Open API, Lazada Open API, TikTok Shop. HMAC/SHA256 signing, OAuth2 refresh flows, paginated order sync, rate-limit handling. Multi-market, production-ready from day one.",
  },
  {
    Icon: Database,
    title: "Data Pipelines & BigQuery",
    description:
      "BigQuery aggregation, Google Sheets sync, real-time SKU dashboards. Turn raw marketplace data into live business intelligence that stakeholders actually use.",
  },
];

const BOTTOM_ROW_SERVICES = [
  {
    Icon: Layers,
    title: "Full-Stack SaaS Development",
    description:
      "Multi-tenant Next.js applications deployed on Vercel. NextAuth authentication, BigQuery and Google Sheets data layers, n8n-driven background jobs, AI chat tabs that replace dashboard queries for non-technical teams. AutomaQue CRM is live at automaque-crm.vercel.app and serving real users today.",
  },
  {
    Icon: Sparkles,
    title: "Prompt Engineering & AI Agents",
    description:
      "Custom Claude and GPT agents with defined roles, voice, and memory. Each agent reads from a shared brain so context never disappears between sessions, with anti-contamination guards and prompt caching for cost control. The QoreX five-agent team is my proof of concept; your team is your business.",
  },
  {
    Icon: Monitor,
    title: "Custom Desktop Tools",
    description:
      "Floating widgets, system-tray utilities, and overlay apps for daily-driver workflows. Electron and PyQt6 builds with offline mode, multi-timezone clocks, embedded webviews, and integrations to ClickUp, Gmail, and Calendar. Tasq Tab is in production with around 10 daily users; QolAssist runs as a Windows speech-to-AI overlay.",
  },
];

export default function Services() {
  return (
    <section id="services" className="relative z-10 py-32 px-6 md:px-12">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-3 text-xs uppercase tracking-widest text-muted"
        >
          What I Build
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl font-bold uppercase tracking-wide mb-12"
        >
          Services
        </motion.h2>

        <div className="-mx-6 md:-mx-12 px-6 md:px-12 flex gap-5 overflow-x-auto snap-x snap-mandatory pb-6 scroll-smooth [scrollbar-width:thin]">
          {[...TOP_ROW_SERVICES, ...BOTTOM_ROW_SERVICES].map((service, i) => (
            <ServiceCard key={service.title} service={service} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({
  service,
  index,
}: {
  service: (typeof TOP_ROW_SERVICES)[number] | (typeof BOTTOM_ROW_SERVICES)[number];
  index: number;
}) {
  const Icon = service.Icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ delay: index * 0.1 }}
      className="group shrink-0 snap-start w-[80vw] max-w-[300px] flex flex-col rounded-2xl border border-white/10 bg-surface/30 backdrop-blur-sm p-6 transition hover:border-primary/40 hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(103,232,249,0.15)]"
    >
      <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 mb-4">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <h3 className="text-base font-bold uppercase tracking-wide mb-2 leading-tight">
        {service.title}
      </h3>
      <p className="text-sm text-muted leading-relaxed mb-4">{service.description}</p>
      <a href="#contact" className="mt-auto text-xs text-primary group-hover:underline">
        Get a Quote →
      </a>
    </motion.div>
  );
}
