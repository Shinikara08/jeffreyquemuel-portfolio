import { Mail } from "lucide-react";

function BrandIcon({ slug, label }: { slug: string; label: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://cdn.simpleicons.org/${slug}/9CA3AF`}
      alt={label}
      className="h-4 w-4"
    />
  );
}

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/10 px-6 md:px-12 py-12 mt-16">
      <div className="mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <div className="text-sm text-muted">
          Designed &amp; built by{" "}
          <span className="text-foreground font-bold">Jeffrey Quemuel</span>.
          <br className="md:hidden" />{" "}
          <span className="text-muted">
            Running on n8n, Claude AI, and stubborn curiosity.
          </span>
        </div>

        <div className="flex gap-4">
          <a
            href="mailto:jeffrey.v.quemuel@gmail.com"
            aria-label="Email"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-surface/30 text-muted transition hover:border-primary/50 hover:text-primary"
          >
            <Mail className="h-4 w-4" />
          </a>
          <a
            href="https://www.linkedin.com/in/jeffrey-quemuel-060551297/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-surface/30 transition hover:border-primary/50"
          >
            <BrandIcon slug="linkedin" label="LinkedIn" />
          </a>
          <a
            href="https://www.facebook.com/JeffreyQuemuelOfficial"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-surface/30 transition hover:border-primary/50"
          >
            <BrandIcon slug="facebook" label="Facebook" />
          </a>
        </div>

        <div className="text-xs text-muted">
          © 2026 Jeffrey Quemuel ·{" "}
          <span className="text-primary/70">All workflows reserved.</span>
        </div>
      </div>
    </footer>
  );
}
