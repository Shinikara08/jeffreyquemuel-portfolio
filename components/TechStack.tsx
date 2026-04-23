"use client";

import { motion } from "framer-motion";

interface Tech {
  name: string;
  slug: string;
  color: string;
}

const STACK: Tech[] = [
  { name: "n8n", slug: "n8n", color: "EA4B71" },
  { name: "JavaScript", slug: "javascript", color: "F7DF1E" },
  { name: "Python", slug: "python", color: "3776AB" },
  { name: "Node.js", slug: "nodedotjs", color: "5FA04E" },
  { name: "Java", slug: "openjdk", color: "ED8B00" },
  { name: "Kotlin", slug: "kotlin", color: "7F52FF" },
  { name: "Docker", slug: "docker", color: "2496ED" },
  { name: "Shopee", slug: "shopee", color: "EE4D2D" },
  { name: "Lazada", slug: "lazada", color: "FFFFFF" },
  { name: "BigQuery", slug: "googlebigquery", color: "669DF6" },
  { name: "Google Sheets", slug: "googlesheets", color: "34A853" },
  { name: "Apps Script", slug: "googleappsscript", color: "4285F4" },
  { name: "Supabase", slug: "supabase", color: "3FCF8E" },
  { name: "HubSpot", slug: "hubspot", color: "FF7A59" },
  { name: "Slack", slug: "slack", color: "E01E5A" },
  { name: "Claude AI", slug: "anthropic", color: "D97757" },
  { name: "Git", slug: "git", color: "F05032" },
];

export default function TechStack() {
  return (
    <section className="relative z-10 py-16">
      <div className="mx-auto max-w-6xl px-6 mb-8">
        <div className="text-xs uppercase tracking-widest text-muted text-center">
          I Build With
        </div>
      </div>

      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 md:w-40 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 md:w-40 bg-gradient-to-l from-background to-transparent z-10" />

        <motion.div
          className="flex gap-4 w-max"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
        >
          {[...STACK, ...STACK].map((tech, i) => (
            <div
              key={i}
              className="flex items-center gap-3 shrink-0 rounded-full border border-white/10 bg-surface/50 px-5 py-3 backdrop-blur-sm hover:border-primary/40 transition"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://cdn.simpleicons.org/${tech.slug}/${tech.color}`}
                alt={tech.name}
                className="h-6 w-6"
                loading="lazy"
              />
              <span className="text-sm text-foreground whitespace-nowrap">
                {tech.name}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
