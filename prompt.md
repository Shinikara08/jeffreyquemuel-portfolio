# Prompt — Portfolio Light-Theme Transmutation + Decluttering

**Carved:** 2026-06-04
**From:** brainstorm.md (chosen path: Layer 4 — token-redesign + targeted patch + deletions)

## Builder Type
**Forge variant:** Next
**Why:** In-place modification of an existing Next.js 16 + Tailwind v4 app; no new services, just theme tokens, component patches, and three deletions.

## Goal (Definition of Done)
The portfolio renders as a coherent **soft-neutral light theme** with no dark-mode remnants. The scrolling background marquee, the "Available for work" pill, and the floating Hiru companion are gone. Every page — home, `/qorex`, and the blog routes — has legible text, visible borders, and soft (not neon-glow) elevation against a light background. `npm run build` passes with no unused-import or type errors. Background FX (StarField, FluidCursor) remain present but recolored so they read as faint ink on light, never as a darkening wash.

## The Prompt

You are modifying the live portfolio at `C:\Users\qshin\Documents\Claude\Projects\jeffreyquemuel-portfolio`. Work in phases, in order. Log decisions and any scope cuts to `build.md`.

### Phase 1 — Removals
1. `components/Hero.tsx`:
   - Remove the `import ScrollingMarquee from "./ScrollingMarquee";` line and the `<ScrollingMarquee />` usage.
   - Remove the entire "Available for work" badge `<motion.div>` (the pill with the pinging dot + `<span>Available for work</span>`). Leave the `<h1>`, roller, quote, subtext, and CTA buttons intact and correctly spaced (the next element's top margin should still look right with the pill gone).
2. `app/page.tsx`:
   - Remove `import HiruScrollCompanion from "@/components/HiruScrollCompanion";` and the `<HiruScrollCompanion />` mount.
3. Delete the orphaned files: `components/ScrollingMarquee.tsx`, `components/HiruScrollCompanion.tsx`.
4. In `app/globals.css`, remove the now-unused `--color-hero-word` token.

### Phase 2 — Light palette (`app/globals.css`)
Replace the `@theme inline` token values with the soft-neutral palette:
```
--color-background: #F8FAFC;
--color-surface:    #FFFFFF;
--color-primary:    #0891B2;   /* cyan, darkened for contrast on light */
--color-secondary:  #7C3AED;   /* purple */
--color-foreground: #0F172A;
--color-muted:      #64748B;
--color-border:     #E2E8F0;
```
- Update `html, body`: `background-color: #F8FAFC; color: #0F172A;`.
- Update the scrollbar block: track → `#F8FAFC` (or `#E2E8F0`), thumb → `#CBD5E1`, thumb:hover → `#0891B2`.
- Keep the `float` keyframe and `prefers-reduced-motion` block unchanged.

### Phase 3 — Patch the dark-only offenders
The app is token-driven, so most components flip automatically. Patch only what hardcodes dark assumptions:
1. **`components/StarField.tsx`** — change the particle fill from `rgba(255, 255, 255, …)` to a faint ink, e.g. `rgba(15, 23, 42, ${star.opacity * pulse * 0.5})`. Reduce max opacity so it reads as a subtle texture, not specks of dirt.
2. **`components/FluidCursor.tsx`** — two edits:
   - The trailing fade fill on ~line 91: change `rgba(10, 15, 30, 0.08)` → a light wash `rgba(248, 250, 252, 0.10)` so the canvas fades toward the light background, not toward black.
   - The `SMOKE_PALETTE`: keep it ink-toned so the trail is visible on white. Suggested: `"15, 23, 42"` (slate ink, 0.5), `"100, 116, 139"` (muted, 0.3), `"8, 145, 178"` (cyan accent, 0.2). Lower the draw alpha if the trail looks heavy.
3. **Glow shadows → soft elevation.** Search all components for `shadow-[0_0_*px_rgba(103,232,249,*)]` and `rgba(167,139,250,*)`. Replace neon glows with soft neutral shadows, e.g. `shadow-[0_8px_24px_rgba(15,23,42,0.08)]` (or Tailwind `shadow-lg`/`shadow-xl`). Keep cyan tint ONLY on intentional hover-accent CTAs (Hero buttons, Contact, qorex CTA) but lighten it, e.g. `hover:shadow-[0_8px_30px_rgba(8,145,178,0.25)]`. Heaviest in `components/TechStack.tsx` (~28 hits) — sweep it fully.
4. **White-alpha hairlines.** Replace `border-white/10` → `border-border` (or `border-slate-200`), `bg-white/5` and `hover:bg-white/5` → `bg-slate-50` / `hover:bg-slate-100`. Present in `TopNav.tsx`, `app/qorex/page.tsx`, and others.

### Phase 4 — `/qorex` page pass (`app/qorex/page.tsx` + `components/QoreXCarousel.tsx`)
This page has per-agent color objects tuned for dark. Fix readability on light:
- `cardTint` values like `bg-fuchsia-50/5` → bump to a visible light tint, e.g. `bg-fuchsia-50` (or `/60`). Apply the same logic to each agent's tint color family.
- `chip` values like `border-fuchsia-400/40 bg-fuchsia-600/20 text-fuchsia-100` → use a light chip: lighter fill + dark-enough text, e.g. `border-fuchsia-300 bg-fuchsia-100 text-fuchsia-700`. Repeat per color family (slate, blue/pink, amber, red, violet).
- Glass panels `bg-background/70`, `bg-surface/20`, `bg-background/35`, `bg-background/50` → light equivalents (`bg-white/70`, `bg-slate-50`, etc.) so dark text reads.
- `button` solids (`bg-fuchsia-600 hover:bg-fuchsia-500` with `text-white`) are fine — keep as-is; they're high-contrast on light.
- The dark nebula/convergence **images stay unchanged** — they are framed art inside rounded cards and read well on light.
- Re-tune the two big `shadow-[0_0_60px_rgba(103,232,249,*)]` / `shadow-[0_0_40px_…]` card glows to soft neutral shadows.

### Phase 5 — Verify
- Run `npm run build` — must pass clean (no unused imports from Phase 1, no type errors).
- Run `npm run dev` and eyeball: Hero, TechStack, About, Services, Projects, Experience, Blog, Contact, Footer, the full `/qorex` page, and at least one `/blog/*` route via `BlogPostLayout`. Check text contrast (WCAG AA, muted text ≥ 4.5:1), visible borders, no neon glows, no dark wash from the cursor trail.
- Note any section left dark-on-purpose (e.g. an image-dependent panel) in `build.md`.

## Dependencies
- APIs: none.
- Libraries / packages: existing only — `next` (16), `react`, `framer-motion`, `tailwindcss` (v4), `lucide-react`. No additions; do NOT add `next-themes` (no toggle in scope).
- Secrets / accounts: none.
- Environment: Node per repo `package.json`; `npm install` already satisfied (node_modules present).

## Output Artifact Spec
- Modified: `app/globals.css`, `app/page.tsx`, `app/qorex/page.tsx`, `components/Hero.tsx`, `components/StarField.tsx`, `components/FluidCursor.tsx`, `components/TechStack.tsx`, `components/TopNav.tsx`, `components/QoreXCarousel.tsx`, and any other component still holding `border-white/*`, `bg-white/*`, or cyan/purple glow shadows.
- Deleted: `components/ScrollingMarquee.tsx`, `components/HiruScrollCompanion.tsx`.
- Created: `build.md` (Forge's engineering log).
- Format: `.tsx` / `.css` source in place.

## Validation Criteria
- [ ] No `<ScrollingMarquee>`, "Available for work" pill, or `<HiruScrollCompanion>` anywhere; their files are deleted; no dangling imports.
- [ ] `app/globals.css` carries the soft-neutral tokens; `html/body` and scrollbar are light; `--color-hero-word` is gone.
- [ ] `grep` for `rgba(103,232,249` / `rgba(167,139,250` / `border-white/` / `bg-white/` / `rgba(255, 255, 255` returns only intentional, retuned uses (documented in build.md) — no stray dark-mode remnants.
- [ ] FluidCursor trail is visible on white and does NOT darken the page over time; StarField reads as faint ink.
- [ ] `/qorex` agent cards, chips, and glass panels are legible (dark text on light tint); per-agent accent colors still distinguish the six agents.
- [ ] `npm run build` exits 0.

## Open Assumptions
- The dark nebula/convergence/agent **images** are kept as framed art on the light pages (NOT recolored). Confirm if any should be swapped for light variants.
- `/qorex` and `/blog/*` get the same light pass as the home page (consistency). Confirmed direction from brainstorm; flag in build.md if any panel genuinely needs to stay dark.
- No light/dark toggle (Layer 3 was parked). Light is the single shipped identity.
- Deploy is out of scope for this carving — Forge builds + verifies locally; a separate deploy step (Vercel) is Jeffrey's call afterward.
