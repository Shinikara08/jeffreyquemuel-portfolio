# Brainstorm — Portfolio Light-Theme Transmutation + Decluttering

**Date:** 2026-06-04
**Origin:** "remove the moving words in the background, the 'Available for work', floating hiru, apply a new light theme UI" (jeffreyquemuel-portfolio)

## Problem
The live portfolio (jeffreyquemuel.cloud) is a dark-themed, motion-heavy page. Three elements add noise without carrying weight — a scrolling word marquee behind the hero, an "Available for work" pill, and a large floating Hiru companion. The overall dark identity is to be replaced with a clean light theme.

## Hypothesis
Removing the three elements declutters the hero and page. The codebase is already token-driven (Tailwind v4 `@theme inline`), so a deliberate light palette in one file swings ~80% of the UI; the remaining ~20% (dark-only flourishes) is small and fully enumerated.

## Four Angles

### Layer 1 — The Obvious
blue: Hand-edit every component, swapping each dark color for a light one by eye.
pink: ~14 files, 74 hardcoded color hits, no single source of truth. Slow, inconsistent, easy to miss glows. Repainting bricks instead of changing the light in the room.
ICE 4.7 — Park It.

### Layer 2 — The Shortcut
blue: Flip the 7 tokens in `globals.css @theme inline` once → ~80% of the UI goes light instantly because components reference tokens, not hex.
pink: StarField, FluidCursor, cyan glows, and `white/x` hairlines still read as dark-mode artifacts on white. Token-flip alone = a broken light theme, not a designed one. It's the mechanism, not the whole answer.
ICE 8.0 — Validate (partial; contained within L4).

### Layer 3 — The Outside-the-Box
blue: Build a `next-themes` light/dark toggle — keep dramatic dark hero as an option, ship light as default.
pink: Doubles surface area (every glow needs dark AND light values), adds a dependency, and wasn't asked for. Scope creep dressed as a feature.
ICE 5.0 — Park It (revisit later).

### Layer 4 — The Jeffrey-Specific Play
blue: Tailwind v4 `@theme inline` IS a native token system — no library needed. (1) Redefine the 7 tokens as a deliberate light palette in one file; (2) patch the 4 real dark-only offenders — StarField particles → faint ink, soften FluidCursor, retune cyan glows → soft elevation shadows, replace `white/x` hairlines with the `border` token; (3) delete the 3 elements. One coherent light identity, ~2 hours, no new dependency.
pink: Only true unknown was the palette taste-call — resolved below.
ICE 8.0 — Build Now.

## ICE Scorecard
- L1 Hand-edit everything: I7 C5 E2 = 4.7 — Park It
- L2 Token-flip only: I7 C8 E9 = 8.0 — Validate (partial)
- L3 Light/dark toggle: I6 C6 E3 = 5.0 — Park It
- L4 Token-redesign + targeted patch + deletions: I9 C8 E7 = 8.0 — **Build Now**

## Chosen Path
**Layer 4.** Redesign the 7 theme tokens for light, patch the 4 dark-only offenders, delete the 3 elements. Single coherent light identity, no toggle, no new dependency. L4 contains L2 (token-flip is the engine); L4 adds the 4 patches that make it look intentional.

### Resolved decisions (from Jeffrey)
- **Palette: Soft neutral.**
  - `background #F8FAFC` · `surface #FFFFFF` · `foreground #0F172A` · `muted #64748B`
  - `primary #0891B2` (cyan) · `secondary #7C3AED` (purple) · `border #E2E8F0`
  - Keeps existing cyan/purple brand intact as accents.
- **Background FX: Keep, recolored.** StarField → faint ink particles `rgba(15,23,42,…)`; FluidCursor softened for a light backdrop. (Do NOT retire them.)

### Scope of work (carve targets)
**Phase 1 — Removals**
- `components/Hero.tsx`: remove `<ScrollingMarquee />` (line 13) + its import (line 4); remove the "Available for work" pill (lines 16–27).
- `app/page.tsx`: remove `<HiruScrollCompanion />` (line 19) + its import (line 12).
- Delete files: `components/ScrollingMarquee.tsx`, `components/HiruScrollCompanion.tsx`.
- Drop the now-unused `--color-hero-word` token from `globals.css`.

**Phase 2 — Light palette** (`app/globals.css`)
- Replace the 7 `@theme inline` tokens with the soft-neutral values above.
- Flip `html, body` background/color to light.
- Flip `::-webkit-scrollbar` track/thumb to light.

**Phase 3 — Patch the 4 dark-only offenders**
- `components/StarField.tsx`: white particle fill → faint ink `rgba(15,23,42,…)`.
- `components/FluidCursor.tsx`: soften glow trail for light background.
- Glows: retune `shadow-[0_0_Xpx_rgba(103,232,249,…)]` → soft neutral elevation shadows. Heaviest in `TechStack.tsx` (28 hits); also Hero CTA, Contact.
- Hairlines: `border-white/10` / `bg-white/5` / `hover:bg-white/5` → `border` token / `surface` / subtle slate. Present in TopNav, HiruScrollCompanion (being deleted), others.

**Phase 4 — Verify**
- `npm run dev`; eyeball hero, TechStack, Projects, Blog, Contact, the `/qorex` page, and BlogPostLayout for contrast and stray dark remnants.

## Suggested Builder Type
Next.js (Forge-Next). The diff is tight enough that Claude Code can carve it directly. Rune confirms.

## Open Questions for Rune
- None blocking. Palette and FX decisions are resolved. Confirm whether the `/qorex` page and blog-post pages (`app/blog/*`, `QoreXCarousel`, `ScrollDeck`, `RotatingTitle`) need the same light pass or are intentionally kept dark — recommend: same light pass for consistency, flag any section that depends on dark imagery (qorex nebula art) for manual review.
