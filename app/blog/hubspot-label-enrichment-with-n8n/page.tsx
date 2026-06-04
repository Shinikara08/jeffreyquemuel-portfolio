import type { Metadata } from "next";
import BlogImage from "@/components/BlogImage";
import BlogPostLayout from "@/components/BlogPostLayout";

export const metadata: Metadata = {
  title:
    "HubSpot Label Enrichment with n8n, SerpAPI, and Claude - Jeffrey Quemuel",
  description:
    "How I'm wiring deep web search and an AI agent to auto-populate music labels into hundreds of HubSpot artist contacts. Architecture v2, prompt-engineering in progress.",
};

export default function Post() {
  return (
    <BlogPostLayout
      date="May 27, 2026"
      readTime="7 min read"
      title="HubSpot Label Enrichment with n8n, SerpAPI, and Claude"
      subtitle="Stop manually researching artist labels. Let the workflow do it."
      tags={["n8n", "hubspot", "claude", "ai-enrichment"]}
    >
      <p>
        Liberty Music PR manages hundreds of artist contacts in HubSpot. Each
        contact is an artist or a band. The <em>Company Name</em> column,
        which is supposed to hold the artist&rsquo;s music label, was empty or
        wrong across most of the database. Researching every artist by hand
        was burning hours every week, and the field still drifted as the
        roster changed.
      </p>
      <p>
        The question wasn&rsquo;t &ldquo;how do we update HubSpot.&rdquo; The
        question was: <em>what if a workflow did the research for us</em>,
        with enough safety that it never poisoned the data?
      </p>

      <BlogImage
        src="/images/projects/liberty_1.png"
        alt="n8n workflow canvas for Liberty Music PR HubSpot label enrichment: Run Enrichment trigger, Get List Memberships, Aggregate Member IDs, Batch Read Contacts, Prepare Contacts, Loop Over Contacts, Google AI mode search, AI Agent with Anthropic Sonnet primary and Haiku fallback, Structured Output Parser, Update Contact HTTP PATCH, Wait 12 Seconds, and Calculate Run Cost with Append or update row in sheet"
        caption="The full workflow - n8n canvas with HubSpot read/write, SerpAPI search, Claude agent, and cost logging"
      />

      <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-wide text-primary pt-6">
        The shape of the workflow
      </h2>
      <p>
        End to end, it&rsquo;s a linear pipeline with one inner loop and one
        outer pacing wait. From a single &ldquo;Run Enrichment&rdquo; trigger:
      </p>
      <ol className="list-decimal list-inside space-y-1 text-muted pl-2">
        <li>
          <strong className="text-foreground">Get List Memberships</strong>{" "}
          from HubSpot - which artist contacts are in scope this run.
        </li>
        <li>
          <strong className="text-foreground">Aggregate Member IDs</strong>{" "}
          then <strong className="text-foreground">Batch Read Contacts</strong>{" "}
          - pull the full contact records via the HubSpot Private App API in
          a single batch instead of N round trips.
        </li>
        <li>
          <strong className="text-foreground">Prepare Contacts</strong> -
          normalize the records into a clean list the loop can chew on.
        </li>
        <li>
          <strong className="text-foreground">Loop Over Contacts</strong> -
          for each artist:
        </li>
        <ul className="list-disc list-inside space-y-1 pl-6">
          <li>
            <strong className="text-foreground">Google AI Mode search</strong>{" "}
            via SerpAPI on the artist&rsquo;s email, name, and known
            metadata. AI Mode returns a synthesized answer with sources.
          </li>
          <li>
            <strong className="text-foreground">AI Agent</strong> with a
            structured output parser. Primary model:{" "}
            <code className="text-primary">claude-sonnet</code>. Fallback:{" "}
            <code className="text-primary">claude-haiku</code>.
          </li>
          <li>
            <strong className="text-foreground">Update Contact</strong> via
            HubSpot HTTP <code className="text-primary">PATCH</code> -
            write the resolved label into the{" "}
            <code className="text-primary">company</code> field.
          </li>
          <li>
            <strong className="text-foreground">Wait 12 seconds</strong> -
            per-contact throttle so SerpAPI and Anthropic rate limits stay
            happy.
          </li>
        </ul>
        <li>
          <strong className="text-foreground">3-minute pacing wait</strong>{" "}
          between batches at the outer loop level. Safety margin for
          long-running enrichments without tripping HubSpot daily quotas.
        </li>
      </ol>

      <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-wide text-primary pt-6">
        Why two Claude models
      </h2>
      <p>
        Sonnet is the primary because it reasons better over ambiguous search
        results. Music labels are messy - artists drop, switch, get acquired,
        sign side-deals. A weaker model confidently writes
        &ldquo;Independent&rdquo; when the truth is &ldquo;Run On Records via
        a one-off licensing deal,&rdquo; which is technically wrong but
        plausible enough to slip through review.
      </p>
      <p>
        Haiku is the fallback specifically for when Sonnet rate-limits or
        errors. Haiku is faster and cheaper, so a temporary degraded mode is
        still a working pipeline. The trade is documented in the workflow:
        if you see a run with mostly Haiku rows in the cost log, you know
        the upstream had a hiccup and you can re-run those rows later with
        Sonnet for verification.
      </p>

      <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-wide text-primary pt-6">
        The anti-contamination rule
      </h2>
      <p>
        The structured output parser has a hard rule: when the search
        results are ambiguous or the agent isn&rsquo;t confident, write{" "}
        <code className="text-primary">&quot;None&quot;</code> instead of
        guessing.
      </p>
      <blockquote className="border-l-4 border-primary/60 bg-slate-50 dark:bg-white/5 pl-4 py-3 italic text-muted">
        Better to leave a field empty than poison the database with a wrong
        label that someone later treats as ground truth.
      </blockquote>
      <p>
        This is the rule I&rsquo;ve come back to in every enrichment build:
        the cost of a false-confident answer is much higher than the cost of
        a blank. A blank is honest about what we don&rsquo;t know. A wrong
        label is a quiet lie that other workflows will start building on.
      </p>

      <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-wide text-primary pt-6">
        Cost tracking from day one
      </h2>
      <p>
        Every enrichment appends a row to a Google Sheet via the{" "}
        <code className="text-primary">Append or update row in sheet</code>{" "}
        node. The row carries: contact ID, input tokens, output tokens,
        model used, computed dollar cost, and the resolved label (or{" "}
        <code className="text-primary">None</code>).
      </p>
      <p>
        I built this in from run one, not as an afterthought. Reason:
        without cost visibility, you find out three months in that the
        workflow cost more than the manual research would have, and the
        argument for keeping it gets harder. With visibility, you have
        receipts. You can argue: <em>per-contact enrichment costs $0.03 of
        Claude tokens and replaces 4 minutes of human research at any rate
        you want to assign that time</em>.
      </p>

      <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-wide text-primary pt-6">
        Status, honestly
      </h2>
      <p>
        Architecture v2 is wired in n8n. All nodes are connected. The
        Anthropic Chat Model nodes (Sonnet and Haiku), the SerpAPI Google
        AI Mode search, the HubSpot Batch Read and PATCH calls, the cost
        log to Google Sheets - all present, all linked.
      </p>
      <p>
        What&rsquo;s in flight: prompt-engineering iterations on the AI
        agent (this is where the anti-contamination behavior gets sharpened
        in practice), and the full-catalog rollout for Liberty Music PR.
      </p>
      <p>
        This isn&rsquo;t a shipped-to-production post. It&rsquo;s an
        architecture-and-shape post. When the rollout completes with real
        numbers - how many labels resolved, how many{" "}
        <code className="text-primary">None</code> rows, dollar cost across
        the catalog - I&rsquo;ll write the production-numbers follow-up.
      </p>

      <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-wide text-primary pt-6">
        The lesson worth repeating
      </h2>
      <p>
        The workflow IS the documentation. Every node is named for what it
        does in plain English. The Sticky Note in the canvas explains the
        anti-contamination rule and the dual-model strategy to the next
        engineer who opens the file. The cost log is the audit trail.
      </p>
      <p>
        When this kind of work is built right, the next person opening the
        canvas understands it without reading a Confluence page that was
        last updated six months ago. That&rsquo;s not a side effect of good
        engineering. That&rsquo;s the point.
      </p>
    </BlogPostLayout>
  );
}
