# Build Log — Portfolio Light-Theme Transmutation + Decluttering

**Forge variant:** Next
**Started:** 2026-06-04
**Done:** 2026-06-04
**Spec source:** prompt.md

## What was built
- **Phase 1 — Removals.** Cut `<ScrollingMarquee />` + import and the "Available for work" pill from `components/Hero.tsx` (bumped hero top padding `pt-24`→`pt-32` to recover the badge's spacing). Cut `<HiruScrollCompanion />` + import from `app/page.tsx`. Deleted `components/ScrollingMarquee.tsx` and `components/HiruScrollCompanion.tsx`. Removed the orphaned `--color-hero-word` token.
- **Phase 2 — Light palette.** Rewrote the 7 `@theme inline` tokens in `app/globals.css` to soft-neutral (bg `#F8FAFC`, surface `#FFFFFF`, primary `#0891B2`, secondary `#7C3AED`, fg `#0F172A`, muted `#64748B`, border `#E2E8F0`). Flipped `html/body` and the webkit scrollbar to light.
- **Phase 3 — Dark-only patches.** StarField particles `rgba(255,255,255)`→ faint ink `rgba(15,23,42, …*0.35)`. FluidCursor: fade-wash `rgba(10,15,30,0.08)`→ light `rgba(248,250,252,0.10)`, smoke palette → ink/muted/cyan tones, draw alpha `0.45`→`0.22`. Swept ~16 components: `border-white/10|20`→`border-border`, `hover:bg-white/5`→`hover:bg-slate-100`, `bg-surface/30|40|50`→`bg-surface`, cyan/purple neon glows → soft neutral elevation (`shadow-[0_10px_30px_rgba(15,23,42,0.10)]`), CTA hovers → soft cyan (`rgba(8,145,178,0.25)`).
- **Phase 4 — /qorex pass.** Per-agent `cardTint` `-50/5`→ solid pale `-50`; chips rebuilt to light (`border-*-200 bg-*-100 text-*-700`) for all six families; glass panels `bg-background/35|70`→`bg-slate-50`, `bg-background/50`→`bg-slate-100`, `bg-surface/20|30`→`bg-surface`; hairlines + glows swept. Dark nebula images kept as framed art. Also swept the 11 blog routes (`border-white/10`→`border-border`, code/quote `bg-surface/40`→`bg-slate-50`, figures `bg-surface/30`→`bg-surface`).
- **Phase 5 — Verify.** `npm run build` green. Live dev verification via Chrome on `/` and `/qorex`.

## Tools / libs / APIs actually used
- Existing only: Next.js 16.2.4 (Turbopack), React, framer-motion, Tailwind v4 (`@theme inline`), lucide-react, react-icons. No additions. No `next-themes` (toggle was out of scope).

## Decisions made
- **Two real bugs caught beyond spec:** TechStack's Next.js and Vercel icons were hardcoded `#FFFFFF` (invisible on white) — changed to `#0F172A`. (TechStack edge-fade gradients already key off `from-background`, so they self-corrected to light.)
- **Translucent surface cards → solid `bg-surface` (white).** `bg-surface/30` over a light bg is nearly invisible; solid white + token border + soft shadow gives crisp card definition.
- **`ZoomableImage.tsx` left untouched.** Its `bg-black/50` + white controls are a fullscreen lightbox over images — correct in any theme. Logged as intentional.
- **Blog code blocks / blockquotes → `bg-slate-50`** (not solid white) for subtle contrast against the page.
- **Scripted sed sweep** for the repeated literal patterns across ~16 components + blog routes — far cleaner than ~40 individual edits. qorex chips done as explicit per-family replacements.

## Cut from scope
- No light/dark toggle (Storm parked Layer 3; light is the single shipped identity).
- Deploy not performed — local build + verify only, per spec. Vercel push is Jeffrey's call.

## Blockers hit
- Chrome DevTools MCP couldn't attach — a stale MCP-managed Chrome held the profile lock. Resolved by killing only the processes whose command line referenced `chrome-devtools-mcp` (left the user's normal Chrome alone).

## Validation
- [x] No `<ScrollingMarquee>`, "Available for work" pill, or `<HiruScrollCompanion>`; files deleted; no dangling imports (build confirms).
- [x] `globals.css` carries soft-neutral tokens; `html/body` + scrollbar light; `--color-hero-word` gone.
- [x] grep for `rgba(103,232,249` / `rgba(167,139,250` / `border-white/` / `bg-white/` / `rgba(255,255,255` / `bg-surface/[0-9]` returns only intentional, retuned uses.
- [x] FluidCursor visible on white and no longer darkens the page; StarField reads as faint ink.
- [x] `/qorex` cards, chips, and panels legible (dark text on light tint); six agents still color-distinguished.
- [x] `npm run build` exits 0 (15/15 static pages).
- [x] Live visual check on `/` and `/qorex` — clean light theme, good contrast, no dark remnants.

## Follow-up build — Dark/Light Toggle (2026-06-04)
After the light-only ship, Jeffrey asked for a dark/light **toggle** (Storm's parked Layer 3). Built it without re-doing the light work:
- **Dual token sets in `globals.css`.** Restructured to `:root` (light) + `.dark` (dark, = the original palette) CSS variables, with `@custom-variant dark (&:where(.dark, .dark *))` and `@theme inline` mapping color tokens to the runtime vars. Every token-driven component (~90% of the UI) now swaps automatically between modes. Body bg/color via `var(--background)`/`var(--foreground)`; scrollbar via vars too.
- **`next-themes`** added (`attribute="class"`, `defaultTheme="light"`, `enableSystem={false}`, `disableTransitionOnChange`). New `components/ThemeProvider.tsx` wraps the app in `layout.tsx`; `suppressHydrationWarning` added to `<html>`. No-flash SSR handled by the library.
- **`components/ThemeToggle.tsx`** — Sun/Moon (lucide) button, `mounted` guard to avoid hydration mismatch, placed in `TopNav` (visible desktop + mobile).
- **Canvas FX made theme-aware** (StarField, FluidCursor): each reads `resolvedTheme` into a ref the draw loop consumes, so a toggle recolors live without re-init. Light = ink particles / ink-on-light-wash smoke; dark = white stars / original black-smoke-on-dark-wash.
- **`dark:` variants restored the original dark specifics** that the light build had hardcoded: qorex per-agent `cardTint` (`dark:bg-*-50/5`) and `chip` (`dark:border-*-400/40 dark:bg-*-600/20 dark:text-*-100`), qorex glass panels + blog code blocks (`dark:bg-white/5`), TopNav mobile hover. TechStack's Next.js/Vercel icons switched from a fixed hex to `var(--foreground)` so they invert per theme.

**Decisions:** defaultTheme = **light** (matches the session's intent; one-line change in `layout.tsx` to flip). Used `next-themes` despite the original light-only spec saying not to — the toggle requirement makes it the right, standard tool (logged here per honesty rule).
**Cut from scope (documented):** the always-on cyan/purple *neon glows* were collapsed to soft neutral shadows in the light build and are NOT re-added as dark-mode neon — dark mode uses clean token borders instead. CTA hover glows (cyan) still show in both modes. Re-adding per-element neon to dark is a future polish pass if wanted.
**Validation:** `npm run build` green (15/15). Live-verified the toggle on `/` (light↔dark) and `/qorex` (per-agent chips/tints correct in both modes); theme persists across navigation.

## Handoff notes for Echo
The surprise: the codebase was ~80% token-driven, so the *palette flip was one file* — the real labor was the 20% of dark-only flourishes (canvas FX, neon glows tuned for near-black, and `white/x` hairlines that vanish on white). The two genuine bugs (`#FFFFFF` icons, dark cursor fade-wash) were invisible to a token swap and only surfaced by reading the actual draw code. Lesson for future theme work: token systems carry the bulk, but canvas/`rgba()`/`white-alpha` are where dark assumptions hide. Three Q-Stack agents in one chain (Storm → Rune → Forge) on a live shipped artifact; deploy intentionally left to Jeffrey.
