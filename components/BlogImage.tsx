import ZoomableImage from "@/components/ZoomableImage";

export default function BlogImage({
  src,
  alt,
  caption,
  aspect = "wide",
}: {
  src: string;
  alt: string;
  caption: string;
  aspect?: "wide" | "square" | "tall";
}) {
  return (
    <figure className="my-8 overflow-hidden rounded-2xl border border-border bg-surface">
      <div
        className={`relative ${
          aspect === "square"
            ? "aspect-square"
            : aspect === "tall"
            ? "aspect-[9/16] max-h-[720px]"
            : "aspect-[16/9]"
        }`}
      >
        <ZoomableImage
          src={src}
          alt={alt}
          sizes="(max-width: 768px) 100vw, 768px"
          className="object-contain"
        />
      </div>
      <figcaption className="border-t border-border px-4 py-3 text-xs uppercase tracking-widest text-muted">
        {caption}
      </figcaption>
    </figure>
  );
}
