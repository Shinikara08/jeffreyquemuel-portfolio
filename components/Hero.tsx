"use client";

import { motion } from "framer-motion";
import ScrollingMarquee from "./ScrollingMarquee";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative z-10 flex min-h-screen items-center justify-center overflow-hidden px-4 py-20"
    >
      <ScrollingMarquee />

      <motion.a
        href="#contact"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="absolute right-6 top-6 z-30 rounded-full border border-primary/30 bg-surface/50 px-4 py-2 text-sm text-primary backdrop-blur-sm transition hover:bg-primary/10 hover:shadow-[0_0_20px_rgba(103,232,249,0.3)]"
      >
        Start a Project ⚙
      </motion.a>

<div className="relative z-20 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 flex items-center gap-2 rounded-full border border-primary/20 bg-surface/50 px-4 py-1.5 text-xs uppercase tracking-widest backdrop-blur-sm"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          <span className="text-primary">Available for work</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-7xl font-bold uppercase tracking-wide md:text-9xl"
        >
          Jeffrey Quemuel
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-4 text-2xl text-primary md:text-3xl"
        >
          AI Automation Engineer
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-6 max-w-2xl text-base italic text-muted md:text-lg"
        >
          &ldquo;No API? I build one. No workflow? I automate it. No prompt? I engineer it.&rdquo;
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-4 max-w-xl text-sm text-muted"
        >
          Production-grade automation for multi-market e-commerce.
          <br />
          3.4M+ orders synced across Shopee, Lazada, and BigQuery.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-10 flex flex-wrap justify-center gap-4"
        >
          <a
            href="#projects"
            className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-background transition hover:shadow-[0_0_30px_rgba(103,232,249,0.5)]"
          >
            View My Work →
          </a>
          <a
            href="#contact"
            className="rounded-full border border-primary/40 px-6 py-3 text-sm font-medium text-primary transition hover:bg-primary/10"
          >
            Start a Project ⚙
          </a>
        </motion.div>
      </div>
    </section>
  );
}
