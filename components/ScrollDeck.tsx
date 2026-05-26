"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Horizontal-scroll deck with three traits:
 *  - Mouse-drag to scroll (touch + trackpad still work natively).
 *  - No visible scrollbar.
 *  - Floating arrow buttons on both sides; hidden when there's nothing
 *    in that direction.
 *
 * Drag handling note: `mousemove` and `mouseup` listeners are attached to
 * `document` ONLY after `mousedown`, then removed on `mouseup`. They do NOT
 * exist while the user is just hovering the deck. This kills the
 * "follows-cursor without click" bug that the React onMouseMove approach had,
 * and it also handles the user releasing the button outside the deck.
 *
 * Children should provide their own width + snap-start classes, e.g.
 * `shrink-0 snap-start w-[85vw] max-w-[400px]`.
 */
export default function ScrollDeck({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({
    startX: 0,
    startScrollLeft: 0,
    moved: false,
  });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const updateArrows = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    updateArrows();
    const el = scrollerRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [updateArrows]);

  function onMouseDown(e: React.MouseEvent<HTMLDivElement>) {
    const el = scrollerRef.current;
    if (!el) return;
    if (e.button !== 0) return; // left button only

    dragState.current.startX = e.pageX;
    dragState.current.startScrollLeft = el.scrollLeft;
    dragState.current.moved = false;
    el.classList.add("cursor-grabbing");

    // Attach drag listeners to DOCUMENT, not the deck. They only exist
    // while the drag is active, so hover-over-deck never triggers movement.
    document.addEventListener("mousemove", onDocMouseMove);
    document.addEventListener("mouseup", onDocMouseUp);
  }

  function onDocMouseMove(e: MouseEvent) {
    const el = scrollerRef.current;
    if (!el) return;
    const dx = e.pageX - dragState.current.startX;
    if (Math.abs(dx) > 8) dragState.current.moved = true;
    el.scrollLeft = dragState.current.startScrollLeft - dx;
  }

  function onDocMouseUp() {
    const el = scrollerRef.current;
    if (el) el.classList.remove("cursor-grabbing");
    document.removeEventListener("mousemove", onDocMouseMove);
    document.removeEventListener("mouseup", onDocMouseUp);
  }

  // Defensive: ensure no zombie listeners survive unmount.
  useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", onDocMouseMove);
      document.removeEventListener("mouseup", onDocMouseUp);
    };
    // onDocMouseMove and onDocMouseUp are closure-stable; intentionally omit from deps.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Swallow the synthetic click that fires after a drag so cards/links
  // don't navigate when the user was just scrolling.
  function onClickCapture(e: React.MouseEvent<HTMLDivElement>) {
    if (dragState.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      dragState.current.moved = false;
    }
  }

  function scrollByStep(direction: 1 | -1) {
    const el = scrollerRef.current;
    if (!el) return;
    const step = Math.max(220, el.clientWidth * 0.8);
    el.scrollBy({ left: step * direction, behavior: "smooth" });
  }

  return (
    <div className={`relative -mx-6 md:-mx-12 ${className}`}>
      <div
        ref={scrollerRef}
        onMouseDown={onMouseDown}
        onClickCapture={onClickCapture}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory px-6 md:px-16 pb-6 scroll-smooth cursor-grab select-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden md:[mask-image:linear-gradient(to_right,transparent_0,black_64px,black_calc(100%-64px),transparent_100%)]"
      >
        {children}
      </div>

      {canPrev && (
        <button
          type="button"
          aria-label="Scroll left"
          onClick={() => scrollByStep(-1)}
          className="absolute left-0 top-1/2 z-10 hidden -translate-y-1/2 md:inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-background text-foreground transition hover:bg-primary/20 hover:border-primary hover:text-primary"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      )}

      {canNext && (
        <button
          type="button"
          aria-label="Scroll right"
          onClick={() => scrollByStep(1)}
          className="absolute right-0 top-1/2 z-10 hidden -translate-y-1/2 md:inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-background text-foreground transition hover:bg-primary/20 hover:border-primary hover:text-primary"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
