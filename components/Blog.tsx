"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import ScrollDeck from "@/components/ScrollDeck";

interface Post {
  slug: string;
  date: string;
  readTime: string;
  title: string;
  excerpt: string;
  tags: string[];
}

const POSTS: Post[] = [
  {
    slug: "hubspot-label-enrichment-with-n8n",
    date: "May 27, 2026",
    readTime: "7 min read",
    title: "HubSpot Label Enrichment with n8n, SerpAPI, and Claude",
    excerpt:
      "Building a self-running HubSpot enrichment with n8n, SerpAPI, and Claude. How I wired deep web search and an AI agent to auto-populate music labels into hundreds of artist contacts.",
    tags: ["n8n", "hubspot", "claude", "ai-enrichment"],
  },
  {
    slug: "tasq-tab-notes-from-production",
    date: "May 26, 2026",
    readTime: "7 min read",
    title: "TasQ Tab - Task Manager Desktop App",
    excerpt:
      "What I learned building a personal desktop widget that syncs realtime with ClickUp. Three rounds for a complete sync. Eleven rounds for a small UI element. The straight line is fiction.",
    tags: ["electron", "clickup", "desktop", "production-notes"],
  },
  {
    slug: "how-i-built-a-five-persona-ai-team",
    date: "May 20, 2026",
    readTime: "10 min read",
    title: "How I Built a Five-Persona AI Team That Ships Production Work",
    excerpt:
      "A working-method walk-through of QoreX: five Claude-powered agents with names, roles, handoffs, and a shared brain that ships real production work.",
    tags: ["qorex", "claude-code", "ai-agents", "workflow"],
  },
  {
    slug: "direct-context-rag-no-vector-db",
    date: "May 07, 2026",
    readTime: "6 min read",
    title: "Direct-Context RAG: When You Don't Need a Vector Database",
    excerpt:
      "Building the AutomaQue CRM chatbot, I skipped embeddings entirely. For personal-scale data, the right answer is to pass the whole dataset as context — and the upgrade path is still wide open.",
    tags: ["rag", "claude-api", "bigquery", "architecture"],
  },
  {
    slug: "qolassist-streaming-two-streams",
    date: "May 06, 2026",
    readTime: "6 min read",
    title: "Streaming Two Streams at Once: ASR Partials + LLM Tokens in One UI",
    excerpt:
      "Building QolAssist taught me what 'live' actually means when speech transcription and Claude tokens have to share an event loop without blocking each other.",
    tags: ["pyqt6", "claude-api", "streaming", "asr"],
  },
  {
    slug: "production-n8n-patterns",
    date: "April 24, 2026",
    readTime: "5 min read",
    title: "Four Patterns I Use in Every Production n8n Workflow",
    excerpt:
      "The difference between a workflow that runs and one that survives. Idempotency, backoff, state persistence, dev/prod separation.",
    tags: ["n8n", "production", "patterns"],
  },
  {
    slug: "hmac-sha256-signers-from-scratch",
    date: "February 08, 2026",
    readTime: "6 min read",
    title: "Writing HMAC/SHA256 Signers from Scratch for Shopee and Lazada",
    excerpt:
      "What the marketplace docs leave out. Practical guide with code snippets that actually work in production.",
    tags: ["hmac", "shopee-api", "lazada-api"],
  },
  {
    slug: "reverse-engineering-undocumented-api",
    date: "December 15, 2025",
    readTime: "5 min read",
    title: "Reverse-Engineering an Undocumented API with Chrome DevTools",
    excerpt:
      "The BIGSELLER story — how I turned a closed platform into an open one with DevTools, cookies, and a polling state machine.",
    tags: ["reverse-engineering", "chrome-devtools", "n8n"],
  },
  {
    slug: "ai-automation-actually-means-2026",
    date: "October 20, 2025",
    readTime: "3 min read",
    title: "What AI Automation Actually Means in 2026",
    excerpt:
      "It's not ChatGPT wrappers. Here's what I'm actually building in production — and why the hard part is the boring part.",
    tags: ["ai-automation", "n8n", "opinion"],
  },
];

export default function Blog() {
  return (
    <section id="blog" className="relative z-10 py-32 px-6 md:px-12">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-3 text-xs uppercase tracking-widest text-muted"
        >
          Field Notes
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl font-bold uppercase tracking-wide mb-4"
        >
          Notes from Production
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ delay: 0.2 }}
          className="text-lg text-muted mb-12 max-w-2xl"
        >
          Things I&rsquo;ve learned building automations that can&rsquo;t afford
          to break.
        </motion.p>

        <ScrollDeck>
          {POSTS.map((post, i) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: i * 0.1 }}
              className="snap-start shrink-0 w-[85vw] max-w-[420px]"
            >
              <Link href={`/blog/${post.slug}`} className="block h-full">
                <article className="group relative h-full rounded-2xl border border-white/10 bg-surface/30 backdrop-blur-sm p-8 transition hover:border-primary/40 hover:shadow-[0_0_40px_rgba(103,232,249,0.15)] hover:-translate-y-1">
                  <div className="text-xs text-muted mb-3 uppercase tracking-widest">
                    {post.date} · {post.readTime}
                  </div>

                  <h3 className="text-xl md:text-2xl font-bold uppercase tracking-wide mb-3 leading-tight">
                    {post.title}
                  </h3>

                  <p className="text-sm text-muted mb-6 leading-relaxed">
                    {post.excerpt}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-primary/20 px-2 py-0.5 text-xs text-primary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="text-sm text-primary group-hover:underline">
                    Read More →
                  </div>
                </article>
              </Link>
            </motion.div>
          ))}
        </ScrollDeck>
      </div>
    </section>
  );
}
