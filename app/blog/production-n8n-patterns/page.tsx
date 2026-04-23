import type { Metadata } from "next";
import BlogPostLayout from "@/components/BlogPostLayout";

export const metadata: Metadata = {
  title:
    "Four Patterns I Use in Every Production n8n Workflow — Jeffrey Quemuel",
  description:
    "Idempotency keys, exponential backoff, state persistence, dev/prod separation. The difference between workflows that run and workflows that survive.",
};

export default function Post() {
  return (
    <BlogPostLayout
      date="April 24, 2026"
      readTime="5 min read"
      title="Four Patterns I Use in Every Production n8n Workflow"
      subtitle="The difference between a workflow that runs and one that survives."
      tags={["n8n", "production", "patterns"]}
    >
      <p>
        A workflow that runs is not the same as a workflow that survives.
        Anyone can build the happy path. Production is everything else.
      </p>
      <p>
        After diagnosing 10+ production-blocking n8n issues and shipping
        automations that handle 3.4M+ orders hands-off, here are the four
        patterns that show up in every workflow I ship.
      </p>

      <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-wide text-primary pt-6">
        Pattern 1: Idempotency Keys
      </h2>
      <p>
        If the same workflow runs twice on the same input, it must produce the
        same output without side effects. That&rsquo;s idempotency &mdash; and
        if you don&rsquo;t design for it, reruns will duplicate orders,
        double-count revenue, and send the same Slack message 47 times after a
        retry storm.
      </p>
      <p>
        The simplest implementation: every action that writes somewhere
        generates a deterministic key from its input, then checks &ldquo;have I
        done this before?&rdquo; before doing it.
      </p>

      <pre className="rounded-xl border border-white/10 bg-surface/40 p-4 text-sm overflow-x-auto">
        <code>{`// In a Code node before a write
const key = \`\${order.id}-\${order.version}-\${workflow.run.date}\`;
const alreadyDone = await getFromCache(key);
if (alreadyDone) return { skipped: true };
await writeToBigQuery(order);
await putInCache(key);`}</code>
      </pre>

      <p>
        For high-volume workflows, use BigQuery&rsquo;s{" "}
        <code className="text-primary">MERGE</code> statement with a
        deduplication key. For low-volume, a Google Sheets lookup column works
        fine.
      </p>

      <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-wide text-primary pt-6">
        Pattern 2: Exponential Backoff Retry
      </h2>
      <p>
        Rate limits happen. Temporary network blips happen. When they do, the
        wrong answer is to retry immediately &mdash; you&rsquo;ll hit the same
        wall and compound the problem.
      </p>
      <p>
        The right answer: retry with delays that grow exponentially
        (1s, 2s, 4s, 8s...) until you succeed or hit a hard cap.
      </p>
      <p>
        n8n&rsquo;s HTTP Request node has built-in retry, but it&rsquo;s
        linear. For marketplace APIs with aggressive rate limits, I wrap
        requests in a Code node:
      </p>

      <pre className="rounded-xl border border-white/10 bg-surface/40 p-4 text-sm overflow-x-auto">
        <code>{`async function callWithBackoff(fn, maxAttempts = 5) {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt === maxAttempts - 1) throw err;
      const delayMs =
        Math.pow(2, attempt) * 1000 + Math.random() * 500;
      await new Promise(r => setTimeout(r, delayMs));
    }
  }
}`}</code>
      </pre>

      <p>
        The <code className="text-primary">Math.random() * 500</code> is jitter
        &mdash; prevents thundering herd when many workflows retry
        simultaneously.
      </p>

      <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-wide text-primary pt-6">
        Pattern 3: Cross-Iteration State Persistence
      </h2>
      <p>
        In loops, every iteration gets its own scope. If you need data from
        iteration 1 in iteration 47, you can&rsquo;t just rely on variable
        shadowing &mdash; it won&rsquo;t survive the loop context.
      </p>
      <p>
        n8n&rsquo;s answer: named node references. Give your early nodes
        meaningful names (<code className="text-primary">Get Access Token</code>
        , <code className="text-primary">Extract Process Key</code>), then
        reference them anywhere in the workflow by name:
      </p>

      <pre className="rounded-xl border border-white/10 bg-surface/40 p-4 text-sm overflow-x-auto">
        <code>{`// In any later Code node, even inside a loop
const processKey = $node["Extract Process Key"].json.processKey;`}</code>
      </pre>

      <p>
        This became the backbone of the BIGSELLER polling state machine. The{" "}
        <code className="text-primary">processKey</code> from iteration 0 gets
        referenced in every one of the next 40 iterations. No manual passing
        through loop variables. No state loss.
      </p>

      <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-wide text-primary pt-6">
        Pattern 4: Dev/Prod Environment Separation
      </h2>
      <p>
        Running automations on production customer data while debugging is how
        you accidentally email 20,000 people &ldquo;Sorry, test.&rdquo;
      </p>
      <p>
        Every workflow I ship has two copies: one wired to dev credentials + a
        dev Google Sheet + a test Slack channel, one wired to production. They
        share the same logic, but different environment variables.
      </p>
      <p>
        n8n makes this easy with credential profiles. Create two:{" "}
        <code className="text-primary">Shopee-Dev</code> and{" "}
        <code className="text-primary">Shopee-Prod</code>. Swap them in the
        workflow via a single dropdown. When you promote a change, duplicate
        the dev workflow, remap credentials to prod, activate.
      </p>
      <p>
        For extra safety: make the prod workflow sleep the first time
        it&rsquo;s activated, then send a Slack message to confirm before it
        runs. That 30-second hesitation has saved me from shipping broken logic
        twice.
      </p>

      <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-wide text-primary pt-6">
        The Meta-Pattern
      </h2>
      <p>
        All four of these share one idea:{" "}
        <strong className="text-foreground">
          design for the moment you&rsquo;re not watching.
        </strong>{" "}
        The 3 AM retry loop. The rate-limit spike during a marketplace sale.
        The silent partial failure that would compound for weeks before anyone
        noticed.
      </p>
      <p>
        A workflow in production gets tested by reality, not by you. These
        four patterns are what separate automations that run from ones that
        survive.
      </p>
    </BlogPostLayout>
  );
}
