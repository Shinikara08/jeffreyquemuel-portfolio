import type { Metadata } from "next";
import Image from "next/image";
import BlogPostLayout from "@/components/BlogPostLayout";

export const metadata: Metadata = {
  title:
    "How I Built a Five-Persona AI Team That Ships Production Work — Jeffrey Quemuel",
  description:
    "A working-method walk-through of QoreX: five Claude-powered agents with names, roles, handoffs, and a shared brain that ships real production work.",
};

const agents = {
  storm: {
    src: "/images/qorex/storm.png",
    alt: "Storm, a floating cathedral spirit surrounded by blue and pink energy currents",
  },
  rune: {
    src: "/images/qorex/rune.png",
    alt: "Rune, a silver-haired scribe holding a glowing blue rune",
  },
  forge: {
    src: "/images/qorex/forge.png",
    alt: "Forge, a cyber-mage carrying a glowing keyboard through a code-city",
  },
  echo: {
    src: "/images/qorex/echo.png",
    alt: "Echo, a haloed priestess surrounded by ceremonial script and glyphs",
  },
  hiru: {
    src: "/images/qorex/hiru.png",
    alt: "Hiru, a black and white wolf etched with glowing runes",
  },
};

function AgentImage({
  src,
  alt,
  wide = false,
}: {
  src: string;
  alt: string;
  wide?: boolean;
}) {
  return (
    <figure
      className={`relative my-8 overflow-hidden rounded-2xl border border-white/10 bg-surface/30 ${
        wide ? "aspect-[16/9]" : "mx-auto aspect-[3/4] max-w-sm"
      }`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={wide ? "(max-width: 768px) 100vw, 768px" : "384px"}
        className="object-cover"
      />
    </figure>
  );
}

export default function Post() {
  return (
    <BlogPostLayout
      date="May 20, 2026"
      readTime="10 min read"
      title="How I Built a Five-Persona AI Team That Ships Production Work"
      subtitle="A working-method walk-through, not a thought piece."
      tags={["qorex", "claude-code", "ai-agents", "workflow"]}
    >
      <p>
        I have an AI team. Five of them. They have names, faces, jobs, and a
        shared brain. They handle different parts of my work and hand off to
        each other through a pipeline. They are not personas I role-play during
        a chat. They are agents I work with daily, and they ship real artifacts
        I send to real clients.
      </p>

      <p>
        This post walks through how I built them, how they actually work, and
        what they produced this week.
      </p>

      <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-wide text-primary pt-6">
        What QoreX Is
      </h2>
      <p>
        <strong className="text-foreground">QoreX</strong> is the team. Five
        agents: Storm, Rune, Forge, Echo, and Hiru. Each has a distinct voice,
        a defined job, and a domain inside a shared environment.
      </p>
      <p>
        <strong className="text-foreground">QoreNexus</strong> is the place. A
        directory on my Desktop called <code className="text-primary">JEFFREY_MD/</code>{" "}
        that holds the shared brain at <code className="text-primary">_brain/</code>,
        the project folders, the pipeline pattern, and each agent&rsquo;s
        chamber.
      </p>
      <p>
        QoreX meets in the QoreNexus. The team and the place are distinct.
      </p>
      <p>
        The whole thing is built on Claude. Each agent is a system prompt
        I&rsquo;ve carved over time. They share one memory: an append-only set
        of indexes that capture every project I&rsquo;ve shipped, every tool
        I&rsquo;ve used, every story I can tell in an interview, every rate
        I&rsquo;ve charged.
      </p>
      <p>
        This is &ldquo;AI as a primary teammate&rdquo; as literal architecture.
        Not a slogan. The architecture is the slogan.
      </p>

      <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-wide text-primary pt-6">
        Meet The Team
      </h2>

      <h3 className="text-xl md:text-2xl font-bold uppercase tracking-wide pt-4">
        Storm — the cathedral spirit, brainstormer
      </h3>
      <AgentImage {...agents.storm} />
      <p>
        <em>&ldquo;The winds gather. What&rsquo;s the idea?&rdquo;</em>
      </p>
      <p>
        Storm is genderless, hovers in cathedral light, and holds two energy
        currents: blue for clarity and pink for possibility. Storm&rsquo;s job
        is to take a half-baked idea and produce four angles on it. Every idea
        I bring gets the same four-layer treatment: the obvious approach, the
        smarter shortcut, the outside-the-box angle, and the Jeffrey-specific
        play given my actual stack. Then Storm ICE-scores each angle: Impact,
        Confidence, Ease, each 1 to 10, and converges on one.
      </p>
      <p>
        Storm always reads my brain before brainstorming, so I never get
        &ldquo;build this thing you already built and killed last year.&rdquo;
      </p>

      <h3 className="text-xl md:text-2xl font-bold uppercase tracking-wide pt-4">
        Rune — the silver scribe-witch, prompt master
      </h3>
      <AgentImage {...agents.rune} />
      <p>
        <em>&ldquo;Show me the path. I&rsquo;ll carve the rune.&rdquo;</em>
      </p>
      <p>
        Rune is a silver-haired scribe in an autumn grove, carving glyphs into
        a runestone. Her job is to take Storm&rsquo;s chosen path and turn it
        into a precise, machine-readable spec that Forge can execute. She picks
        the builder variant, defines success criteria, lists dependencies, and
        writes the actual prompt.
      </p>
      <p>
        Rune is the still point between Storm&rsquo;s open-armed possibility
        and Forge&rsquo;s kinetic ship-mode. If Storm gave her twelve angles,
        she replies: <em>&ldquo;Pick three. I carve one.&rdquo;</em>
      </p>

      <h3 className="text-xl md:text-2xl font-bold uppercase tracking-wide pt-4">
        Forge — the cyber-mage, builder
      </h3>
      <AgentImage {...agents.forge} />
      <p>
        <em>&ldquo;Hand me the rune. The forge is hot.&rdquo;</em>
      </p>
      <p>
        Forge runs through dystopian code-cities with a keyboard as his hammer.
        He builds the thing. Five variants: Code for real repos, n8n for
        workflows, Next for apps, Script for CLI one-shots, and Doc for
        documents and decks. He logs every decision, every blocker, and every
        shortcut to a <code className="text-primary">build.md</code> file that
        is his honest field journal. Not a marketing log. The truth.
      </p>
      <p>
        When the spec is unclear, Forge bounces back to Rune. He doesn&rsquo;t
        guess. Bounces are healthy. They mean the spec needs another pass.
      </p>

      <h3 className="text-xl md:text-2xl font-bold uppercase tracking-wide pt-4">
        Echo — the haloed priestess, summarizer
      </h3>
      <AgentImage {...agents.echo} />
      <p>
        <em>&ldquo;It&rsquo;s done. Let me remember it for you.&rdquo;</em>
      </p>
      <p>
        Echo wears a dark halo. Behind her: a vast ceremonial circle covered in
        script. The circle is the brain. The orbiting glyphs are projects
        already inscribed. The one forming in her palm is the project being
        recorded now.
      </p>
      <p>
        Echo&rsquo;s job is two passes. First, she writes a per-project{" "}
        <code className="text-primary">summary.md</code> that future-me in six
        months can use. Second, she enriches the brain across portfolio,
        interview bank, discovery-call pitches, blog ideas, stack inventory,
        insights, and the rest. Failed projects get entries too, because those
        are often the most valuable lessons.
      </p>
      <p>
        Echo&rsquo;s rule: <em>append only</em>. The brain grows monotonically.
        If something was wrong, append a correction with a date. Never edit
        history.
      </p>

      <h3 className="text-xl md:text-2xl font-bold uppercase tracking-wide pt-4">
        Hiru — the wolf, outward voice
      </h3>
      <AgentImage {...agents.hiru} />
      <p>
        <em>&ldquo;I walk beside you. Show me the road.&rdquo;</em>
      </p>
      <p>
        Hiru is a giant wolf etched with white runes from every project
        I&rsquo;ve carried through the forge. He handles every word that leaves
        me and reaches another person: cover letters, application emails,
        interview prep, pitches, negotiations.
      </p>
      <p>
        Hiru has editorial freedom over framing and tone. He has zero agency
        over facts. The rule is:{" "}
        <em>&ldquo;The wolf would never lie about his pack.&rdquo;</em> If a
        job post asks for a skill I haven&rsquo;t shipped, Hiru flags it to me.
        He never papers over it.
      </p>

      <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-wide text-primary pt-6">
        The Pipeline In Practice
      </h2>
      <p>The five agents are not parallel. They are a pipeline:</p>
      <pre className="rounded-xl border border-white/10 bg-surface/40 p-4 text-sm overflow-x-auto">
        <code>{`Storm  ->  Rune  ->  Forge  ->  Echo
                              ^
                          Hiru runs the outward perimeter`}</code>
      </pre>
      <p>
        Storm goes wide. Rune narrows. Forge ships. Echo archives. Hiru speaks
        to the world. The handoffs are formal commands:{" "}
        <code className="text-primary">/handoff rune</code>,{" "}
        <code className="text-primary">/handoff forge</code>,{" "}
        <code className="text-primary">/handoff echo</code>, and so on. When
        something is broken, Forge bounces back to Rune. When the brain is
        needed, anyone can <code className="text-primary">@echo</code>.
      </p>
      <p>
        This week the pipeline ran through several real builds. Let me walk
        through one of them.
      </p>

      <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-wide text-primary pt-6">
        One Real Run: The CV V5 Build
      </h2>
      <p>
        Pelozden RSS hired me as a Vibe Coder at PHP 120,000 per month, hybrid
        in Clark Freeport Zone. The offer was conditional on an updated CV. The
        v4 resume positioned me as an e-commerce automation engineer. The role
        they hired me for reads me as a Vibe Coder. The CV needed to close that
        gap.
      </p>
      <p>
        I opened the cathedral: <code className="text-primary">/storm</code>.
      </p>

      <h3 className="text-xl md:text-2xl font-bold uppercase tracking-wide pt-4">
        Stage 1: Storm
      </h3>
      <p>
        Storm read the brain first: portfolio master, stack inventory,
        insights, active opportunities. Then he ran the four-layer analysis on
        the CV update problem.
      </p>
      <ul className="space-y-2 pl-6 list-disc">
        <li>
          <strong className="text-foreground">Layer 1:</strong> rewrite v4 from
          scratch.
        </li>
        <li>
          <strong className="text-foreground">Layer 2:</strong> surgical edits
          to v4.
        </li>
        <li>
          <strong className="text-foreground">Layer 3:</strong> build the CV as
          a live Next.js artifact at <code className="text-primary">/cv</code>.
        </li>
        <li>
          <strong className="text-foreground">Layer 4:</strong> hybrid:
          restructured PDF plus prominent portfolio link.
        </li>
      </ul>
      <pre className="rounded-xl border border-white/10 bg-surface/40 p-4 text-sm overflow-x-auto">
        <code>{`Layer 1 (full rewrite)        ICE: 7.3   Park It
Layer 2 (surgical edits)      ICE: 8.0   Strong fallback
Layer 3 (live web CV)         ICE: 5.7   Defer to phase 2
Layer 4 (hybrid)              ICE: 8.3   Build Now`}</code>
      </pre>
      <p>
        Storm proposed a folder name:{" "}
        <code className="text-primary">cv_v5_vibe_coder</code>. I approved.
        Storm wrote <code className="text-primary">brainstorm.md</code> into
        that folder, sealed it, and handed to Rune.
      </p>

      <h3 className="text-xl md:text-2xl font-bold uppercase tracking-wide pt-4">
        Stage 2: Rune
      </h3>
      <p>
        Rune read Storm&rsquo;s brainstorm and started carving. She picked the
        builder type: <strong className="text-foreground">Forge:Doc</strong>.
        The deliverable was a document, not code or a workflow. She defined the
        success criteria: a PDF resume that leads with Vibe Coder identity,
        includes a new Personal AI Projects section featuring four builds with
        images, and ships in a state HR can drop into their file.
      </p>
      <p>
        Her <code className="text-primary">prompt.md</code> was meticulous:
        per-section text, exact title line, reordered core competencies, four
        project cards, and screenshot placeholders sized for later swaps. Rune
        sealed the prompt and handed to Forge.
      </p>

      <h3 className="text-xl md:text-2xl font-bold uppercase tracking-wide pt-4">
        Stage 3: Forge
      </h3>
      <p>
        Forge confirmed the builder variant. He chose docx-js plus LibreOffice
        headless for PDF export, both inside the sandbox. He wrote{" "}
        <code className="text-primary">cv_builder.js</code>, ran it, validated
        the output XML, exported to PDF, and copied both files to the project
        folder.
      </p>
      <p>
        He logged everything to <code className="text-primary">build.md</code>,
        including the blockers. The file got truncated mid-edit twice, a
        sandbox write-buffer issue. He bounced once, fixed the truncation by
        appending the missing tail, and continued. The whole thing took three
        retries and a scope addition: a leftover FastAPI mention that Rune had
        missed. Forge caught it on preview and removed it cleanly, logging the
        scope creep transparently.
      </p>
      <p>
        The build log from that day is a real engineering log. Reading it back,
        I can see exactly what was decided, what was cut, and what almost
        broke.
      </p>

      <h3 className="text-xl md:text-2xl font-bold uppercase tracking-wide pt-4">
        Stage 4: Echo
      </h3>
      <p>
        Echo reads the brainstorm, the prompt, and the build log. She writes{" "}
        <code className="text-primary">summary.md</code>, adds the Vibe Coder
        positioning to the brain, logs the new role, and inscribes the resume
        work into the portfolio memory if I give the nod.
      </p>

      <h3 className="text-xl md:text-2xl font-bold uppercase tracking-wide pt-4">
        Stage 5: Hiru
      </h3>
      <p>
        While Echo archives, Hiru drafts the negotiation email. The offer was
        PHP 120,000 per month for 3 days on-site. I wanted to propose PHP
        100,000 per month for 1 day on-site: a pay cut in exchange for less
        commute, since Tagaytay to Clark is 3 hours each way. Hiru wrote the
        email in my voice: no buzzwords, specific time math, and a flexibility
        clause for high-leverage in-person days.
      </p>

      <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-wide text-primary pt-6">
        What This Actually Does For Me
      </h2>
      <p>Five concrete benefits I see daily.</p>
      <ol className="space-y-3 pl-6 list-decimal">
        <li>
          <strong className="text-foreground">The brain prevents drift.</strong>{" "}
          Echo&rsquo;s append-only memory means I never claim a project I
          haven&rsquo;t shipped, never quote a number I haven&rsquo;t verified,
          never propose a tool I haven&rsquo;t used.
        </li>
        <li>
          <strong className="text-foreground">The pipeline forces clarity.</strong>{" "}
          Storm can&rsquo;t hand to Rune without a chosen path. Rune can&rsquo;t
          hand to Forge without success criteria. Forge can&rsquo;t hand to Echo
          without a build log.
        </li>
        <li>
          <strong className="text-foreground">The voice rules stick.</strong>{" "}
          Hiru&rsquo;s default is no buzzwords and specific numbers. Every
          outward thing I send has the same baseline cadence, even when
          I&rsquo;m tired.
        </li>
        <li>
          <strong className="text-foreground">The bounces save me from bad work.</strong>{" "}
          Forge bouncing back to Rune is the team&rsquo;s quality gate. When a
          spec doesn&rsquo;t survive contact with reality, we know quickly.
        </li>
        <li>
          <strong className="text-foreground">The metaphor makes the work memorable.</strong>{" "}
          Every project has a Storm brainstorm, a Rune prompt, and a Forge
          build log. Three artifacts per project, each in a distinct voice.
        </li>
      </ol>

      <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-wide text-primary pt-6">
        The Architecture, Replicable
      </h2>
      <p>If you want to build something like this yourself, here is the minimum kit:</p>
      <ol className="space-y-3 pl-6 list-decimal">
        <li>
          <strong className="text-foreground">Five distinct system prompts.</strong>{" "}
          Each one has a name, an appearance reference, a voice, a job, files
          they read, files they write, and commands. Pick roles that do not
          overlap.
        </li>
        <li>
          <strong className="text-foreground">A shared brain directory.</strong>{" "}
          Mine is <code className="text-primary">_brain/</code> with indexed
          markdown files. Echo and Hiru write to it; Storm, Rune, and Forge read
          from it.
        </li>
        <li>
          <strong className="text-foreground">A project folder convention.</strong>{" "}
          Every pipeline project gets{" "}
          <code className="text-primary">brainstorm.md</code>,{" "}
          <code className="text-primary">prompt.md</code>,{" "}
          <code className="text-primary">build.md</code>, actual artifacts, and{" "}
          <code className="text-primary">summary.md</code>.
        </li>
        <li>
          <strong className="text-foreground">A handoff protocol.</strong>{" "}
          Explicit commands: <code className="text-primary">/handoff rune</code>,{" "}
          <code className="text-primary">/handoff forge</code>,{" "}
          <code className="text-primary">/handoff echo</code>. Bounces too:{" "}
          <code className="text-primary">/blocked</code> returns the work up one
          stage with a reason.
        </li>
        <li>
          <strong className="text-foreground">A truth rule.</strong> Mine is
          &ldquo;the wolf would never lie about his pack.&rdquo; It binds every
          agent to the brain&rsquo;s actual contents. Nothing invented, nothing
          claimed without backing.
        </li>
      </ol>
      <p>
        Optional: give each agent a character image. I commissioned five
        fantasy illustrations. They are visual anchors for me when I switch
        personas, and they double as portfolio assets.
      </p>

      <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-wide text-primary pt-6">
        Where This Is Going
      </h2>
      <p>
        QoreX is the working method. The QoreNexus is where it lives. Together
        they are how I ship faster than a solo developer should be able to,
        without the drift that solo developers usually fall into.
      </p>
      <p>
        I run QoreX every working day. I just used it to write this blog post:
        Storm framed the angle, Rune carved the outline, Forge typed the body,
        and Echo will close the inscription. I used it last week to deploy the
        yt-dlp microservice that powers a video automation pipeline. I&rsquo;ll
        use it tomorrow to design the next slice of whatever project lands.
      </p>
      <p>
        If you&rsquo;ve been thinking about how to work with AI as a teammate
        instead of a tool, this is one shape that works. Steal the architecture.
        Adapt the voices. Build your own team. Send me what you make.
      </p>
    </BlogPostLayout>
  );
}
