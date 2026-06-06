import type { Metadata } from "next";
import BlogImage from "@/components/BlogImage";
import BlogPostLayout from "@/components/BlogPostLayout";

export const metadata: Metadata = {
  title: "Building Qeys: A Keyboard That Watches You Type - Jeffrey Quemuel",
  description:
    "How I built a no-look touch-typing trainer that floats an on-screen keyboard over any app, mirrors your real typing in real time, and shipped to a public release in a single session.",
};

export default function Post() {
  return (
    <BlogPostLayout
      date="June 06, 2026"
      readTime="6 min read"
      title="Building Qeys: A Keyboard That Watches You Type"
      subtitle="A floating overlay that mirrors your real typing in real time, and the two things that surprised me shipping it in one session."
      tags={["python", "tkinter", "desktop", "build-in-public", "qollab"]}
    >
      <p>
        I never learned to touch type properly. I&rsquo;m fast, but I look down.
        Every typing tutor I tried had the same flaw: they make you type into{" "}
        <em>their</em> box. The second I glance at my hands to find a key, the
        muscle-memory loop I&rsquo;m trying to build snaps.
      </p>
      <p>
        So I built the opposite. Qeys is a small Windows app that floats a
        semi-transparent QWERTY keyboard on top of everything else on screen.
        You keep working in your real apps. The overlay mirrors your real typing
        in real time: press a key anywhere and it lights up amber, then fades
        slowly so you can see the trail of what your fingers just did. Your eyes
        stay at screen level, where your work is, instead of dropping to the
        keyboard.
      </p>
      <p>
        This is the build-in-public story of how it came together in a single
        session, and the two things that surprised me.
      </p>

      <BlogImage
        src="/images/projects/qeys.png"
        alt="Qeys floating semi-transparent QWERTY keyboard overlay mirroring live typing with amber key highlights"
        caption="Qeys floats over any app and mirrors your typing — eyes stay at screen level"
      />

      <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-wide text-primary pt-6">
        The shape of the thing
      </h2>
      <p>The requirements settled quickly:</p>
      <ul className="list-disc space-y-2 pl-6 text-muted">
        <li>
          Always on top, borderless, semi-transparent, drag to move, resize from
          a corner.
        </li>
        <li>Mirror typing from <em>any</em> app, not just when the overlay is focused.</li>
        <li>Instant highlight on press, slow fade on release.</li>
        <li>
          A practice mode that scores you (words per minute and accuracy)
          against a target sentence, plus a plain &ldquo;free&rdquo; mode that
          just mirrors what you type.
        </li>
        <li>Lives in the system tray. One-click launch.</li>
      </ul>
      <p>
        The whole thing is one Python file. The UI is standard-library{" "}
        <code className="text-primary">tkinter</code>. The global key capture is
        the <code className="text-primary">keyboard</code> library. Tray icon is{" "}
        <code className="text-primary">pystray</code>, image work is{" "}
        <code className="text-primary">Pillow</code>. No framework, no web view,
        no build step during development.
      </p>

      <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-wide text-primary pt-6">
        Surprise one: the threading rule that makes it stable
      </h2>
      <p>
        Capturing keystrokes system-wide means a hook that fires on its own
        thread, completely outside the UI. The naive version of this crashes,
        because GUI toolkits hate being touched from a background thread.
      </p>
      <p>
        The rule that made it solid is almost embarrassingly simple:{" "}
        <strong>the keyboard hook never calls <code className="text-primary">tkinter</code>. Ever.</strong>{" "}
        It only writes to one small dictionary of shared state (which keys are
        held, what has been typed, which mode is active), guarded by a lock. A
        single redraw loop on the main thread polls that dictionary about sixty
        times a second and owns all the drawing.
      </p>
      <p>
        That one rule also gave me the fade for free. I keep a set of
        currently-held keys. Each frame, any held key is pinned to full
        brightness; any released key decays a little. There are no per-key
        timers, no animation scheduler, no callbacks. Instant-on and slow-fade
        fall out of &ldquo;full intensity while held, subtract a bit each frame
        after release.&rdquo; If you want a slower fade, you change one number.
      </p>
      <blockquote className="border-l-4 border-primary/60 bg-slate-50 dark:bg-white/5 pl-4 py-3 italic text-muted">
        When a background source has to feed a UI, funnel everything through one
        lock-guarded state object and one drawing loop. Don&rsquo;t let the
        background thread reach into the widgets. It&rsquo;s less code and it
        doesn&rsquo;t crash.
      </blockquote>

      <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-wide text-primary pt-6">
        Surprise two: the export that lied about which format it would give me
      </h2>
      <p>
        I wanted a proper hero image for the repo, so I generated one through a
        design tool&rsquo;s API. Listing the export formats worked. Creating the
        design worked. Then the PNG export &mdash; and every export where I
        specified a width and height &mdash; came back with &ldquo;not allowed to
        access design.&rdquo; Same design, same credentials.
      </p>
      <p>
        The thing that finally worked was a plain default-size JPG export. No
        dimensions, different format, straight through. The takeaway is small but
        real:
      </p>
      <blockquote className="border-l-4 border-primary/60 bg-slate-50 dark:bg-white/5 pl-4 py-3 italic text-muted">
        When one path through an integration returns a permission error, try a
        different format or a smaller request before you assume the whole thing
        is broken. The wall is often narrower than it looks.
      </blockquote>

      <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-wide text-primary pt-6">
        Making it something people can actually run
      </h2>
      <p>
        Qeys ran fine from source. But &ldquo;download and use my app&rdquo; for
        a normal person cannot mean &ldquo;install Python, then pip install, then
        run a script.&rdquo; So I packaged it into a single{" "}
        <code className="text-primary">Qeys.exe</code> with PyInstaller. One
        file, around thirty megabytes, bundles Python and every dependency and
        the logo asset. Double-click, it lands in the tray, done.
      </p>
      <p>
        There&rsquo;s one honest catch I won&rsquo;t pretend away. The exe is not
        code-signed, so the first time anyone runs it, Windows SmartScreen shows
        &ldquo;Windows protected your PC.&rdquo; You click &ldquo;More
        info,&rdquo; then &ldquo;Run anyway,&rdquo; once per machine. Removing
        that prompt entirely requires a paid signing certificate, which isn&rsquo;t
        worth it for a free tool. So instead of hiding it, I documented it: the
        release notes and the README tell you exactly what you&rsquo;ll see and
        why it&rsquo;s safe. Setting the expectation is the honest move.
      </p>
      <p>
        The exe lives on a GitHub release, not in the source tree, which is where
        binaries belong.
      </p>

      <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-wide text-primary pt-6">
        What shipped
      </h2>
      <ul className="list-disc space-y-2 pl-6 text-muted">
        <li>
          A single-file Python overlay that mirrors global typing at sixty
          frames per second.
        </li>
        <li>
          Two modes: scored Test practice and a plain Free mirror, switchable
          from a toggle in the bar.
        </li>
        <li>
          Live words-per-minute and accuracy, home-row anchors on F and J, drag,
          resize, system tray, one-click launcher.
        </li>
        <li>
          A standalone Windows executable on a public release, with the
          SmartScreen step documented up front.
        </li>
      </ul>
      <p>
        It&rsquo;s a small tool. But it&rsquo;s the kind of small tool that earns
        its keep, and it was a clean run from a one-line itch to a public
        download in a session.
      </p>
      <p>
        Qeys is built by{" "}
        <a
          href="https://jeffreyquemuel.cloud/qorex"
          className="text-primary underline hover:text-primary/80"
        >
          Qollab
        </a>
        . Code is open at{" "}
        <a
          href="https://github.com/Shinikara08/qeys"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline hover:text-primary/80"
        >
          github.com/Shinikara08/qeys
        </a>
        .
      </p>
    </BlogPostLayout>
  );
}
