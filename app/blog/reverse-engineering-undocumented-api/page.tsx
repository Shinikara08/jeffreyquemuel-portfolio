import type { Metadata } from "next";
import BlogPostLayout from "@/components/BlogPostLayout";

export const metadata: Metadata = {
  title:
    "Reverse-Engineering an Undocumented API with Chrome DevTools — Jeffrey Quemuel",
  description:
    "How I turned a closed marketplace platform into an open one using DevTools, cookies, and a polling state machine in n8n.",
};

export default function Post() {
  return (
    <BlogPostLayout
      date="December 15, 2025"
      readTime="5 min read"
      title="Reverse-Engineering an Undocumented API with Chrome DevTools"
      subtitle="The BIGSELLER story — turning a closed platform into an open one with DevTools, cookies, and a polling state machine."
      tags={["reverse-engineering", "chrome-devtools", "n8n"]}
    >
      <p>
        Some platforms ship comprehensive public APIs. Most don&rsquo;t.
      </p>

      <p>
        When I was asked to automate daily sales report exports for 5,461+
        SKUs on a marketplace platform with zero public API, the official
        answer was: &ldquo;you have to click the export button by hand every
        day.&rdquo; That&rsquo;s 45 minutes of human time, seven days a week,
        forever.
      </p>

      <p>
        The unofficial answer was: the platform&rsquo;s own dashboard uses an
        API. You just have to find it.
      </p>

      <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-wide text-primary pt-6">
        Step 1: Open DevTools, Do the Task Manually
      </h2>
      <p>
        Open Chrome DevTools (<code className="text-primary">F12</code> or{" "}
        <code className="text-primary">Cmd+Option+I</code>), switch to the{" "}
        <strong className="text-foreground">Network</strong> tab. Filter to{" "}
        <strong className="text-foreground">XHR/Fetch</strong>. Now do the
        thing a human would do: click the export button on the dashboard.
      </p>

      <p>
        Watch the Network tab light up. Every request the dashboard fires
        &mdash; that&rsquo;s an API call. Most marketplaces&rsquo; internal
        APIs are just ordinary REST endpoints wrapped in cookie
        authentication.
      </p>

      <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-wide text-primary pt-6">
        Step 2: Find the Money Request
      </h2>
      <p>
        Look for the request that actually triggers the export. Usually
        it&rsquo;s a <code className="text-primary">POST</code> to something
        like <code className="text-primary">/api/export/trigger</code>. The
        response will contain something like:
      </p>

      <pre className="rounded-xl border border-white/10 bg-surface/40 p-4 text-sm overflow-x-auto">
        <code>{`{ "code": 0, "data": { "processKey": "abc123xyz" } }`}</code>
      </pre>

      <p>
        That <code className="text-primary">processKey</code> is the golden
        ticket. It&rsquo;s how you track the export job through the rest of
        the flow.
      </p>

      <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-wide text-primary pt-6">
        Step 3: Copy as cURL
      </h2>
      <p>
        Right-click the request &rarr;{" "}
        <strong className="text-foreground">Copy</strong> &rarr;{" "}
        <strong className="text-foreground">Copy as cURL</strong>. You now have
        the full request including headers, cookies, and body payload. Paste
        into a terminal. If it returns the same{" "}
        <code className="text-primary">processKey</code>, you&rsquo;ve
        reproduced the auth flow.
      </p>

      <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-wide text-primary pt-6">
        Step 4: Build the Polling State Machine
      </h2>
      <p>Most async APIs work the same way:</p>
      <ol className="space-y-2 pl-6 list-decimal">
        <li>POST to trigger the job &rarr; get a processKey.</li>
        <li>Loop: POST to checkProcess with that key until the job is done.</li>
        <li>GET the final URL to download the artifact.</li>
      </ol>

      <p>In n8n, this becomes a loop node with a custom JavaScript Code block that:</p>
      <ul className="space-y-2 pl-6 list-disc">
        <li>Extracts processKey from the trigger response</li>
        <li>Passes it into every iteration via named node reference</li>
        <li>
          Checks <code className="text-primary">code === 1</code> (completion
          in this platform&rsquo;s contract)
        </li>
        <li>Bails out after 40 iterations (5 seconds each = 3:20 max)</li>
      </ul>

      <p>
        Save the downloaded <code className="text-primary">.xlsx</code> to
        Google Drive. Schedule the whole thing for 08:00 daily. Done.
      </p>

      <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-wide text-primary pt-6">
        What to Watch For
      </h2>
      <p>
        <strong className="text-foreground">Cookie expiry.</strong> Session
        cookies expire. Rebuild the auth flow if they refresh on a schedule the
        platform controls.
      </p>
      <p>
        <strong className="text-foreground">Rate limits.</strong> Private APIs
        often don&rsquo;t document them. Monitor for 429s and add exponential
        backoff.
      </p>
      <p>
        <strong className="text-foreground">
          Response shape inconsistency.
        </strong>{" "}
        This particular platform returned{" "}
        <code className="text-primary">code=0</code> for success on
        export-trigger but <code className="text-primary">code=1</code> for
        completion on poll. Read the actual responses in DevTools &mdash;
        don&rsquo;t trust your intuition about what &ldquo;success&rdquo; looks
        like.
      </p>
      <p>
        <strong className="text-foreground">TOS review.</strong>{" "}
        Reverse-engineering someone&rsquo;s private API can violate their terms
        of service. Read the ToS before shipping production. For client work on
        a platform with explicit rate limits, get written approval first.
      </p>

      <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-wide text-primary pt-6">
        When It&rsquo;s Worth It
      </h2>
      <p>
        This approach saves hours of daily manual work for clients where a
        public API doesn&rsquo;t exist. But it&rsquo;s fragile &mdash; a UI
        redesign can break it overnight.
      </p>
      <p>
        Rule of thumb: reverse-engineer when the manual work costs more than a
        monthly rebuild would, or when the data is genuinely locked behind no
        other path. Otherwise, lean on official APIs wherever they exist.
      </p>
      <p>
        For the BIGSELLER workflow? It&rsquo;s been running hands-off since day
        one. 5,461+ SKUs, reported daily. Zero manual clicks.
      </p>
    </BlogPostLayout>
  );
}
