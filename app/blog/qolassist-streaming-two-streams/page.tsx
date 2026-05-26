import type { Metadata } from "next";
import BlogImage from "@/components/BlogImage";
import BlogPostLayout from "@/components/BlogPostLayout";

export const metadata: Metadata = {
  title:
    "Streaming Two Streams at Once: ASR Partials + LLM Tokens in One UI — Jeffrey Quemuel",
  description:
    "Building QolAssist — a Windows desktop AI overlay where local streaming speech-to-text and streaming Claude tokens share a single event loop without blocking each other.",
};

export default function Post() {
  return (
    <BlogPostLayout
      date="May 06, 2026"
      readTime="6 min read"
      title="Streaming Two Streams at Once: ASR Partials + LLM Tokens in One UI"
      subtitle="Building QolAssist — what 'live' actually means when speech transcription and Claude tokens both have to share an event loop."
      tags={["pyqt6", "claude-api", "streaming", "asr"]}
    >
      <p>
        Most &ldquo;AI assistant&rdquo; demos work the same way: one big
        request goes out, one big answer comes back. That pattern is fine for a
        chatbot. It falls apart the moment you want the assistant to feel{" "}
        <em>live</em> &mdash; reading captions on one side of the screen while
        an answer types itself out on the other.
      </p>

      <p>
        QolAssist is a Windows desktop overlay I built to find out what that
        actually feels like. Two frameless, always-on-top panels float over
        whatever app you&rsquo;re using: a Transcript on the left captioning
        system audio word-by-word, an Answer on the right streaming Claude
        tokens. One hotkey toggles between listening and asking. Everything
        except the Claude call runs on-device.
      </p>

      <p>
        Here&rsquo;s what I learned building it &mdash; the architectural
        decisions, the threading model, and the deadlock that taught me what{" "}
        <code className="text-primary">thread.join()</code> actually does.
      </p>

      <BlogImage
        src="/images/projects/qolassist.png"
        alt="QolAssist desktop overlay showing interviewer transcript on the left and streamed Claude answers on the right"
        caption="QolAssist running as a transparent desktop overlay"
      />

      <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-wide text-primary pt-6">
        Vosk Over Whisper: Why Perceived Latency Wins
      </h2>
      <p>
        The first version used <code className="text-primary">faster-whisper</code>{" "}
        on CPU. Whisper is more accurate. Captions arrived in 3-second chunks.
        It felt unusably laggy in conversation &mdash; you&rsquo;d hear the
        speaker say something, then watch the words appear three seconds later,
        with no visual signal in between that anything was happening.
      </p>

      <p>
        Switching to Vosk gave word-by-word partials at sub-second latency on
        the same hardware, at the cost of some accuracy on uncommon words.
        That&rsquo;s the tradeoff in one sentence:{" "}
        <strong className="text-foreground">
          for any &lsquo;live&rsquo; UX, perceived latency beats peak accuracy.
        </strong>{" "}
        Users will forgive a wrong word; they won&rsquo;t forgive three seconds
        of empty UI.
      </p>

      <p>
        Vosk also streams. Every audio chunk you feed it can return either a
        partial result (current best guess for the in-flight phrase) or a final
        result (a confirmed segment). The transcript panel renders partials in
        a dimmed style and finals in a bright one, so the user can see the
        engine&rsquo;s confidence in real time without reading the model&rsquo;s
        mind.
      </p>

      <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-wide text-primary pt-6">
        The Threading Model
      </h2>
      <p>
        Three things have to happen at once and none of them can block the UI:
      </p>
      <ul className="space-y-2 pl-6 list-disc">
        <li>
          <strong className="text-foreground">Audio capture</strong> &mdash;
          WASAPI loopback pulling system audio into a numpy buffer.
        </li>
        <li>
          <strong className="text-foreground">ASR transcription</strong>{" "}
          &mdash; Vosk consuming the buffer and emitting partial/final results.
        </li>
        <li>
          <strong className="text-foreground">LLM streaming</strong> &mdash;
          the Anthropic SDK&rsquo;s <code className="text-primary">.stream()</code>{" "}
          helper iterating over Claude&rsquo;s SSE response.
        </li>
      </ul>

      <p>
        Each of these lives on its own background thread. The Qt main thread
        owns every widget; nothing else is allowed to touch a widget directly.
        Background threads communicate with the UI exclusively through Qt
        signals.
      </p>

      <pre className="rounded-xl border border-white/10 bg-surface/40 p-4 text-sm overflow-x-auto">
        <code>{`# Background ASR thread emits a signal; the slot runs on the UI thread
class TranscriberWorker(QObject):
    partial_result = pyqtSignal(str)
    final_result = pyqtSignal(str)

    def run(self):
        for chunk in self.audio_queue:
            if recognizer.AcceptWaveform(chunk):
                self.final_result.emit(recognizer.Result())
            else:
                self.partial_result.emit(recognizer.PartialResult())

# Wire the signal to a UI slot once
worker.partial_result.connect(transcript_panel.show_partial)
worker.final_result.connect(transcript_panel.append_final)`}</code>
      </pre>

      <p>
        Qt signals are a thread-safe message bus &mdash; emit from anywhere,
        the slot runs on the receiver&rsquo;s thread. This is the single most
        useful pattern in PyQt for this kind of app.
      </p>

      <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-wide text-primary pt-6">
        The Self-Join Deadlock
      </h2>
      <p>
        Early on, an unhandled error in the audio mixer thread would call{" "}
        <code className="text-primary">stop_listening()</code> directly. That
        helper joined the audio thread before returning. The audio thread was
        the calling thread. Python obligingly tried to wait for itself to
        finish.
      </p>

      <p>The app froze. No exception. No crash. Just silent deadlock.</p>

      <p>
        The fix is the same fix I&rsquo;d apply to any Qt threading bug: stop
        calling cross-thread methods directly. Emit a signal instead.
      </p>

      <pre className="rounded-xl border border-white/10 bg-surface/40 p-4 text-sm overflow-x-auto">
        <code>{`# WRONG — runs in the audio thread, joins itself, deadlocks
def on_audio_error(err):
    log.error(err)
    self.stop_listening()  # joins the calling thread

# RIGHT — emit, let the main thread handle teardown
class AudioMixer(QObject):
    error_occurred = pyqtSignal(str)

    def on_audio_error(self, err):
        self.error_occurred.emit(str(err))

mixer.error_occurred.connect(controller.stop_listening)`}</code>
      </pre>

      <p>
        Lesson: in any threaded UI app, treat &ldquo;background thread calling
        a method that touches the main thread&rdquo; as a code smell. Route it
        through a signal even when it looks unnecessary. The one time it{" "}
        <em>is</em> necessary, you&rsquo;ll already be doing the right thing.
      </p>

      <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-wide text-primary pt-6">
        Streaming LLM with Prompt Caching
      </h2>
      <p>
        Every ask sends the same reference text file as the system prompt and
        the latest caption lines as the user message. Without caching, every
        ask re-tokenizes the whole reference file on Anthropic&rsquo;s side and
        you pay full input cost every time.
      </p>

      <p>
        With <code className="text-primary">cache_control: ephemeral</code> set
        on the system block, repeat asks against the same context are roughly
        10x cheaper after the first call. The reference file usually does
        nothing for two minutes between asks, then gets hit five times in a
        row. Caching is purpose-built for that pattern.
      </p>

      <pre className="rounded-xl border border-white/10 bg-surface/40 p-4 text-sm overflow-x-auto">
        <code>{`with client.messages.stream(
    model="claude-haiku-4-5",
    max_tokens=1024,
    system=[{
        "type": "text",
        "text": reference_file_contents,
        "cache_control": {"type": "ephemeral"},
    }],
    messages=[{"role": "user", "content": latest_captions}],
) as stream:
    for text in stream.text_stream:
        token_received.emit(text)  # Qt signal → answer panel`}</code>
      </pre>

      <p>
        The SDK&rsquo;s <code className="text-primary">.stream()</code> context
        manager handles all the SSE plumbing &mdash; chunked decoding, retry on
        connection blips, clean teardown. Each text fragment becomes a Qt
        signal emission; the answer panel appends it. Tokens land on screen
        the instant they arrive.
      </p>

      <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-wide text-primary pt-6">
        What &lsquo;Live&rsquo; Actually Feels Like
      </h2>
      <p>
        With both streams running, the experience is qualitatively different
        from any single-request demo I&rsquo;d built before. Captions tick
        across the left panel as the speaker talks. You hit space. The right
        panel starts typing an answer before the left panel has even finished
        rendering its last partial. Two streams, one UI, no blocking, no lag.
      </p>

      <p>
        The whole project is ~1,000 lines of Python across 8 modules,
        distributed as a self-contained Windows folder via PyInstaller. Solo
        build &mdash; design, architecture, and code &mdash; for Windows 10/11.
      </p>

      <p>
        If you take one thing from this:{" "}
        <strong className="text-foreground">
          for streaming UIs, the bottleneck is almost never the model. It&rsquo;s
          the threading boundary between the model&rsquo;s output and your UI
          thread.
        </strong>{" "}
        Get that boundary right with signals, and the rest of the architecture
        falls into place.
      </p>
    </BlogPostLayout>
  );
}
