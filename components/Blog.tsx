"use client";

import { motion } from "framer-motion";
import Link from "next/link";

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
    slug: "ai-automation-actually-means-2026",
    date: "October 20, 2025",
    readTime: "3 min read",
    title: "What AI Automation Actually Means in 2026",
    excerpt:
      "It's not ChatGPT wrappers. Here's what I'm actually building in production — and why the hard part is the boring part.",
    tags: ["ai-automation", "n8n", "opinion"],
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
    slug: "hmac-sha256-signers-from-scratch",
    date: "February 08, 2026",
    readTime: "6 min read",
    title: "Writing HMAC/SHA256 Signers from Scratch for Shopee and Lazada",
    excerpt:
      "What the marketplace docs leave out. Practical guide with code snippets that actually work in production.",
    tags: ["hmac", "shopee-api", "lazada-api"],
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {POSTS.map((post, i) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: i * 0.1 }}
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
        </div>
      </div>
    </section>
  );
}
