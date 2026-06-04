"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const navItems = [
  { href: "/#home", label: "Home" },
  { href: "/#about", label: "About" },
  { href: "/#projects", label: "Projects" },
  { href: "/#blog", label: "Blog" },
  { href: "/qorex", label: "AI AGENTS QoreX" },
  { href: "/#contact", label: "Contact" },
];

export default function TopNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/qorex") return pathname === "/qorex";
    return pathname === "/" && href.startsWith("/#");
  };

  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-border bg-background/85 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 md:px-12">
        <Link
          href="/#home"
          className="text-sm font-bold uppercase tracking-wide text-foreground"
          onClick={() => setOpen(false)}
        >
          JQ.
        </Link>

        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-xs font-medium uppercase tracking-widest transition hover:text-primary ${
                  isActive(item.href)
                    ? "text-primary underline underline-offset-8"
                    : "text-muted"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <ThemeToggle />

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted transition hover:border-primary/40 hover:text-primary md:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-border bg-background/95 px-6 py-4 backdrop-blur-md md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`rounded-xl px-4 py-3 text-sm font-medium uppercase tracking-widest transition ${
                  isActive(item.href)
                    ? "bg-primary/10 text-primary"
                    : "text-muted hover:bg-slate-100 dark:hover:bg-white/5 hover:text-primary"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
