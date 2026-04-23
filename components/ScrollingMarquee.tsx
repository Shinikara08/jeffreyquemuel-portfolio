"use client";

import { motion } from "framer-motion";

const WORDS = ["AI AUTOMATION", "WORKFLOWS", "PROMPT ENGINEERING", "EMAIL AUTOMATION", "WEB DEVELOPER"];
const SEPARATOR = " · ";

export default function ScrollingMarquee() {
  const text = Array(4).fill(WORDS.join(SEPARATOR) + SEPARATOR).join("");

  return (
    <div
      className="pointer-events-none absolute inset-0 flex items-center overflow-hidden"
      aria-hidden="true"
    >
      <motion.div
        className="flex whitespace-nowrap font-heading font-black uppercase tracking-tight text-hero-word"
        style={{ fontSize: "clamp(5rem, 12vw, 14rem)" }}
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
      >
        <span>{text}</span>
        <span>{text}</span>
      </motion.div>
    </div>
  );
}
