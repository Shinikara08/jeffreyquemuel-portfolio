import type { Metadata } from "next";
import BlogPostLayout from "@/components/BlogPostLayout";

export const metadata: Metadata = {
  title:
    "Direct-Context RAG: When You Don't Need a Vector Database — Jeffrey Quemuel",
  description:
    "Building the AutomaQue CRM chatbot taught me that for personal-scale data, skipping embeddings and passing the whole dataset as context is the right call. Here's the math and the implementation.",
};

export default function Post() {
  return (
    <BlogPostLayout
      date="May 07, 2026"
      readTime="6 min read"
      title="Direct-Context RAG: When You Don't Need a Vector Database"
      subtitle="Building the AutomaQue CRM chatbot, I skipped embeddings entirely. Here's the math, the implementation, and when to upgrade."
      tags={["rag", "claude-api", "bigquery", "architecture"]}
    >
      <p>
        I built a CRM. I wanted users to ask it questions in plain English
        &mdash; <em>which deals are most likely to close this month? who
        haven&rsquo;t I followed up with in 30+ days?</em> &mdash; and get real
        answers grounded in their actual data.
      </p>

      <p>
        The default 2026 answer is RAG with embeddings: chunk the data, embed
        the chunks, store them in a vector database, embed the query, retrieve
        the top-K matches, stuff them into the prompt. Pinecone or pgvector or
        Weaviate or BigQuery vector search.
      </p>

      <p>I didn&rsquo;t do any of that.</p>

      <p>
        For AutomaQue CRM, I built a chatbot that snapshots the entire
        database, passes it as a single chunk of context to Claude, and lets
        the model do the &ldquo;retrieval&rdquo; itself. No embeddings. No
        vector store. No retrieval pipeline. Here&rsquo;s why &mdash; and when
        you should make the same call.
      </p>

      <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-wide text-primary pt-6">
        Why Everyone Reaches for Vectors First
      </h2>
      <p>
        The vector-database playbook came from a real constraint: in 2022, GPT
        had a 4K context window. If your knowledge base was bigger than four
        thousand tokens (it always was), you had no choice. Embed, chunk,
        retrieve.
      </p>

      <p>
        That constraint is gone. Claude Sonnet 4.5 has a 200K context window.
        Claude Opus 4.7 with the 1M extension has a million. The question
        stopped being &ldquo;how do I fit my data into the prompt?&rdquo; and
        became &ldquo;do I need to fit everything, or just the relevant
        slice?&rdquo;
      </p>

      <p>
        For most personal-scale use cases &mdash; a CRM, a personal knowledge
        base, a small docs site &mdash;{" "}
        <strong className="text-foreground">
          the entire dataset fits comfortably in context.
        </strong>{" "}
        And when it does, the embedding pipeline is dead weight.
      </p>

      <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-wide text-primary pt-6">
        The Math: How Big Is Your Data, Really?
      </h2>
      <p>
        Run the numbers before you reach for a vector store. Rough conversion:
        1 token &asymp; 4 characters of English text. So 200K tokens is roughly
        800K characters &mdash; about 130,000 English words.
      </p>

      <p>For a CRM, that&rsquo;s comfortably:</p>
      <ul className="space-y-2 pl-6 list-disc">
        <li>5,000 contacts at ~30 words each (name, company, tags, notes)</li>
        <li>1,000 deals at ~20 words each</li>
        <li>10,000 activities at ~15 words each</li>
        <li>A few hundred notes at a paragraph each</li>
      </ul>

      <p>
        That&rsquo;s a fully-loaded personal CRM, dumped flat as JSON, sitting
        well under 100K tokens. With Claude Sonnet 4.5&rsquo;s 200K window you
        have headroom to spare.
      </p>

      <p>
        Don&rsquo;t guess at this &mdash; measure it. The Anthropic SDK exposes
        a token-counting endpoint. Run it against a snapshot of your real data
        before deciding you need a retrieval pipeline.
      </p>

      <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-wide text-primary pt-6">
        The Implementation
      </h2>
      <p>
        The chat endpoint is a single API route. On every turn, it queries
        BigQuery for a fresh snapshot of contacts, deals, activities, and
        notes, formats them as JSON, and sends them to Claude as a system
        prompt with prompt caching enabled. The user&rsquo;s message becomes
        the user prompt.
      </p>

      <pre className="rounded-xl border border-white/10 bg-surface/40 p-4 text-sm overflow-x-auto">
        <code>{`// /api/chat — pseudocode
export async function POST(req: Request) {
  const { messages } = await req.json();
  const snapshot = await getCachedSnapshot(); // 60s server-side cache

  const stream = await anthropic.messages.stream({
    model: "claude-sonnet-4-5",
    max_tokens: 2048,
    system: [{
      type: "text",
      text: \`You are a CRM assistant. Here is the full CRM state as JSON:
\${JSON.stringify(snapshot)}
Answer questions using only this data. Cite specific records.\`,
      cache_control: { type: "ephemeral" },
    }],
    messages,
  });

  return new Response(stream.toReadableStream());
}`}</code>
      </pre>

      <p>
        The 60-second server-side cache on the snapshot is doing a lot of
        work. Within a single chat session, the user typically sends 3-5
        questions in quick succession; we hit BigQuery once and serve the
        rest from memory. Anthropic&rsquo;s prompt cache then handles the
        downstream cost &mdash; the same JSON blob gets cached for repeat
        calls so subsequent turns pay roughly 10% of the input cost of the
        first.
      </p>

      <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-wide text-primary pt-6">
        What You Give Up
      </h2>
      <p>
        Two things, both real:
      </p>

      <p>
        <strong className="text-foreground">Cost per call.</strong> Even with
        caching, you&rsquo;re paying to ship the whole dataset through the
        model on every cache miss. For a CRM with maybe 50 chat sessions a
        day, this is rounding-error money. For a system serving 50,000 users a
        day, it would dominate.
      </p>

      <p>
        <strong className="text-foreground">Hard latency floor.</strong>{" "}
        Sending 80K tokens of context takes longer than sending 2K. First
        token might land in 1-2 seconds instead of 200ms. For a chat UI with
        streaming, this is fine. For a sub-second autocomplete, it&rsquo;s
        not.
      </p>

      <p>
        Notice what you <em>don&rsquo;t</em> give up: retrieval quality. The
        model has the whole dataset; it can&rsquo;t miss the relevant record
        because it doesn&rsquo;t need to retrieve. This eliminates an entire
        class of RAG bug &mdash; queries that fail because the right chunk
        didn&rsquo;t make it into the top-K.
      </p>

      <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-wide text-primary pt-6">
        When to Upgrade to Vectors
      </h2>
      <p>
        Three triggers, and only three:
      </p>
      <ol className="space-y-2 pl-6 list-decimal">
        <li>
          <strong className="text-foreground">Data outgrows context.</strong>{" "}
          The day your snapshot exceeds ~150K tokens (leaving headroom for
          conversation), it&rsquo;s time. Not before.
        </li>
        <li>
          <strong className="text-foreground">Latency stops being
          acceptable.</strong> If first-token time is breaking the UX, retrieve
          a slice instead of shipping everything.
        </li>
        <li>
          <strong className="text-foreground">Cost stops penciling.</strong> If
          per-conversation cost crosses your unit-economics line, retrieval
          gets you back under it.
        </li>
      </ol>

      <p>
        Critically: in all three cases, the migration is a backend change. The
        chat endpoint signature stays the same. The frontend doesn&rsquo;t
        know the difference. You&rsquo;ve bought yourself a clean upgrade path
        without paying for it on day one.
      </p>

      <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-wide text-primary pt-6">
        The Generalization
      </h2>
      <p>
        This isn&rsquo;t really a post about RAG. It&rsquo;s a post about
        defaults aging out.{" "}
        <strong className="text-foreground">
          Best practices that were forced by 2022&rsquo;s constraints aren&rsquo;t
          best practices in 2026.
        </strong>{" "}
        Vector databases were a brilliant workaround for tiny context windows.
        Tiny context windows are now history.
      </p>

      <p>
        The lesson generalizes. Every time you reach for a complex pattern,
        ask the simpler question first: <em>does the constraint that justified
        this pattern still exist?</em> Sometimes it does. Often, it
        doesn&rsquo;t, and you&rsquo;ve been carrying complexity for a problem
        the platform already solved.
      </p>

      <p>
        For AutomaQue CRM, skipping the vector store removed an entire
        infrastructure layer, simplified the chat endpoint to under 30 lines,
        and made the whole system easier to reason about. The day my data
        outgrows the context window, I&rsquo;ll add embeddings. Until then,
        the simpler system wins.
      </p>
    </BlogPostLayout>
  );
}
