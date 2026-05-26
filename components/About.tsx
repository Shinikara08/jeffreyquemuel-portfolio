"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import CountUpTile from "@/components/CountUpTile";
import RotatingTitle from "@/components/RotatingTitle";

const BIO_PARAGRAPHS = [
  "I'm an AI Systems Engineer based in the Philippines. I split my work across three lanes. The first is e-commerce automation across Shopee, Lazada, and TikTok Shop, where I sync millions of orders and track thousands of SKUs every day without anyone needing to babysit it. The second is full-stack apps and CRM tooling, including a live multi-tenant SaaS at AutomaQue CRM and HubSpot enrichment pipelines for music PR clients. The third is AI-system design, where I build named, structured agent teams instead of writing one-off prompts.",
  "What I actually like is the hard part most engineers skip. Reverse-engineering undocumented APIs by reading the network traffic. Writing the request-signing and OAuth refresh logic by hand when there is no SDK. Building retry systems that survive when a vendor API goes down and pick up exactly where they left off. Wrapping command-line tools in small web services when my workflow tool cannot reach them on its own. Designing AI agents that hold their character across long sessions because the memory and prompts are architected, not improvised.",
  "My team is QoreX. Five Claude-based agents I built and work with daily. Storm brainstorms with me. Rune writes the technical specs. Forge ships the code. Echo keeps the memory honest. Hiru drafts every word I send out. I ran the whole team today to ship the page you're on. The AI Agents tab has the longer story.",
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
              <RotatingTitle /> · Remote from the Philippines
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
          className="space-y-4"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <CountUpTile
              target={3400000}
              suffix="+"
              format="compact"
              label="Orders Synced"
            />
            <CountUpTile target={15946} format="comma" label="Active SKUs" />
            <CountUpTile
              target={3}
              noCount
              label="Markets (SG · MY · TH)"
            />
            <CountUpTile
              target={3}
              suffix="+"
              label="Years in Production"
            />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:max-w-3xl md:mx-auto">
            <CountUpTile
              target={300}
              suffix="+"
              label="Workflows in Production"
            />
            <CountUpTile
              target={250000}
              suffix="+"
              format="comma"
              label="HubSpot Enrichments"
            />
            <CountUpTile target={5} label="AI Agents (QoreX)" />
          </div>
          <p className="text-xs text-muted mt-6 text-center md:text-left">
            Last updated: May 2026
          </p>
        </motion.div>
      </div>
    </section>
  );
}
