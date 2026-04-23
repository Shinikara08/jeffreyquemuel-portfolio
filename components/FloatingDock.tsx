"use client";

import { motion } from "framer-motion";
import { Home, User, Briefcase, FileText, Mail } from "lucide-react";

const items = [
  { icon: Home, href: "#home", label: "Home" },
  { icon: User, href: "#about", label: "About" },
  { icon: Briefcase, href: "#projects", label: "Projects" },
  { icon: FileText, href: "#blog", label: "Blog" },
  { icon: Mail, href: "#contact", label: "Contact" },
];

export default function FloatingDock() {
  return (
    <motion.nav
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 1.2 }}
      className="fixed bottom-8 left-1/2 z-40 -translate-x-1/2"
    >
      <div className="flex items-center gap-2 rounded-full border border-white/10 bg-surface/60 px-3 py-2 backdrop-blur-lg">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.label}
              href={item.href}
              aria-label={item.label}
              className="group relative flex h-11 w-11 items-center justify-center rounded-full text-muted transition hover:bg-primary/10 hover:text-primary"
            >
              <Icon className="h-5 w-5" />
              <span className="pointer-events-none absolute -top-10 whitespace-nowrap rounded-md bg-surface px-2 py-1 text-xs text-primary opacity-0 transition group-hover:opacity-100">
                {item.label}
              </span>
            </a>
          );
        })}
      </div>
    </motion.nav>
  );
}
