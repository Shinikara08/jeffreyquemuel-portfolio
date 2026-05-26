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
 *
 * Loop: children are rendered three times. The middle copy is the "real" view;
 * the outer two copies are clones so the user can scroll past either edge.
 * When the scroll position crosses into an outer third, scrollLeft teleports
 * by one set-width so visible content stays identical but runway is replenished
 * in both directions. Result: drag the first tile to the right (or last to the
 * left) and it wraps around continuously.
 *
 * Drag: uses POINTER EVENTS with setPointerCapture, not mouse events with
 * document listeners. Pointer capture routes all subsequent pointer events to
 * the captured element until release - including events outside the window -
 * so a release-outside-window or a re-render mid-drag cannot leak a phantom
 * mousemove handler that would cause "follows-cursor without click". An
 * explicit isDragging flag is checked in onPointerMove as belt-and-suspenders.
 *
 * Touch is left to native scrolling (we early-return for pointerType !== 'mouse')
 * so overflow-x-auto + scroll-snap handle finger drags without our interference.
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
    isDragging: false,
    pointerId: -1,
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
    return el.scrollWidth / 3;
  }, []);

  useLayoutEffect(() => {
    const el = scrollerRef.current;
    if (!el || itemCount === 0) return;
    const oneSet = measureSetWidth();
    setWidthRef.current = oneSet;
    teleportingRef.current = true;
    el.scrollLeft = oneSet;
    requestAnimationFrame(() => {
      teleportingRef.current = false;
    });
  }, [itemCount, measureSetWidth]);

  const handleScroll = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    if (teleportingRef.current) return;
    const oneSet = setWidthRef.current || measureSetWidth();
    if (oneSet === 0) return;

    if (el.scrollLeft < oneSet * 0.5) {
      teleportingRef.current = true;
      el.scrollLeft += oneSet;
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

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse") return;
    if (e.button !== 0) return;
    const el = scrollerRef.current;
    if (!el) return;

    try {
      el.setPointerCapture(e.pointerId);
    } catch {
      // Some browsers throw if capture is denied; treat as a non-drag click.
      return;
    }
    dragState.current.isDragging = true;
    dragState.current.pointerId = e.pointerId;
    dragState.current.startX = e.clientX;
    dragState.current.startScrollLeft = el.scrollLeft;
    dragState.current.moved = false;
    el.classList.add("cursor-grabbing");
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragState.current.isDragging) return;
    if (e.pointerId !== dragState.current.pointerId) return;
    const el = scrollerRef.current;
    if (!el) return;
    const dx = e.clientX - dragState.current.startX;
    if (Math.abs(dx) > 8) dragState.current.moved = true;
    el.scrollLeft = dragState.current.startScrollLeft - dx;
  }

  function endDrag(e?: React.PointerEvent<HTMLDivElement>) {
    if (!dragState.current.isDragging) return;
    const el = scrollerRef.current;
    if (el) {
      el.classList.remove("cursor-grabbing");
      if (e && el.hasPointerCapture(e.pointerId)) {
        try {
          el.releasePointerCapture(e.pointerId);
        } catch {
          // Safe to ignore - capture already released.
        }
      }
    }
    dragState.current.isDragging = false;
    dragState.current.pointerId = -1;
  }

  function onPointerUp(e: React.PointerEvent<HTMLDivElement>) {
    endDrag(e);
  }

  function onPointerCancel(e: React.PointerEvent<HTMLDivElement>) {
    endDrag(e);
  }

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
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
        onClickCapture={onClickCapture}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory px-6 md:px-16 pb-6 scroll-smooth cursor-grab select-none touch-pan-x [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden md:[mask-image:linear-gradient(to_right,transparent_0,black_64px,black_calc(100%-64px),transparent_100%)]"
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
