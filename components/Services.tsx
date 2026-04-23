"use client";

import { motion } from "framer-motion";
import { Plug, Network, Database, Sparkles } from "lucide-react";

const SERVICES = [
  {
    Icon: Plug,
    title: "Marketplace API Integration",
    description:
      "Shopee Open API, Lazada Open API, TikTok Shop. HMAC/SHA256 signing, OAuth2 refresh flows, paginated order sync, rate-limit handling. Multi-market, production-ready from day one.",
  },
  {
    Icon: Network,
    title: "n8n Workflow Automation",
    description:
      "Self-hosted n8n deployments, custom JavaScript Code nodes, polling state machines, retry logic with exponential backoff, webhook pipelines. From messy ops to hands-off automation.",
  },
  {
    Icon: Database,
    title: "Data Pipelines & BigQuery",
    description:
      "BigQuery aggregation, Google Sheets sync, real-time SKU dashboards. Turn raw marketplace data into live business intelligence that stakeholders actually use.",
  },
  {
    Icon: Sparkles,
    title: "Prompt Engineering & AI Agents",
    description:
      "Claude AI and GPT-integrated workflows, natural-language query layers over business data, AI chat interfaces that replace SQL for non-technical teams.",
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SERVICES.map((service, i) => {
            const Icon = service.Icon;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: i * 0.1 }}
                className="group rounded-2xl border border-white/10 bg-surface/30 backdrop-blur-sm p-8 transition hover:border-primary/40 hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(103,232,249,0.15)]"
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-6">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold uppercase tracking-wide mb-3">
                  {service.title}
                </h3>
                <p className="text-muted leading-relaxed mb-6">
                  {service.description}
                </p>
                <a
                  href="#contact"
                  className="text-sm text-primary group-hover:underline"
                >
                  Get a Quote →
                </a>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
