"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const BIO_PARAGRAPHS = [
  "I'm an AI Automation Engineer specializing in production-grade workflow systems for multi-market e-commerce. My stack: n8n (self-hosted and cloud), Claude Code, JavaScript, Python, and Docker. I design data pipelines, build REST API integrations, architect fault-tolerant retry systems, and ship AI-powered query layers that replace SQL for non-technical teams.",
  "My edge is the hard part — reverse-engineering undocumented APIs with Chrome DevTools, writing HMAC/SHA256 request signers by hand, implementing OAuth2 refresh flows, and designing polling state machines with idempotent execution, cross-iteration state persistence, and exponential backoff retries. I've built production integrations for Shopee Open API, Lazada Open API, BigQuery, Google Sheets, and Claude AI.",
  "Proven at scale: 3.4M+ marketplace orders synced, 15,946 active SKUs tracked daily, and automation pipelines running hands-off across three Southeast Asian markets. I deliver end-to-end — scoping, architecture, custom JavaScript Code nodes, Docker-hosted n8n deployments, and the client handoff documentation that keeps everything running long after I'm off the project.",
];

const STATS = [
  { value: "3.4M+", label: "Orders Synced" },
  { value: "15,946", label: "Active SKUs" },
  { value: "3", label: "Markets (SG·MY·TH)" },
  { value: "2+", label: "Years in Production" },
];

export default function About() {
  return (
    <section id="about" className="relative z-10 py-32 px-6 md:px-12">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-3 text-xs uppercase tracking-widest text-muted"
        >
          About Me
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 items-start mb-16">
          <div className="md:col-span-3">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: 0.1 }}
              className="text-xl text-muted mb-2"
            >
              Hello, I&rsquo;m
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: 0.2 }}
              className="text-5xl md:text-7xl font-bold uppercase tracking-wide mb-4"
            >
              Jeffrey Quemuel
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: 0.3 }}
              className="text-xl md:text-2xl text-primary mb-8"
            >
              AI Automation Engineer · Remote from the Philippines
            </motion.p>

            <div className="space-y-4">
              {BIO_PARAGRAPHS.map((text, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="text-base text-muted leading-relaxed"
                >
                  {text}
                </motion.p>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="md:col-span-2"
          >
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-white/10 shadow-[0_0_60px_rgba(103,232,249,0.15)]">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 z-10 pointer-events-none" />
              <Image
                src="/images/jeffrey-about.png"
                alt="Jeffrey Quemuel"
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover"
              />
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/10 bg-surface/30 backdrop-blur-sm p-6"
            >
              <div className="text-3xl md:text-4xl font-bold text-primary">
                {stat.value}
              </div>
              <div className="text-xs uppercase tracking-widest text-muted mt-2">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
