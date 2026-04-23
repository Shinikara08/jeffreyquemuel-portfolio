"use client";

import { motion } from "framer-motion";
import type { IconType } from "react-icons";
import {
  SiN8N,
  SiJavascript,
  SiPython,
  SiNodedotjs,
  SiKotlin,
  SiDocker,
  SiAirtable,
  SiGooglebigquery,
  SiGooglesheets,
  SiGoogleappsscript,
  SiSupabase,
  SiHubspot,
  SiSlack,
  SiAnthropic,
  SiGit,
} from "react-icons/si";
import { FaJava } from "react-icons/fa";

interface Tech {
  name: string;
  Icon: IconType;
  color: string;
}

const STACK: Tech[] = [
  { name: "n8n", Icon: SiN8N, color: "#EA4B71" },
  { name: "JavaScript", Icon: SiJavascript, color: "#F7DF1E" },
  { name: "Python", Icon: SiPython, color: "#4B8BBE" },
  { name: "Node.js", Icon: SiNodedotjs, color: "#5FA04E" },
  { name: "Java", Icon: FaJava, color: "#ED8B00" },
  { name: "Kotlin", Icon: SiKotlin, color: "#7F52FF" },
  { name: "Docker", Icon: SiDocker, color: "#2496ED" },
  { name: "Airtable", Icon: SiAirtable, color: "#FCB400" },
  { name: "BigQuery", Icon: SiGooglebigquery, color: "#669DF6" },
  { name: "Google Sheets", Icon: SiGooglesheets, color: "#34A853" },
  { name: "Apps Script", Icon: SiGoogleappsscript, color: "#4285F4" },
  { name: "Supabase", Icon: SiSupabase, color: "#3FCF8E" },
  { name: "HubSpot", Icon: SiHubspot, color: "#FF7A59" },
  { name: "Slack", Icon: SiSlack, color: "#E01E5A" },
  { name: "Claude AI", Icon: SiAnthropic, color: "#D97757" },
  { name: "Git", Icon: SiGit, color: "#F05032" },
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
          {[...STACK, ...STACK].map((tech, i) => {
            const Icon = tech.Icon;
            return (
              <div
                key={i}
                className="flex items-center gap-3 shrink-0 rounded-full border border-white/10 bg-surface/50 px-5 py-3 backdrop-blur-sm hover:border-primary/40 transition"
              >
                <Icon className="h-6 w-6" style={{ color: tech.color }} />
                <span className="text-sm text-foreground whitespace-nowrap">
                  {tech.name}
                </span>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
