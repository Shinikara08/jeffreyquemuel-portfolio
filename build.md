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

## Follow-up — Verify all qorex cards + SHIP to production (2026-06-04)
Jeffrey reported the live qorex still showed the image gap. Root cause: the whole session's work was **uncommitted/undeployed** — the live site was the old build. Not a new bug.
- **Verified all 6 agent cards** (Jeffrey, Hiru, Storm, Rune, Forge, Echo) in BOTH light and dark via Chrome on localhost. Every portrait fills its full column edge-to-edge on the dark `#0A0F1E` backing (shared `md:h-full` + `object-cover` template). Chips/tints/text legible in both modes.
  - **Non-issue caught:** full-page headless screenshots showed Rune/Forge/Echo image cells blank — that's Next/Image lazy-load not firing for below-fold images in headless capture. Confirmed via DOM (all 6 `<Image>` have valid src) and by scrolling each into view (they load + fill). Real users are fine. Left lazy-loading as-is (good for perf).
- **Committed** the full session bundle as `481da94` (39 files: light theme + token duality, next-themes toggle, hero declutter, JQ. brand, qorex card fills + dark variants, FX theme-awareness; new ThemeProvider/ThemeToggle; deleted ScrollingMarquee/HiruScrollCompanion).
- **Deployed** via `git push origin main` → Vercel auto-deploy (GitHub-connected, repo already public so no Hobby-tier author block). Verified live: `jeffreyquemuel.cloud/qorex` HTML contains `md:h-full`, `object-cover`, `bg-[#0A0F1E]`, `dark:bg-fuchsia-600`, and the theme-toggle aria-label. Build green (15/15 static pages).

## Follow-up — Card image fit: contain vs the 16:9 void (2026-06-04, LOCAL ONLY)
Jeffrey disliked the deployed `object-cover` (it crops the art) and wanted the full composition shown ("the layout before").
- **Key finding:** all 6 agent images are 2560×1440 (16:9 landscape), identical. So `object-contain` in the tall card column shows the full uncropped scene but only reaches ~275px tall, leaving a large empty dark matte below (looked half-empty / like a failed load). The "before" he liked was actually cropping slightly to fill a shorter box.
- **Resolution (scope change from the literal "contain + dark matte" pick):** added a **blurred backdrop** — the same image rendered twice in the cell: a back layer `object-cover scale-110 blur-2xl opacity-40` fills the matte, a front layer `object-contain` shows the full sharp composition. Result: full uncropped art + no empty void + theme-independent (the blur is the image, not the cell bg). Added `overflow-hidden` to the cell.
- **Verified locally** both themes: Jeffrey (light), Hiru + Storm + Echo (dark) — full art visible, blurred fill blends into card, no void. Build green (15/15).
- **NOT committed, NOT deployed** — Jeffrey is verifying locally and will say when to ship. Live site still shows the previous `object-cover` version (commit 481da94).
- Open choice for Jeffrey: (a) keep blurred backdrop [recommended], (b) plain `object-contain` + dark matte (his literal pick, but half-empty), (c) revert to `object-cover` (fills but crops).

## Follow-up — qorex cards: full-bleed photo + overlaid text (2026-06-04, LOCAL ONLY)
Jeffrey showed a target image and confirmed he wants the agent photo as a **full-card background with text overlaid on top** (Storm's parked Layer 3). This supersedes the side-by-side + blurred-backdrop iterations.
- Rebuilt each agent `<article>`: dropped the `md:grid` two-column split. Now `relative flex min-h-[460px] md:min-h-[520px]` with the agent `<Image fill object-cover -z-20>` as a full-bleed background, a readability scrim `<div bg-gradient-to-l from-black/85 via-black/60 to-black/25 -z-10>`, and the text layer `relative z-10 ml-auto max-w-2xl` overlaid on the right.
- Text is now theme-independent (always white on the dark photo+scrim): chip = frosted `bg-white/10 border-white/25`, quote/bio/power tiles = `bg-black/35 border-white/10 backdrop-blur-md`, name has a text-shadow, Powers label `text-cyan-300`. Left accent stripe (`agent.border`) and solid CTA button kept.
- `agent.cardTint` and `agent.chip` are now unused (left in the data array, harmless).
- Verified locally both themes (Jeffrey light + dark): full photo visible as background, text readable over scrim, consistent across themes. Build green (15/15).
- **NOT committed, NOT deployed.** Live still shows the side-by-side `object-cover` (commit 481da94). Awaiting Jeffrey's go to ship.

## Follow-up — qorex cards: stacked layout, character on top (2026-06-04, LOCAL ONLY)
Jeffrey asked to "move the agents to the 2nd row" — i.e., character in the upper band, text below. Within full-bleed this was impossible (wide 16:9 images = no vertical pan; the tall text always covered the character). So switched to a **stacked layout**: a full 16:9 image banner on top (`aspect-video`, `object-cover` = no crop / no void since image is also 16:9), text section below on `bg-surface` with theme-aware styling restored (agent.chip + dark: variants, text-foreground, bg-slate-50 dark:bg-white/5 panels, text-primary label). Article is now `flex flex-col`. Verified locally (Storm dark). Build green. NOT committed/deployed.

## Follow-up — REVERT qorex cards to original layout (2026-06-04, LOCAL ONLY)
Jeffrey: revert ONLY the qorex cards to the original dark-only layout, keep the rest of the session (light theme, toggle, decluttered hero, JQ. brand). Executed `git checkout 74f501d -- app/qorex/page.tsx` — restores the original side-by-side card (image-left `object-contain` in an `aspect-video`/`bg-background/50` box, text-right `bg-surface/20`, original dark cardTint/chip/glass panels + cyan glows). No other files touched. Build green (15/15).
- **Dark mode:** correct/original. ✓
- **Light mode (HONEST):** legible but washed-out — the original's translucent dark panels (`bg-surface/20`, `bg-background/70`) nearly disappear on the light bg, `border-white/10` borders invisible, image boxes show light letterbox gaps, cyan neon glows read oddly. Expected: this layout was built dark-only and was NOT theme-adapted on revert (per instruction: revert only, no auto-fix).
- NOT committed, NOT deployed. Temp 5x5 grid still mounted. Offered to theme-adapt the original card for light mode if Jeffrey wants both themes to look right.

## Follow-up — grey card tile in light theme (2026-06-04, LOCAL ONLY)
Jeffrey: add a grey background to the qorex card tiles in light theme (fixes the washed-out light-mode look from the revert). Changed the article bg from `${agent.cardTint}` to `bg-slate-200 ${agent.cardTint.replace("bg-","dark:bg-")}` — light mode gets a solid grey tile; dark mode keeps the original per-agent tint (the `dark:` variant wins by specificity, so the grey is light-only). Verified: light = grey tiles with definition; dark = original look unchanged. Build green (15/15). NOT committed/deployed. Temp grid still up.

## Follow-up — qorex hero image swap + grid removal (2026-06-04, LOCAL ONLY)
- Swapped the qorex main/hero image from `convergence.jpg` to **`qorenexus.png`** (copied from C:\Users\qshin\Desktop\JEFFREY_MD\qorex_final_image into public/images/qorex/; updated src on the aspect-[2/1] hero). New QoreNexus full-cast convergence art. Verified rendering on localhost.
- **Removed the temp 5x5 grid**: deleted `components/TempGrid.tsx` and its import/mount in `app/layout.tsx`. No references remain.
- Build green (15/15). NOT committed/deployed.

## Follow-up — reframe Hiru's powers + bio (2026-06-04, LOCAL ONLY)
Jeffrey: change Hiru's powers away from client negotiation / emailing, and don't state that Hiru drafts his emails. Rewrote Hiru's `abilities` (Decode roles / Frame work as value / Prep interviews / Position the portfolio / Translate systems to plain wins / Sharpen narrative+brand) and the `bio` (removed "handles every word... cover letters, application emails... negotiations" → now "shaping how the work is understood: decoding roles, framing technical depth as value, keeping the story straight"). Kept the OUTWARD VOICE tag, quote, and "never lie about his pack" rule. Build green (15/15). NOT committed/deployed.

## Follow-up — update Forge's variants 5→6 (2026-06-04, LOCAL ONLY)
Jeffrey: the "Build in five variants: Code, n8n, Next, Script, Doc" power is outdated. Updated Forge's ability to "in six variants: Code, n8n, Next, Script, Doc, Media" and the bio to "Six variants - ... Doc (decks and documents), Media (image and media craft)". Build green (15/15). NOT committed/deployed.

## TEMP — 5x5 positioning grid (REMOVED 2026-06-04)
~~Added components/TempGrid.tsx + mount in layout.tsx.~~ Removed — see follow-up above.

## Follow-up — Lighthouse: all 4 categories to 100 (2026-06-04, LOCAL ONLY)
From a live Lighthouse report (Accessibility 88, Best Practices 77, SEO 100, Agentic-Browsing 50). Fixes:
- **aria-prohibited-attr** (a11y): added `role="text"` to the HeroTitleRoller outer span (it had aria-label, no role).
- **color-contrast** (a11y): white text on the cyan primary button was 3.51:1. Darkened the light-mode `--primary` token `#0891B2`→`#0E7490` (cyan-700, ~5.1:1 with near-white text; dark-mode primary unchanged). Footer "All workflows reserved." `text-primary/70` (2.39:1) → `text-muted`.
- **select-name** (a11y): added `aria-label="Project type"` to the Contact `<select name="projectType">`.
- **svg-img-alt** (a11y): added `aria-hidden focusable={false}` to the TechStack react-icons (decorative, label text adjacent) and to the Footer social icons (their `<a>` already carry aria-labels).
- **third-party-cookies + inspector-issues** (best-practices): replaced the embedded Google Calendar `<iframe>` in Contact.tsx with a "Book a Call" link (`target="_blank" rel="noopener noreferrer"` to the scheduling URL). No Google NID cookie / reCAPTCHA loads anymore. Removed the now-unused CALENDAR_CONFIGURED + setup comment; kept CALENDAR_URL.
- Agentic-Browsing 50→100 comes free (its `agent-accessibility-tree` failure was the same 3 a11y issues; CLS already passed).
- Build green (15/15). Verified light mode: buttons readable (darker teal), Book-a-Call card renders, form/select intact, tech icons still show.
- **NOT committed, NOT deployed.** IMPORTANT: the live Lighthouse score only updates after deploy — these fixes are local until then.

## Follow-up — qorex Powers text white in dark (2026-06-04, LOCAL ONLY)
Jeffrey: in dark theme, make the Powers ability-tile text all white. Changed the ability `<li>` from `text-sm text-muted` → `text-sm text-muted dark:text-white` (light keeps muted; dark = white; the lead `<strong>` was already text-foreground/white). Build green (15/15). NOT committed/deployed.
- OBSERVED (flagged to Jeffrey, not changed): the qorex agent cards render light-grey in DARK mode too. The earlier "grey card tile in light theme" used `bg-slate-200 dark:bg-{tint}/5`, but the `dark:` utility variant uses a zero-specificity `:where()` custom-variant, so `bg-slate-200` isn't reliably overridden in dark — the grey leaks into dark mode. Offered to scope the grey to light-only (e.g., move grey into a `:root`-only token or restructure) if he wants dark cards back in dark mode.

## Handoff notes for Echo
The surprise: the codebase was ~80% token-driven, so the *palette flip was one file* — the real labor was the 20% of dark-only flourishes (canvas FX, neon glows tuned for near-black, and `white/x` hairlines that vanish on white). The two genuine bugs (`#FFFFFF` icons, dark cursor fade-wash) were invisible to a token swap and only surfaced by reading the actual draw code. Lesson for future theme work: token systems carry the bulk, but canvas/`rgba()`/`white-alpha` are where dark assumptions hide. Three Q-Stack agents in one chain (Storm → Rune → Forge) on a live shipped artifact; deploy intentionally left to Jeffrey.
