"use client";

import { motion } from "framer-motion";

interface Role {
  role: string;
  company: string;
  current: boolean;
  achievements: string[];
  tags: string[];
}

const EXPERIENCES: Role[] = [
  {
    role: "AI Automation Engineer",
    company: "E-commerce company · Singapore (Remote)",
    current: true,
    achievements: [
      "Reverse-engineered undocumented export API; eliminated manual reporting for 5,461+ SKUs",
      "Architected multi-market Historical Sales Dashboard (3.4M+ orders, 15,946 SKUs across SG/MY/TH)",
      "Built production Shopee/Lazada workflows: HMAC/SHA256 signing, OAuth2 refresh, paginated sync, daily revenue aggregation",
      "Integrated AI-powered natural-language query layer over live sales data",
      "Designed fault-tolerant patterns: exponential backoff, idempotent execution, cross-iteration state persistence, dev/prod separation",
      "Diagnosed and resolved 10+ production-blocking n8n issues",
    ],
    tags: ["n8n", "Shopee API", "Lazada API", "BigQuery", "Claude AI", "JavaScript"],
  },
  {
    role: "Freelance AI Automation Specialist",
    company: "Self-employed (Remote)",
    current: false,
    achievements: [
      "Delivered custom n8n workflows for e-commerce clients: order mgmt, inventory sync, CS triggers, multi-platform aggregation",
      "Built Shopee/Lazada integrations from scratch for clients without in-house tech teams",
      "Developed BigQuery → Google Sheets pipelines replacing manual spreadsheet updates",
      "End-to-end consulting: scoping, architecture, custom JS Code nodes, Docker self-hosted deploy, handoff documentation",
    ],
    tags: ["n8n", "Shopee API", "Lazada API", "BigQuery", "Docker", "Python"],
  },
  {
    role: "Android App Developer",
    company: "Freelance (Remote)",
    current: false,
    achievements: [
      "Custom Android app development for clients — from concept through Play Store delivery",
    ],
    tags: ["Android", "Kotlin", "Java", "Mobile Development"],
  },
];

export default function Experience() {
  return (
    <section id="experience" className="relative z-10 py-32 px-6 md:px-12">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-3 text-xs uppercase tracking-widest text-muted"
        >
          The Journey
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl font-bold uppercase tracking-wide mb-16"
        >
          Experience
        </motion.h2>

        <div className="relative">
          <div className="absolute left-4 md:left-6 top-2 bottom-2 w-px bg-gradient-to-b from-primary/50 via-primary/20 to-transparent" />

          <div className="space-y-12">
            {EXPERIENCES.map((exp, i) => (
              <motion.div
                key={exp.role + exp.company}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: i * 0.1 }}
                className="relative pl-12 md:pl-16"
              >
                <div className="absolute left-2 md:left-4 top-2 flex h-5 w-5 items-center justify-center">
                  <span
                    className={`relative flex h-4 w-4 items-center justify-center rounded-full ${
                      exp.current ? "bg-primary" : "bg-muted"
                    }`}
                  >
                    {exp.current && (
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                    )}
                  </span>
                </div>

                <div className="rounded-2xl border border-white/10 bg-surface/30 backdrop-blur-sm p-6 md:p-8">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h3 className="text-xl md:text-2xl font-bold uppercase tracking-wide">
                      {exp.role}
                    </h3>
                    {exp.current && (
                      <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-xs uppercase tracking-widest text-primary">
                        Current
                      </span>
                    )}
                  </div>
                  <div className="text-muted mb-6">{exp.company}</div>

                  <ul className="space-y-2 mb-6">
                    {exp.achievements.map((line) => (
                      <li
                        key={line}
                        className="flex gap-3 text-muted leading-relaxed"
                      >
                        <span className="text-primary shrink-0">▸</span>
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-2">
                    {exp.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-primary/20 px-3 py-1 text-xs text-primary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
