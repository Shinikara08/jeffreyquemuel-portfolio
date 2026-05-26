"use client";

import {
  Children,
  Fragment,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
} from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Endless horizontal-scroll deck.
 *  - Children are tripled. The middle copy is the "real" view; the outer two
 *    copies are clones that exist so the user can scroll past either edge.
 *    When the scroll position crosses into an outer copy, scrollLeft is
 *    instantly teleported by one set-width so the visible content stays
 *    identical but the user has fresh runway in both directions.
 *  - Mouse-drag to scroll (touch + trackpad still work natively).
 *  - No visible scrollbar.
 *  - Arrows always render because the loop is infinite in both directions.
 *
 * Drag handling: `mousemove`/`mouseup` attach to `document` ONLY after
 * `mousedown` and detach on `mouseup`. They do NOT exist while just hovering,
 * which kills the "follows-cursor without click" bug.
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
  const setWidthRef = useRef(0);
  const teleportingRef = useRef(false);

  const items = Children.toArray(children);
  const itemCount = items.length;

  const measureSetWidth = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return 0;
    // We render three identical copies side by side. The total content width
    // is therefore exactly 3x one set's width. scrollWidth excludes the
    // scrollbar gutter but includes the inner padding once, so dividing by
    // three gives one set's true on-screen extent.
    return el.scrollWidth / 3;
  }, []);

  // Center the scroll position on mount so the user starts inside the middle
  // copy with infinite runway in both directions. Use useLayoutEffect so the
  // jump happens before the browser paints (no visible flash at scrollLeft=0).
  useLayoutEffect(() => {
    const el = scrollerRef.current;
    if (!el || itemCount === 0) return;
    const oneSet = measureSetWidth();
    setWidthRef.current = oneSet;
    teleportingRef.current = true;
    el.scrollLeft = oneSet;
    // Release the teleport guard on the next frame, after the scroll event
    // for the manual reset has flushed.
    requestAnimationFrame(() => {
      teleportingRef.current = false;
    });
  }, [itemCount, measureSetWidth]);

  // Boundary teleport: when scroll enters the outer thirds, instantly reset
  // back into the middle copy by adding or subtracting one set width.
  const handleScroll = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    if (teleportingRef.current) return;
    const oneSet = setWidthRef.current || measureSetWidth();
    if (oneSet === 0) return;

    if (el.scrollLeft < oneSet * 0.5) {
      teleportingRef.current = true;
      el.scrollLeft += oneSet;
      // Keep an in-progress drag visually continuous.
      dragState.current.startScrollLeft += oneSet;
      requestAnimationFrame(() => {
        teleportingRef.current = false;
      });
    } else if (el.scrollLeft > oneSet * 2.5) {
      teleportingRef.current = true;
      el.scrollLeft -= oneSet;
      dragState.current.startScrollLeft -= oneSet;
      requestAnimationFrame(() => {
        teleportingRef.current = false;
      });
    }
  }, [measureSetWidth]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll, { passive: true });
    const onResize = () => {
      setWidthRef.current = measureSetWidth();
    };
    window.addEventListener("resize", onResize);
    return () => {
      el.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [handleScroll, measureSetWidth]);

  function onMouseDown(e: React.MouseEvent<HTMLDivElement>) {
    const el = scrollerRef.current;
    if (!el) return;
    if (e.button !== 0) return;

    dragState.current.startX = e.pageX;
    dragState.current.startScrollLeft = el.scrollLeft;
    dragState.current.moved = false;
    el.classList.add("cursor-grabbing");

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

  useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", onDocMouseMove);
      document.removeEventListener("mouseup", onDocMouseUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const copies: ("a" | "b" | "c")[] = ["a", "b", "c"];

  return (
    <div className={`relative -mx-6 md:-mx-12 ${className}`}>
      <div
        ref={scrollerRef}
        onMouseDown={onMouseDown}
        onClickCapture={onClickCapture}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory px-6 md:px-16 pb-6 scroll-smooth cursor-grab select-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden md:[mask-image:linear-gradient(to_right,transparent_0,black_64px,black_calc(100%-64px),transparent_100%)]"
      >
        {copies.map((copy) => (
          <Fragment key={copy}>
            {items.map((child, i) => (
              <Fragment key={`${copy}-${i}`}>{child}</Fragment>
            ))}
          </Fragment>
        ))}
      </div>

      <button
        type="button"
        aria-label="Scroll left"
        onClick={() => scrollByStep(-1)}
        className="absolute left-0 top-1/2 z-10 hidden -translate-y-1/2 md:inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-background text-foreground transition hover:bg-primary/20 hover:border-primary hover:text-primary"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <button
        type="button"
        aria-label="Scroll right"
        onClick={() => scrollByStep(1)}
        className="absolute right-0 top-1/2 z-10 hidden -translate-y-1/2 md:inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-background text-foreground transition hover:bg-primary/20 hover:border-primary hover:text-primary"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}
