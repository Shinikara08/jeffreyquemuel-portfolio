import Link from "next/link";
import type { ReactNode } from "react";

export default function BlogPostLayout({
  date,
  readTime,
  title,
  subtitle,
  tags,
  children,
}: {
  date: string;
  readTime: string;
  title: string;
  subtitle?: string;
  tags: string[];
  children: ReactNode;
}) {
  return (
    <main className="relative min-h-screen py-24 px-6 md:px-12">
      <article className="mx-auto max-w-3xl relative z-10">
        <Link
          href="/#blog"
          className="inline-block mb-10 text-sm text-muted hover:text-primary transition"
        >
          ← Back to Field Notes
        </Link>

        <div className="text-xs text-muted mb-3 uppercase tracking-widest">
          {date} · {readTime}
        </div>

        <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-wide mb-4">
          {title}
        </h1>

        {subtitle && (
          <p className="text-xl text-primary italic mb-8">{subtitle}</p>
        )}

        <div className="flex gap-2 mb-12 flex-wrap">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-primary/20 px-3 py-1 text-xs text-primary"
            >
              {tag}
            </span>
          ))}
        </div>

        <hr className="border-border mb-12" />

        <div className="space-y-6 text-foreground leading-relaxed text-lg">
          {children}
        </div>

        <div className="mt-16 rounded-2xl border border-primary/20 bg-surface/30 backdrop-blur-sm p-8 text-center">
          <p className="text-lg text-muted mb-4">
            Working on something like this?
          </p>
          <Link
            href="/#contact"
            className="inline-block rounded-full bg-primary px-6 py-3 text-sm font-medium text-background transition hover:shadow-[0_0_30px_rgba(103,232,249,0.5)]"
          >
            Start a conversation →
          </Link>
        </div>
      </article>
    </main>
  );
}
