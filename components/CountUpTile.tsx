"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  target: number;
  label: string;
  suffix?: string;
  format?: "comma" | "compact" | "plain";
  duration?: number;
  noCount?: boolean;
};

export default function CountUpTile({
  target,
  label,
  suffix = "",
  format = "comma",
  duration = 1200,
  noCount = false,
}: Props) {
  const [value, setValue] = useState(noCount ? target : 0);
  const ref = useRef<HTMLDivElement | null>(null);
  const started = useRef(false);

  useEffect(() => {
    if (noCount) return;

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started.current) {
            started.current = true;
            const start = performance.now();
            const animate = (now: number) => {
              const elapsed = now - start;
              const progress = Math.min(elapsed / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3);
              setValue(Math.round(target * eased));
              if (progress < 1) requestAnimationFrame(animate);
            };
            requestAnimationFrame(animate);
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [target, duration, noCount]);

  const display = (() => {
    if (format === "compact") {
      if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
      if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
      return value.toString();
    }

    if (format === "comma") return value.toLocaleString("en-US");
    return value.toString();
  })();

  return (
    <div
      ref={ref}
      className="rounded-2xl border border-white/10 bg-surface/30 p-6 backdrop-blur-sm"
    >
      <div className="text-3xl md:text-4xl font-bold text-primary">
        {display}
        {suffix}
      </div>
      <div className="text-xs uppercase tracking-widest text-muted mt-2">
        {label}
      </div>
    </div>
  );
}
