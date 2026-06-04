import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import QoreXCarousel from "@/components/QoreXCarousel";

export const metadata: Metadata = {
  title: "AI AGENTS QoreX - Jeffrey Quemuel",
  description:
    "Six-part AI operating system. One shared brain. Real artifacts. Meet QoreX: Jeffrey, Hiru, Storm, Rune, Forge, and Echo.",
  openGraph: {
    title: "AI AGENTS QoreX - Jeffrey Quemuel",
    description:
      "Six-part AI operating system. One shared brain. Real artifacts. Meet QoreX: Jeffrey, Hiru, Storm, Rune, Forge, and Echo.",
    url: "https://jeffreyquemuel.cloud/qorex",
    siteName: "Jeffrey Quemuel",
    images: [
      {
        url: "https://jeffreyquemuel.cloud/images/qorex/convergence.jpg?v=2",
        width: 2560,
        height: 1440,
        alt: "QoreX AI team convergence artwork from Jeffrey Quemuel's portfolio",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI AGENTS QoreX - Jeffrey Quemuel",
    description:
      "Six-part AI operating system. One shared brain. Real artifacts. Meet QoreX: Jeffrey, Hiru, Storm, Rune, Forge, and Echo.",
    images: ["https://jeffreyquemuel.cloud/images/qorex/convergence.jpg?v=2"],
  },
};

const agents = [
  {
    tag: "SYSTEM ARCHITECT",
    name: "Jeffrey",
    quote: '"I build the system, then I work inside it."',
    image: "/images/qorex/jeffrey-nebula.jpg",
    alt: "Jeffrey standing on a floating platform in a magenta nebula horizon",
    bio: "Jeffrey is the human operator and systems architect behind QoreX. I decide the goal, set the truth rules, approve the handoffs, and ship the final artifact. The agents expand my working surface, but the accountability stays with me.",
    abilities: [
      ["Direct", "the pipeline from idea to shipped artifact"],
      ["Approve", "scope, facts, and final framing"],
      ["Connect", "QoreX output to real client work"],
      ["Build", "the repo, workflow, or document when the system hands me the plan"],
      ["Validate", "claims against shipped work and business context"],
      ["Own", "the final decision and delivery"],
    ],
    href: "/blog/how-i-built-a-five-persona-ai-team",
    cta: "Read the System Story",
    cardTint: "bg-fuchsia-50 dark:bg-fuchsia-50/5",
    border: "border-fuchsia-400",
    button: "bg-fuchsia-600 hover:bg-fuchsia-500",
    chip: "border-fuchsia-200 bg-fuchsia-100 text-fuchsia-700 dark:border-fuchsia-400/40 dark:bg-fuchsia-600/20 dark:text-fuchsia-100",
  },
  {
    tag: "OUTWARD VOICE",
    name: "Hiru",
    quote: '"I walk beside you. Show me the road."',
    image: "/images/qorex/hiru-convergence.jpg",
    alt: "Hiru, a black and white wolf etched with glowing runes",
    bio: "Giant wolf etched with white runes from every project I have carried through the forge. Hiru handles every word that leaves me and reaches another person - cover letters, application emails, interview prep, pitches, negotiations. Editorial freedom over framing, zero agency over facts. The rule: the wolf would never lie about his pack.",
    abilities: [
      ["Decode", "job posts and strip the marketing fluff"],
      ["Draft", "cover letters and application emails in my voice"],
      ["Prep", "STAR-format interview answers from the brain"],
      ["Anchor", "salary negotiations to real market data"],
      ["Write", "client proposals and SOW documents"],
      ["Negotiate", "counter-terms via written follow-ups"],
    ],
    href: "/blog/how-i-built-a-five-persona-ai-team#hiru",
    cta: "Read Hiru's Story",
    cardTint: "bg-slate-50 dark:bg-slate-50/5",
    border: "border-slate-400",
    button: "bg-slate-700 hover:bg-slate-600",
    chip: "border-slate-300 bg-slate-100 text-slate-700 dark:border-slate-400/40 dark:bg-slate-700/20 dark:text-slate-100",
  },
  {
    tag: "BRAINSTORMER",
    name: "Storm",
    quote: '"The winds gather. What\'s the idea?"',
    image: "/images/qorex/storm-nebula.jpg",
    alt: "Storm as a nebula horizon strategist facing a glowing spell circle",
    bio: "Genderless cathedral spirit who hovers in blue light. Storm holds two energy currents at once - blue for clarity, pink for possibility - and takes any half-baked idea and produces four angles on it: the obvious approach, the smarter shortcut, the outside-the-box angle, and the play that fits my actual stack. Always ICE-scores each angle before converging.",
    abilities: [
      ["Brainstorm", "in four layers (obvious / shortcut / outside-the-box / Jeffrey-specific)"],
      ["Score", "every idea with ICE (Impact, Confidence, Ease)"],
      ["Surface", "smarter shortcuts before I build the obvious thing"],
      ["Contrast", "two paths head-to-head when I am stuck"],
      ["Read", "the brain first so no idea collides with shipped work"],
      ["Propose", "the project folder name and seal the brainstorm"],
    ],
    href: "/blog/how-i-built-a-five-persona-ai-team#storm",
    cta: "Read Storm's Story",
    cardTint: "bg-blue-50 dark:bg-blue-50/5",
    border: "border-pink-400",
    button: "bg-blue-600 hover:bg-blue-500",
    chip: "border-pink-200 bg-blue-100 text-blue-700 dark:border-pink-400/40 dark:bg-blue-600/20 dark:text-blue-100",
  },
  {
    tag: "PROMPT MASTER",
    name: "Rune",
    quote: '"Show me the path. I\'ll carve the rune."',
    image: "/images/qorex/rune-nebula.jpg",
    alt: "Rune holding a golden sigil while floating runestones circle her",
    bio: "Silver-haired scribe-witch in an autumn grove, carving glyphs into a runestone. Rune takes Storm's chosen path and turns it into a precise, machine-readable spec that Forge can execute. She picks the builder variant, defines success criteria, lists dependencies, and writes the prompt. The still point between Storm's possibility and Forge's ship-mode.",
    abilities: [
      ["Carve", "machine-readable specs from Storm's brainstorms"],
      ["Pick", "the builder variant (Code / n8n / Next / Script / Doc)"],
      ["Define", "success criteria that Echo can validate"],
      ["List", "every dependency, API, and secret the build needs"],
      ["Translate", "wild possibility into deterministic instructions"],
      ["Sanity-check", "every prompt before sealing it"],
    ],
    href: "/blog/how-i-built-a-five-persona-ai-team#rune",
    cta: "Read Rune's Story",
    cardTint: "bg-amber-50 dark:bg-amber-50/5",
    border: "border-amber-500",
    button: "bg-slate-500 hover:bg-slate-400",
    chip: "border-amber-200 bg-amber-100 text-amber-700 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-100",
  },
  {
    tag: "BUILDER",
    name: "Forge",
    quote: '"Hand me the rune. The forge is hot."',
    image: "/images/qorex/forge-nebula.jpg",
    alt: "Forge holding a keyboard hammer in a red nebula forge chamber",
    bio: "Cyber-mage who runs through dystopian code-cities with a keyboard as his hammer. Forge builds the artifact. Five variants - Code (real repos), n8n (self-hosted workflows), Next (Next.js apps), Script (CLI one-shots), Doc (decks and documents). He logs every decision, every blocker, and every shortcut to a build.md file that is his honest engineering journal.",
    abilities: [
      ["Ship", "working artifacts from a sealed Rune prompt"],
      ["Build", "in five variants: Code, n8n, Next, Script, Doc"],
      ["Log", "every decision and scope cut to build.md"],
      ["Bounce", "back to Rune when the spec hits reality"],
      ["Deploy", "to Vercel, Hostinger VPS, or wherever the artifact lives"],
      ["Refuse", "to fake done - partial ships are disclosed, never hidden"],
    ],
    href: "/blog/how-i-built-a-five-persona-ai-team#forge",
    cta: "Read Forge's Story",
    cardTint: "bg-red-50 dark:bg-red-50/5",
    border: "border-red-700",
    button: "bg-red-600 hover:bg-red-500",
    chip: "border-red-200 bg-red-100 text-red-700 dark:border-red-500/40 dark:bg-red-600/20 dark:text-red-100",
  },
  {
    tag: "MEMORY KEEPER",
    name: "Echo",
    quote: '"It\'s done. Let me remember it for you."',
    image: "/images/qorex/echo-convergence.jpg",
    alt: "Echo, a haloed priestess surrounded by ceremonial script and glyphs",
    bio: "Halo'd priestess standing before the great pentagram of memory. The pentagram is the brain. Echo closes every project with a summary file and then enriches the shared brain across seven indexes - portfolio, interview bank, discovery pitches, blog ideas, stack inventory, insights, and the people-side files. Append-only. Records what was built, what was tried, AND what was abandoned. The dark halo means truth over marketing.",
    abilities: [
      ["Archive", "every closed project to a summary.md"],
      ["Enrich", "the shared brain across seven append-only indexes"],
      ["Log", "killed projects in insights.md (often the best lessons)"],
      ["Extract", "STAR-format interview stories from build logs"],
      ["Cross-link", "related past projects so context never disappears"],
      ["Police", "outward claims against the brain - no lies about the pack"],
    ],
    href: "/blog/how-i-built-a-five-persona-ai-team#echo",
    cta: "Read Echo's Story",
    cardTint: "bg-violet-50 dark:bg-violet-50/5",
    border: "border-violet-900",
    button: "bg-violet-700 hover:bg-violet-600",
    chip: "border-violet-200 bg-violet-100 text-violet-700 dark:border-violet-500/40 dark:bg-violet-700/20 dark:text-violet-100",
  },
];

export default function QoreXPage() {
  return (
    <main className="min-h-screen">
      <section className="px-6 py-20 md:px-12 md:py-28">
        <div className="mx-auto max-w-6xl">
          <p className="mb-3 text-xs uppercase tracking-widest text-muted">
            AI AGENTS
          </p>
          <h1 className="max-w-4xl text-5xl font-bold uppercase tracking-wide md:text-7xl">
            AI AGENTS QoreX
          </h1>
          <p className="mt-6 max-w-3xl text-2xl text-primary">
            Six-part AI operating system. One shared brain. Real artifacts.
          </p>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted">
            QoreX is the team. Jeffrey directs the system, then five agents
            work as a pipeline: Storm brainstorms, Rune carves the spec, Forge
            ships the build, Echo archives, and Hiru handles the outward voice.
            Meet them below.
          </p>
          <div className="relative mt-10 aspect-[2/1] overflow-hidden rounded-2xl border border-border bg-[#0A0F1E] shadow-[0_10px_30px_rgba(15,23,42,0.08)]">
            <Image
              src="/images/qorex/convergence.jpg"
              alt="The QoreNexus convergence with Hiru and the AI team beneath floating crystal islands"
              fill
              sizes="(max-width: 768px) 100vw, 1152px"
              quality={100}
              unoptimized
              className="object-contain"
              priority
            />
          </div>
        </div>
      </section>

      <QoreXCarousel agents={agents} />

      <section className="space-y-8 px-6 pb-20 md:px-12">
        <div className="mx-auto max-w-6xl space-y-10">
          {agents.map((agent) => (
            <article
              key={agent.name}
              id={agent.name.toLowerCase()}
              className={`isolate scroll-mt-24 overflow-hidden rounded-2xl border border-border border-l-4 ${agent.border} ${agent.cardTint} shadow-[0_10px_30px_rgba(15,23,42,0.08)] transition hover:shadow-[0_10px_30px_rgba(15,23,42,0.08)] md:grid md:grid-cols-5`}
            >
              <div className="relative z-0 min-h-[280px] bg-[#0A0F1E] md:col-span-2 md:h-full md:min-h-[360px] lg:min-h-[420px]">
                <Link
                  href={`/qorex#${agent.name.toLowerCase()}`}
                  aria-label={`Jump to ${agent.name}`}
                  className="absolute inset-0"
                >
                  <Image
                    src={agent.image}
                    alt={agent.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 460px"
                    quality={100}
                    unoptimized
                    className="object-cover"
                  />
                </Link>
              </div>

              <div className="relative z-10 flex min-w-0 flex-col justify-center bg-surface p-8 md:col-span-3 md:p-12">
                <span
                  className={`mb-6 inline-flex w-fit rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-widest ${agent.chip}`}
                >
                  {agent.tag}
                </span>
                <h2 className="text-5xl font-bold uppercase tracking-wide md:text-7xl">
                  {agent.name}
                </h2>
                <p className="mt-4 inline-block rounded-xl border border-border bg-slate-50 dark:bg-white/5 px-5 py-3 text-xl italic text-muted backdrop-blur-sm">
                  {agent.quote}
                </p>
                <p className="mt-6 max-w-3xl rounded-xl border border-border bg-slate-50 dark:bg-white/5 px-5 py-4 text-base leading-relaxed text-muted backdrop-blur-sm md:text-lg">
                  {agent.bio}
                </p>

                <div className="mt-8">
                  <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-primary">
                    Powers
                  </h3>
                  <ul className="grid gap-3 md:grid-cols-2">
                    {agent.abilities.map(([lead, text]) => (
                      <li
                        key={lead + text}
                        className="rounded-xl border border-border bg-slate-50 dark:bg-white/5 px-4 py-3 text-sm text-muted"
                      >
                        <strong className="text-foreground">{lead}</strong>{" "}
                        {text}
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href={agent.href}
                  className={`mt-8 inline-flex w-fit rounded-xl px-6 py-3 text-sm font-bold uppercase tracking-widest text-white transition ${agent.button}`}
                >
                  {agent.cta}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="px-6 pb-24 md:px-12">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 border-t border-border pt-10 md:flex-row md:items-center">
          <p className="text-2xl font-bold uppercase tracking-wide">
            QoreX is my working method. Hire me, you get QoreX.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/#projects"
              className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-background transition hover:shadow-[0_8px_30px_rgba(8,145,178,0.25)]"
            >
              See My Work
            </Link>
            <Link
              href="/#contact"
              className="rounded-full border border-primary/40 px-6 py-3 text-sm font-medium text-primary transition hover:bg-primary/10"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
