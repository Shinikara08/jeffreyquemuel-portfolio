"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

type GalleryItem = {
  src: string;
  alt: string;
};

export default function ZoomableImage({
  src,
  alt,
  sizes,
  className = "object-contain",
  onOpen,
  gallery,
}: {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  onOpen?: () => void;
  gallery?: GalleryItem[];
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Resolve the effective gallery: an array of at least this image. If a
  // `gallery` prop is provided, we navigate within it; otherwise the modal
  // shows just this one image with no prev/next buttons.
  const effectiveGallery = useMemo<GalleryItem[]>(() => {
    if (gallery && gallery.length > 0) return gallery;
    return [{ src, alt }];
  }, [gallery, src, alt]);

  const startIndex = useMemo(() => {
    const i = effectiveGallery.findIndex((g) => g.src === src);
    return i >= 0 ? i : 0;
  }, [effectiveGallery, src]);

  const [index, setIndex] = useState(startIndex);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Whenever the modal opens, reset to the clicked image's index. This is what
  // makes "click frame 3, then next-next" land on frame 5, not on frame 2.
  useEffect(() => {
    if (open) setIndex(startIndex);
  }, [open, startIndex]);

  const hasGallery = effectiveGallery.length > 1;

  const goPrev = useCallback(() => {
    setIndex((i) => (i - 1 + effectiveGallery.length) % effectiveGallery.length);
  }, [effectiveGallery.length]);

  const goNext = useCallback(() => {
    setIndex((i) => (i + 1) % effectiveGallery.length);
  }, [effectiveGallery.length]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
      if (!hasGallery) return;
      if (event.key === "ArrowRight") goNext();
      if (event.key === "ArrowLeft") goPrev();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, hasGallery, goNext, goPrev]);

  const current = effectiveGallery[index] ?? { src, alt };

  // The modal is portalled to document.body so any transformed ancestor
  // (e.g. Framer Motion translate on a card) doesn't trap "position: fixed"
  // inside the tile. From document.body, fixed truly anchors to the viewport.
  const modal = open ? (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <button
        type="button"
        aria-label="Close zoomed image"
        className="absolute right-4 top-4 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white transition hover:bg-white/10"
        onClick={(event) => {
          event.stopPropagation();
          setOpen(false);
        }}
      >
        <X className="h-5 w-5" />
      </button>

      {hasGallery && (
        <>
          <button
            type="button"
            aria-label="Previous image"
            className="absolute left-4 top-1/2 z-10 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white transition hover:bg-white/10"
            onClick={(event) => {
              event.stopPropagation();
              goPrev();
            }}
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            aria-label="Next image"
            className="absolute right-4 top-1/2 z-10 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white transition hover:bg-white/10"
            onClick={(event) => {
              event.stopPropagation();
              goNext();
            }}
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          <div
            className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 rounded-full border border-white/20 bg-black/50 px-3 py-1 text-xs uppercase tracking-widest text-white"
            onClick={(event) => event.stopPropagation()}
          >
            {index + 1} / {effectiveGallery.length}
          </div>
        </>
      )}

      <div
        className="relative h-[88vh] w-[94vw]"
        onClick={(event) => event.stopPropagation()}
      >
        <Image
          key={current.src}
          src={current.src}
          alt={current.alt}
          fill
          sizes="94vw"
          quality={100}
          unoptimized
          className="object-contain"
          priority
        />
      </div>
    </div>
  ) : null;

  return (
    <>
      <button
        type="button"
        aria-label={`Zoom image: ${alt}`}
        onClick={() => {
          onOpen?.();
          setOpen(true);
        }}
        className="absolute inset-0 cursor-zoom-in overflow-hidden text-left"
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          quality={100}
          unoptimized
          className={`transition duration-500 hover:scale-[1.02] ${className}`}
        />
      </button>

      {mounted && modal ? createPortal(modal, document.body) : null}
    </>
  );
}
