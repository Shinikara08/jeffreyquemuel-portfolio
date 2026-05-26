"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

const sections = [
  { id: "home", label: "Home", line: "Hi, I'm Hiru. Let me guide you." },
  { id: "about", label: "About", line: "This is the origin story." },
  { id: "services", label: "Services", line: "These are the systems Jeffrey can build." },
  { id: "projects", label: "Projects", line: "Here are the shipped artifacts." },
  { id: "experience", label: "Experience", line: "Proof from the field lives here." },
  { id: "blog", label: "Blog", line: "Field notes and technical deep dives." },
  { id: "contact", label: "Contact", line: "Ready to open a portal?" },
];

export default function HiruScrollCompanion() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [showClickHint, setShowClickHint] = useState(false);
  const reduceMotion = useReducedMotion();
  const activeSection = sections[activeIndex];
  const isHome = activeSection.id === "home";
  const isRightSide = activeIndex % 2 === 1;
  const gridX = isRightSide ? "calc(87.5vw - 3rem)" : "calc(12.5vw - 3rem)";
  const gridY = isRightSide ? "calc(62.5vh - 3rem)" : "calc(37.5vh - 3rem)";

  useEffect(() => {
    let frame = 0;

    function updateActiveSection() {
      const viewportAnchor = window.innerHeight * 0.46;
      let nextIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;

      sections.forEach((section, index) => {
        const element = document.getElementById(section.id);

        if (!element) {
          return;
        }

        const rect = element.getBoundingClientRect();
        const sectionCenter = rect.top + rect.height / 2;
        const distance = Math.abs(sectionCenter - viewportAnchor);

        if (distance < closestDistance) {
          closestDistance = distance;
          nextIndex = index;
        }
      });

      setActiveIndex(nextIndex);
    }

    function onScroll() {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(updateActiveSection);
    }

    updateActiveSection();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    if (!isHome || isOpen) {
      setShowClickHint(false);
      return;
    }

    const timer = window.setTimeout(() => setShowClickHint(true), 900);

    return () => window.clearTimeout(timer);
  }, [isHome, isOpen]);

  return (
    <aside
      aria-label="Hiru floating guide"
      className="pointer-events-none fixed inset-0 z-30 hidden xl:block"
    >
      <div className="relative h-screen w-screen">
        <motion.div
          aria-label="Hiru, floating homepage guide"
          className="pointer-events-auto absolute left-0 top-0 block h-24 w-24 origin-top-left scale-50 rounded-full"
          initial={false}
          animate={
            reduceMotion
              ? undefined
              : {
                  x: gridX,
                  y: gridY,
                  rotate: isRightSide ? 3 : -3,
                  scale: activeIndex === 0 ? 1.04 : 0.98,
                }
          }
          transition={{ type: "spring", stiffness: 115, damping: 20, mass: 0.55 }}
        >
          <motion.span
            key={isOpen ? "guide-open" : `${activeSection.id}-${showClickHint}`}
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="absolute bottom-full left-1/2 mb-3 w-80 -translate-x-1/2 rounded-2xl border border-primary/30 bg-background/85 px-4 py-3 text-center text-xs font-bold uppercase tracking-widest text-primary shadow-[0_0_24px_rgba(103,232,249,0.22)] backdrop-blur-md"
          >
            {isOpen ? (
              "Where do you want to go?"
            ) : (
              <>
                {activeSection.line}
                {isHome && showClickHint && (
                  <span className="mt-2 block text-[10px] text-orange-200">
                    Click me.
                  </span>
                )}
              </>
            )}
            <span className="absolute left-1/2 top-full h-3 w-3 -translate-x-1/2 -translate-y-1/2 rotate-45 border-b border-r border-primary/30 bg-background/85" />
          </motion.span>

          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.96 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="absolute left-1/2 top-full mt-4 w-56 -translate-x-1/2 overflow-hidden rounded-2xl border border-white/10 bg-background/90 p-2 shadow-[0_0_28px_rgba(103,232,249,0.18)] backdrop-blur-md"
            >
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  onClick={() => setIsOpen(false)}
                  className="block rounded-xl px-4 py-2.5 text-sm font-bold uppercase tracking-widest text-muted transition hover:bg-primary/10 hover:text-primary"
                >
                  {section.label}
                </a>
              ))}
            </motion.div>
          )}
          <motion.span
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 -z-10 h-40 w-40 -translate-x-1/2 -translate-y-1/2"
            animate={
              reduceMotion
                ? undefined
                : {
                    rotate: [0, 360],
                  }
            }
            transition={{
              rotate: {
                duration: 5.5,
                ease: "linear",
                repeat: Number.POSITIVE_INFINITY,
              },
            }}
          >
            <span className="absolute left-1/2 top-0 h-5 w-5 -translate-x-1/2 rounded-full bg-cyan-300/70 blur-[1px] shadow-[0_0_18px_rgba(56,189,248,0.85)]" />
            <span className="absolute bottom-2 left-8 h-3 w-9 -rotate-12 rounded-full bg-cyan-200/50 blur-sm shadow-[0_0_18px_rgba(103,232,249,0.55)]" />
          </motion.span>
          <motion.span
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 -z-20 h-44 w-44 -translate-x-1/2 -translate-y-1/2"
            animate={
              reduceMotion
                ? undefined
                : {
                    rotate: [360, 0],
                  }
            }
            transition={{
              rotate: {
                duration: 7,
                ease: "linear",
                repeat: Number.POSITIVE_INFINITY,
              },
            }}
          >
            <span className="absolute right-2 top-8 h-4 w-8 rotate-45 rounded-[70%_30%_70%_30%] bg-orange-300/70 blur-[1px] shadow-[0_0_18px_rgba(251,146,60,0.8)]" />
            <span className="absolute bottom-1 left-1/2 h-3 w-10 -translate-x-1/2 rotate-12 rounded-full bg-amber-300/55 blur-sm shadow-[0_0_18px_rgba(251,191,36,0.6)]" />
          </motion.span>
          <motion.span
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 -z-10 h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/20"
            animate={
              reduceMotion
                ? undefined
                : {
                    rotate: [0, -360],
                    scale: [0.95, 1.08, 0.95],
                    opacity: [0.3, 0.55, 0.3],
                  }
            }
            transition={{
              duration: 6.2,
              ease: "linear",
              repeat: Number.POSITIVE_INFINITY,
            }}
            style={{
              boxShadow:
                "0 0 24px rgba(56,189,248,0.22), inset 0 0 18px rgba(251,146,60,0.14)",
            }}
          />
          <motion.span
            aria-hidden="true"
            className="absolute -bottom-2 left-1/2 -z-10 h-14 w-32 -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(251,146,60,0.22),rgba(56,189,248,0.14)_42%,transparent_72%)] blur-md"
            animate={
              reduceMotion
                ? undefined
                : {
                    x: [-8, 8, -4, 6, -8],
                    opacity: [0.45, 0.8, 0.5],
                  }
            }
            transition={{
              duration: 3.2,
              ease: "easeInOut",
              repeat: Number.POSITIVE_INFINITY,
            }}
          />
          <motion.span
            className="relative block h-full w-full overflow-hidden rounded-full border border-primary/50 bg-surface shadow-[0_0_35px_rgba(103,232,249,0.35)]"
            animate={
              reduceMotion
                ? undefined
                : {
                    translateY: [0, -10, 0, 8, 0],
                    boxShadow: [
                      "0 0 28px rgba(103,232,249,0.28)",
                      "0 0 48px rgba(167,139,250,0.32)",
                      "0 0 28px rgba(103,232,249,0.28)",
                    ],
                  }
            }
            transition={{
              translateY: {
                duration: 4,
                ease: "easeInOut",
                repeat: Number.POSITIVE_INFINITY,
              },
              boxShadow: {
                duration: 3.5,
                ease: "easeInOut",
                repeat: Number.POSITIVE_INFINITY,
              },
            }}
          >
            <button
              type="button"
              aria-expanded={isOpen}
              aria-label="Open Hiru guide menu"
              onClick={() => setIsOpen((current) => !current)}
              className="absolute inset-0 z-10 cursor-pointer rounded-full"
            />
            <Image
              src="/images/qorex/hiru-convergence.jpg"
              alt=""
              fill
              sizes="96px"
              quality={100}
              unoptimized
              className={`object-cover transition-transform duration-500 ${
                isRightSide ? "-scale-x-100" : "scale-x-100"
              }`}
            />
            <span className="absolute inset-0 bg-[radial-gradient(circle_at_35%_25%,rgba(103,232,249,0.18),transparent_45%)]" />
          </motion.span>
        </motion.div>

        <div className="absolute bottom-2 right-6 flex gap-3 rounded-full border border-white/10 bg-background/25 px-3 py-2 backdrop-blur-md">
          {sections.map((section, index) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="pointer-events-auto group relative flex h-3 w-3 items-center justify-center"
              aria-label={`Go to ${section.label}`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full border transition group-hover:bg-primary group-hover:shadow-[0_0_14px_rgba(103,232,249,0.8)] ${
                  index === activeIndex
                    ? "border-primary bg-primary shadow-[0_0_14px_rgba(103,232,249,0.8)]"
                    : "border-primary/35 bg-primary/20"
                }`}
              />
              <span className="pointer-events-none absolute right-6 rounded-full border border-white/10 bg-surface/90 px-3 py-1 text-xs text-foreground opacity-0 shadow-lg transition group-hover:opacity-100">
                {section.label}
              </span>
            </a>
          ))}
        </div>
      </div>
    </aside>
  );
}
