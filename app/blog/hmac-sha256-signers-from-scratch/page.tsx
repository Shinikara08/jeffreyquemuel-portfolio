import type { Metadata } from "next";
import BlogPostLayout from "@/components/BlogPostLayout";

export const metadata: Metadata = {
  title:
    "Writing HMAC/SHA256 Signers from Scratch for Shopee and Lazada — Jeffrey Quemuel",
  description:
    "Practical guide to writing request signers for marketplace Open APIs. What the docs leave out.",
};

export default function Post() {
  return (
    <BlogPostLayout
      date="February 08, 2026"
      readTime="6 min read"
      title="Writing HMAC/SHA256 Signers from Scratch for Shopee and Lazada"
      subtitle="What the marketplace docs leave out. Practical guide with code snippets that actually work in production."
      tags={["hmac", "shopee-api", "lazada-api", "authentication"]}
    >
      <p>
        Every time I integrate a new marketplace&rsquo;s Open API, the first
        real engineering task is the request signer. Shopee and Lazada both use
        HMAC/SHA256 &mdash; but the exact sequence of &ldquo;what to
        sign&rdquo; differs, and the docs leave out the parts that actually
        break you.
      </p>
      <p>Here&rsquo;s what I learned writing both from scratch in JavaScript.</p>

      <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-wide text-primary pt-6">
        Why HMAC/SHA256 Signing Exists
      </h2>
      <p>
        Public marketplace APIs need to prove three things about every incoming
        request:
      </p>
      <ol className="space-y-2 pl-6 list-decimal">
        <li>It came from an authorized partner (authentication)</li>
        <li>It hasn&rsquo;t been tampered with in transit (integrity)</li>
        <li>It&rsquo;s fresh, not a replay (freshness via timestamp)</li>
      </ol>
      <p>
        HMAC (Hash-based Message Authentication Code) with SHA256 solves all
        three. You combine your partner secret with a deterministic string of
        request components, hash the result, and send the hash as a{" "}
        <code className="text-primary">sign</code> parameter. The server does
        the same math and rejects anything that doesn&rsquo;t match.
      </p>

      <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-wide text-primary pt-6">
        Shopee&rsquo;s Signing Algorithm
      </h2>
      <p>
        Shopee signs:{" "}
        <code className="text-primary">
          partner_id + path + timestamp + access_token + shop_id
        </code>
      </p>

      <pre className="rounded-xl border border-white/10 bg-surface/40 p-4 text-sm overflow-x-auto">
        <code>{`import crypto from "node:crypto";

function signShopeeRequest({
  partnerId, path, accessToken, shopId, partnerKey
}) {
  const timestamp = Math.floor(Date.now() / 1000);
  const baseString = \`\${partnerId}\${path}\${timestamp}\${accessToken}\${shopId}\`;
  const sign = crypto
    .createHmac("sha256", partnerKey)
    .update(baseString)
    .digest("hex");
  return { timestamp, sign };
}`}</code>
      </pre>

      <p>Gotchas:</p>
      <ul className="space-y-2 pl-6 list-disc">
        <li>
          <code className="text-primary">timestamp</code> is in{" "}
          <strong className="text-foreground">seconds</strong>, not milliseconds
          (JavaScript&rsquo;s Date.now() returns ms)
        </li>
        <li>
          <code className="text-primary">path</code> is the API path only
          &mdash; not the full URL, not the query string
        </li>
        <li>The partner key is the HMAC key, not part of the base string</li>
      </ul>

      <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-wide text-primary pt-6">
        Lazada&rsquo;s Signing Algorithm
      </h2>
      <p>
        Lazada is trickier. It signs all request parameters sorted
        alphabetically, joined as key-value pairs.
      </p>

      <pre className="rounded-xl border border-white/10 bg-surface/40 p-4 text-sm overflow-x-auto">
        <code>{`function signLazadaRequest({ params, path, appSecret }) {
  const timestamp = Date.now(); // ms here, not seconds
  const signed = { ...params, timestamp, sign_method: "sha256" };

  const sortedKeys = Object.keys(signed).sort();
  const baseString = path + sortedKeys
    .map((k) => \`\${k}\${signed[k]}\`)
    .join("");

  const sign = crypto
    .createHmac("sha256", appSecret)
    .update(baseString)
    .digest("hex")
    .toUpperCase(); // Lazada wants uppercase hex

  return { ...signed, sign };
}`}</code>
      </pre>

      <p>Gotchas:</p>
      <ul className="space-y-2 pl-6 list-disc">
        <li>
          Timestamp is in{" "}
          <strong className="text-foreground">milliseconds</strong> (unlike
          Shopee)
        </li>
        <li>
          Parameters must be sorted alphabetically before concatenation
        </li>
        <li>
          Hash output must be{" "}
          <strong className="text-foreground">UPPERCASE</strong> hex (Shopee is
          lowercase)
        </li>
        <li>
          Don&rsquo;t include <code className="text-primary">sign</code> itself
          when building the base string
        </li>
      </ul>

      <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-wide text-primary pt-6">
        Common Pitfalls Both APIs Share
      </h2>
      <p>
        <strong className="text-foreground">Timestamp drift.</strong> If your
        server clock is off by more than ~5 minutes from the
        marketplace&rsquo;s, every signed request fails with a vague
        &ldquo;invalid sign&rdquo; error. Use NTP. Never trust a Docker
        container&rsquo;s time without syncing.
      </p>
      <p>
        <strong className="text-foreground">URL encoding.</strong>{" "}
        Don&rsquo;t double-encode parameters. If a value has a space,
        URL-encode it once in the HTTP request, but use the raw value in the
        signing base string. Most &ldquo;invalid sign&rdquo; errors I&rsquo;ve
        debugged were encoding mismatches.
      </p>
      <p>
        <strong className="text-foreground">Character encoding.</strong> Use
        UTF-8 everywhere. If a seller name has Thai or Chinese characters,
        Node&rsquo;s default handles it &mdash; but a system with a different
        default will give you silent hash mismatches.
      </p>
      <p>
        <strong className="text-foreground">Key rotation.</strong> Partner keys
        can rotate. Keep them in environment variables, never hard-coded. Store
        the rotation date so you can audit when signing started failing.
      </p>

      <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-wide text-primary pt-6">
        The Debug Loop
      </h2>
      <p>When signs fail, compare byte-for-byte:</p>
      <ol className="space-y-2 pl-6 list-decimal">
        <li>Log the exact base string your code generates</li>
        <li>Log the resulting hex hash</li>
        <li>Compare with the marketplace&rsquo;s docs example for identical inputs</li>
        <li>If no docs example, compare against their official SDK&rsquo;s output</li>
      </ol>
      <p>
        Usually the bug is one of: wrong sort order, wrong timestamp unit,
        wrong case on the hex output, or an extra whitespace character sneaking
        into a param.
      </p>

      <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-wide text-primary pt-6">
        The Payoff
      </h2>
      <p>
        Once both signers work, integrating any endpoint becomes a 10-minute
        task. Order sync, product catalog, revenue aggregation &mdash; they all
        reuse the same signer. That&rsquo;s what lets one person ship
        production integrations across three markets simultaneously.
      </p>
    </BlogPostLayout>
  );
}
