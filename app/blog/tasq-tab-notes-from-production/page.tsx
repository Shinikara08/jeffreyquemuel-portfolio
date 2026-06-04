import type { Metadata } from "next";
import BlogImage from "@/components/BlogImage";
import BlogPostLayout from "@/components/BlogPostLayout";

export const metadata: Metadata = {
  title:
    "TasQ Tab - Task Manager Desktop App - Jeffrey Quemuel",
  description:
    "Three rounds for a complete sync. Eleven rounds for a small UI element. What I learned building a personal Electron desktop widget that syncs realtime with ClickUp.",
};

export default function Post() {
  return (
    <BlogPostLayout
      date="May 26, 2026"
      readTime="7 min read"
      title="TasQ Tab - Task Manager Desktop App"
      subtitle="Why two-way state reconciliation always needs three explicit operations, and what happens when you skip one."
      tags={["electron", "clickup", "desktop", "production-notes"]}
    >
      <p>
        I&rsquo;ve been building a personal task widget for the last few weeks.
        It&rsquo;s called TasQ Tab &mdash; an Electron desktop app that sits
        always-on-top in the corner of my monitor and surfaces tasks, calendar
        events, Gmail, and timers in one tile. The newest piece is a realtime
        sync with ClickUp, where most of my actual work lives.
      </p>
      <p>
        I shipped the sync in three rounds. Each round felt like the final one.
        None of them were. This is the story of why.
      </p>

      <BlogImage
        src="/images/projects/tasq_tab.png"
        alt="TasQ Tab desktop widget showing filter timezones, four world clocks, an active Portfolio task with subtasks, and embedded notepad"
        caption="The widget that grew from a personal tool into a multi-round sync exercise"
      />

      <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-wide text-primary pt-6">
        Round one: the parent/subtask routing bug
      </h2>
      <p>
        The first realtime sync (v1.25, then refined in 1.26) did what
        you&rsquo;d expect: poll ClickUp&rsquo;s{" "}
        <code className="text-primary">/team/{`{teamId}`}/task</code> endpoint
        every 15 seconds, compare the response against the local copy, and
        update or insert as needed. The endpoint returns tasks with nested
        subtasks. Easy.
      </p>
      <p>
        Except every subtask was getting created as a new top-level task in the
        widget. Not nested under its parent &mdash; sitting at the root,
        duplicated, ugly.
      </p>
      <p>
        The bug was that I&rsquo;d been treating the array of tasks as flat.
        ClickUp returns subtasks both as nested children of their parent AND as
        top-level entries in the response (when they were recently updated). My
        code was iterating the array and pushing every entry into{" "}
        <code className="text-primary">state.data.tasks</code> as if it were a
        parent. Subtasks ended up as orphan parents.
      </p>
      <p>
        The fix took me a couple hours: split the response into{" "}
        <code className="text-primary">parents</code> (those with{" "}
        <code className="text-primary">r.parent</code> null) and{" "}
        <code className="text-primary">subtasks</code> (those with{" "}
        <code className="text-primary">r.parent</code> set), process parents
        first to ensure they exist locally, then route each subtask into its
        parent&rsquo;s <code className="text-primary">subtasks[]</code> array.
        Net change: +30 lines. Confidence: 100% solved.
      </p>
      <p>
        That was v1.27. I closed the project, wrote the build log, moved on.
      </p>

      <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-wide text-primary pt-6">
        Round two: parent deletion
      </h2>
      <p>
        A few days later I deleted a task in ClickUp and it didn&rsquo;t
        disappear from TasQ Tab. Same as before &mdash; the data was already in
        the response (or rather, NOT in the response: a deleted task simply
        stopped appearing). My code just wasn&rsquo;t acting on the absence.
      </p>
      <p>
        I added a &ldquo;reconciliation&rdquo; full-pull every 30 seconds. On
        reconcile, build a <code className="text-primary">Set</code> of every
        task ID currently in ClickUp, then walk local linked tasks. If a local
        task&rsquo;s <code className="text-primary">clickup_task_id</code>{" "}
        isn&rsquo;t in that set, soft-delete it (set{" "}
        <code className="text-primary">deleted_at</code>, move to archive
        &mdash; the user can restore from the trash icon if they need to).
      </p>
      <p>
        Also: if it reappears later (rename, undelete), un-archive it on the
        next reconcile. Defensive symmetry.
      </p>
      <p>
        That was v1.29. Net change: +50 lines. The project folder got its own
        four-character pipeline (brainstorm to prompt to build to echo), with a
        folder name like{" "}
        <code className="text-primary">clickup_realtime_sync</code> and a brain
        entry in <code className="text-primary">_brain/insights.md</code>.
      </p>
      <p>
        I closed it. Moved on. Felt good about my &ldquo;complete&rdquo; sync.
      </p>

      <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-wide text-primary pt-6">
        Round three: the third dimension
      </h2>
      <p>
        Today I deleted a subtask in ClickUp&rsquo;s web UI. It didn&rsquo;t
        disappear.
      </p>
      <p>
        I almost didn&rsquo;t notice. The parent was still there. The other
        subtasks were still there. Just one subtask, stale, in the local copy.
      </p>
      <p>I sat with that for a minute.</p>
      <p>
        The bug had the same shape as the previous two. The data was in the
        response &mdash; ClickUp&rsquo;s task object returns a{" "}
        <code className="text-primary">subtasks[]</code> array; a deleted
        subtask is simply missing from that array. My existing{" "}
        <code className="text-primary">applyClickUpToLocalTask</code> function
        walked the array to UPDATE existing local subtasks (matching by{" "}
        <code className="text-primary">clickup_task_id</code>). It never
        REMOVED local subtasks whose ID was absent from the remote array. Same
        blind spot as before, just one level deeper.
      </p>
      <p>
        The fix was small. A new{" "}
        <code className="text-primary">
          removeOrphanedSubtasks(localTask, remoteSubtasks)
        </code>{" "}
        helper. Build a <code className="text-primary">Set</code> of remote
        IDs. Walk local subtasks in reverse (so splice indices stay valid). If
        a local subtask has a{" "}
        <code className="text-primary">clickup_task_id</code> but it&rsquo;s
        not in the remote set, splice it out. If a timer was running on it,
        null out the active timer first &mdash; don&rsquo;t try to log the
        time to a ClickUp task that no longer exists.
      </p>
      <p>Net change: +35 lines. Took an hour from brainstorm to installer.</p>

      <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-wide text-primary pt-6">
        The pattern I should have seen the first time
      </h2>
      <p>
        Looking back, all three rounds were the same fix repeated at different
        scopes:
      </p>
      <blockquote className="border-l-4 border-primary/60 bg-slate-50 dark:bg-white/5 pl-4 py-3 italic text-muted">
        Two-way state reconciliation needs explicit logic for three operations:
        ADD (the remote has something new), UPDATE (the remote changed
        something we have), DELETE (the remote no longer has something we
        have). Skip any one of these and bugs surface in months, not days.
      </blockquote>
      <p>
        Round 1 was a missing <strong>ADD</strong> dimension &mdash; subtasks
        were getting added wrong because the code didn&rsquo;t distinguish them
        from parents. Round 2 was a missing <strong>DELETE</strong> dimension
        at the parent level. Round 3 was a missing{" "}
        <strong>DELETE</strong> dimension at the subtask level. Three rounds,
        same blind spot in three different costumes.
      </p>
      <p>
        This is obvious in retrospect. It&rsquo;s the kind of thing
        you&rsquo;d find in a textbook chapter on data synchronization. But I
        didn&rsquo;t see it the first time because the UPDATE path is what
        feels like the work. Updating a status, propagating a name change,
        syncing a due date &mdash; that&rsquo;s the visible code. The ADD and
        DELETE paths feel like edge cases when you&rsquo;re writing them. They
        get noticed when a user does something the visible code doesn&rsquo;t
        anticipate.
      </p>
      <p>The lesson, written down so I remember it next time:</p>
      <blockquote className="border-l-4 border-primary/60 bg-slate-50 dark:bg-white/5 pl-4 py-3 italic text-muted">
        When you build a sync, for every remote source-of-truth, write three
        explicit blocks. Update is not enough. Add is not enough. Delete is not
        enough. Write all three and label them.
      </blockquote>

      <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-wide text-primary pt-6">
        What didn&rsquo;t work first
      </h2>
      <p>
        A side note worth recording &mdash; not because it relates to subtask
        deletion, but because it relates to building widget UIs in Electron.
      </p>
      <p>
        Between v1.27 and v1.39 there were eleven CSS iterations on a
        custom-HTML timezone picker. Eleven. Each iteration was a different
        font size or padding value or line-height tuning, trying to make the
        picker&rsquo;s dropdown rendering match the visual quality the user
        had liked in earlier versions.
      </p>
      <p>
        Round eleven was the worst. The picker was readable, sort of, but
        wrong in some way I couldn&rsquo;t pin down. The user said &ldquo;the
        very first version that has a timezone looks good.&rdquo; That was a
        flag.
      </p>
      <p>
        The very first version had used a native HTML{" "}
        <code className="text-primary">{`<select>`}</code> element. The browser
        renders those with the operating system&rsquo;s preferred font,
        line-height, and subpixel rendering tuned for that font on that DPI.
        We had replaced it with a custom HTML popup specifically so we could
        add a search box. Eleven rounds of CSS later, we still hadn&rsquo;t
        matched what the OS gave us for free.
      </p>
      <p>
        The fix was to revert. Keep the native{" "}
        <code className="text-primary">{`<select>`}</code>. Add the search box
        as a separate input above the row of selects. Use{" "}
        <code className="text-primary">option.hidden = true/false</code> to
        filter the visible options in each select. Browser&rsquo;s native
        dropdown does the rest.
      </p>
      <p>
        That was v1.37. Net change: minus 370 lines deleted, plus 90 added.
        Deletion build.
      </p>
      <p>The lesson there is different:</p>
      <blockquote className="border-l-4 border-primary/60 bg-slate-50 dark:bg-white/5 pl-4 py-3 italic text-muted">
        When CSS in a CSP-strict renderer can&rsquo;t match OS-native
        rendering for a particular widget after a few rounds, revert to the
        native widget and add features around it. Don&rsquo;t keep iterating
        CSS.
      </blockquote>
      <p>
        Both lessons go in the brain. Both are easy to write down and hard to
        remember in the moment.
      </p>

      <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-wide text-primary pt-6">
        Why I&rsquo;m publishing this
      </h2>
      <p>
        Three rounds for a complete sync, eleven rounds for a small UI element.
        It&rsquo;s tempting to clean up the history before publishing &mdash;
        to write a blog post that says &ldquo;I built a realtime sync from
        ClickUp to a desktop widget&rdquo; and skip over the bugs and the
        resets. To make it look like a straight line.
      </p>
      <p>
        I don&rsquo;t think that&rsquo;s useful. The straight line is fiction.
        The real history is the one where I had to ship the same fix three
        times because I kept missing a dimension. The real history is the one
        where I burned eleven hours on font size before realizing I&rsquo;d
        built the wrong widget.
      </p>
      <p>
        If you&rsquo;re building two-way sync into your own tool, save yourself
        a round. Write the three blocks. Label them ADD / UPDATE / DELETE.
        Test each one explicitly.
      </p>
      <p>
        If you&rsquo;re building a desktop widget in Electron, save yourself
        eleven rounds. Use the native widget unless you have a specific reason
        not to. The OS is better at this than you are.
      </p>
      <p>
        TasQ Tab is a personal tool, open source under MIT, at{" "}
        <a
          href="https://github.com/Shinikara08/tasQtab"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline hover:text-primary/80"
        >
          github.com/Shinikara08/tasQtab
        </a>
        . If you&rsquo;re curious about the architecture or want to do
        something similar, drop a note.
      </p>
    </BlogPostLayout>
  );
}
