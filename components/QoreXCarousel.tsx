"use client";

import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent, MouseEvent, PointerEvent } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface QoreXCarouselAgent {
  name: string;
  tag: string;
  quote: string;
  image: string;
  alt: string;
  border: string;
}

export default function QoreXCarousel({
  agents,
}: {
  agents: QoreXCarouselAgent[];
}) {
  const [selected, setSelected] = useState(0);
  const railRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);
  const dragState = useRef({ active: false, startX: 0, scrollLeft: 0 });
  const didDragRef = useRef(false);
  const active = agents[selected];

  useEffect(() => {
    const rail = railRef.current;
    const item = itemRefs.current[selected];

    if (!rail || !item) {
      return;
    }

    const left = item.offsetLeft - (rail.clientWidth - item.clientWidth) / 2;
    rail.scrollTo({
      left: Math.max(left, 0),
      behavior: "smooth",
    });
  }, [selected]);

  function selectClosestSlide() {
    const rail = railRef.current;

    if (!rail) {
      return;
    }

    const railCenter = rail.scrollLeft + rail.clientWidth / 2;
    let closestIndex = selected;
    let closestDistance = Number.POSITIVE_INFINITY;

    itemRefs.current.forEach((item, index) => {
      if (!item) {
        return;
      }

      const itemCenter = item.offsetLeft + item.clientWidth / 2;
      const distance = Math.abs(itemCenter - railCenter);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    setSelected(closestIndex);
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    const rail = railRef.current;

    if (!rail) {
      return;
    }

    dragState.current = {
      active: true,
      startX: event.clientX,
      scrollLeft: rail.scrollLeft,
    };
    didDragRef.current = false;
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const rail = railRef.current;

    if (!rail || !dragState.current.active) {
      return;
    }

    const delta = event.clientX - dragState.current.startX;

    if (Math.abs(delta) > 6) {
      didDragRef.current = true;
    }

    rail.scrollLeft = dragState.current.scrollLeft - delta;
  }

  function handlePointerEnd(event: PointerEvent<HTMLDivElement>) {
    const rail = railRef.current;

    dragState.current.active = false;
    selectClosestSlide();
    window.setTimeout(() => {
      didDragRef.current = false;
    }, 0);
  }

  function goToAgentSection(index: number) {
    const agentId = agents[index].name.toLowerCase();
    const target = document.getElementById(agentId);

    setSelected(index);

    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.pushState(null, "", `/qorex#${agentId}`);
      return;
    }

    window.location.href = `/qorex#${agentId}`;
  }

  function handleCardClick(event: MouseEvent<HTMLDivElement>, index: number) {
    if (didDragRef.current) {
      event.preventDefault();
      event.stopPropagation();
      didDragRef.current = false;
      return;
    }

    goToAgentSection(index);
  }

  function handleCardKeyDown(event: KeyboardEvent<HTMLDivElement>, index: number) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      goToAgentSection(index);
    }
  }

  function goToSlide(direction: -1 | 1) {
    setSelected((current) => {
      const next = current + direction;

      if (next < 0) {
        return agents.length - 1;
      }

      if (next >= agents.length) {
        return 0;
      }

      return next;
    });
  }

  return (
    <section className="px-6 pb-16 md:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted">
              Character Rail
            </p>
            <h2 className="mt-2 text-2xl font-bold uppercase tracking-wide md:text-3xl">
              {active.name}
            </h2>
            <p className="mt-1 text-sm italic text-muted">{active.quote}</p>
          </div>
        </div>

        <div className="relative">
          <button
            type="button"
            aria-label="Previous QoreX portrait"
            onClick={() => goToSlide(-1)}
            className="absolute left-2 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-background/75 text-primary shadow-[0_0_20px_rgba(103,232,249,0.18)] backdrop-blur-md transition hover:border-primary/50 hover:bg-primary/10"
          >
            <ChevronLeft size={24} strokeWidth={2.4} />
          </button>

          <div
            ref={railRef}
            className="flex cursor-grab snap-x snap-proximity select-none gap-3 overflow-x-auto scroll-smooth pb-4 active:cursor-grabbing md:h-[420px] md:items-end [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerEnd}
            onPointerCancel={handlePointerEnd}
          >
            {agents.map((agent, index) => {
              return (
                <div
                  ref={(node) => {
                    itemRefs.current[index] = node;
                  }}
                key={agent.name}
                role="link"
                tabIndex={0}
                aria-label={`Jump to ${agent.name}`}
                className={`relative h-[220px] w-[390px] shrink-0 snap-center overflow-hidden rounded-2xl border border-white/10 ${agent.border} bg-surface/40 opacity-85 transition duration-300 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-primary/60 md:h-[360px] md:w-[640px]`}
                onFocus={() => setSelected(index)}
                onClick={(event) => handleCardClick(event, index)}
                onKeyDown={(event) => handleCardKeyDown(event, index)}
              >
                <Image
                  src={agent.image}
                  alt={agent.alt}
                  fill
                  sizes="(max-width: 768px) 390px, 640px"
                  quality={100}
                  unoptimized
                  draggable={false}
                  className="pointer-events-none object-contain"
                />
              </div>
              );
            })}
          </div>

          <button
            type="button"
            aria-label="Next QoreX portrait"
            onClick={() => goToSlide(1)}
            className="absolute right-2 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-background/75 text-primary shadow-[0_0_20px_rgba(103,232,249,0.18)] backdrop-blur-md transition hover:border-primary/50 hover:bg-primary/10"
          >
            <ChevronRight size={24} strokeWidth={2.4} />
          </button>
        </div>
      </div>
    </section>
  );
}
