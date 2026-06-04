"use client";

import { useEffect, useState } from "react";

const TITLES = [
  "AI SYSTEMS ENGINEER",
  "DATA EXPERT",
  "CRM DEVELOPER",
  "SOFTWARE DEVELOPER",
  "ANDROID APP DEVELOPER",
];

export default function HeroTitleRoller() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % TITLES.length);
    }, 2600);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <span
      role="text"
      aria-label={TITLES[index]}
      className="relative block h-[1.15em] max-w-full overflow-hidden text-3xl text-primary sm:text-4xl md:text-5xl"
    >
      <span
        className="block transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]"
        style={{ transform: `translateY(-${index * 1.15}em)` }}
      >
        {TITLES.map((title) => (
          <span
            key={title}
            aria-hidden="true"
            className="block h-[1.15em] whitespace-nowrap uppercase tracking-wide"
          >
            {title}
          </span>
        ))}
      </span>
    </span>
  );
}
