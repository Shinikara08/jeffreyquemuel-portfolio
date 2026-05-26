"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

export default function ZoomableImage({
  src,
  alt,
  sizes,
  className = "object-contain",
  onOpen,
}: {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  onOpen?: () => void;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

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

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <button
            type="button"
            aria-label="Close zoomed image"
            className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white transition hover:bg-white/10"
            onClick={() => setOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>

          <div
            className="relative h-[88vh] w-[94vw]"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={src}
              alt={alt}
              fill
              sizes="94vw"
              quality={100}
              unoptimized
              className="object-contain"
              priority
            />
          </div>
        </div>
      )}
    </>
  );
}
