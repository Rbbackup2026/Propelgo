import Image from "next/image";

export type CoverArt = "orchestration" | "credit" | "vendors";

export const COVER_ACCENT: Record<CoverArt, string> = {
  orchestration: "#0e8ba3",
  credit: "#5b57d9",
  vendors: "#d9822b",
};

/** Unsplash photography (free for commercial use), one per topic. */
const PHOTOS: Record<CoverArt, { src: string; alt: string }> = {
  orchestration: { src: "/resources/orchestration.jpg", alt: "Laptop showing a payments analytics dashboard" },
  credit: { src: "/resources/credit.jpg", alt: "Business card being used for an online payment on a laptop" },
  vendors: { src: "/resources/vendors.jpg", alt: "Supplier warehouse with stocked shelves" },
};

/** Topic photograph washed in the article's accent so the row stays on theme. */
export function SpectrumCover({ art }: { art: CoverArt }) {
  const accent = COVER_ACCENT[art];
  const photo = PHOTOS[art];
  return (
    <div className="relative size-full">
      <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover saturate-[0.85]" />
      <div className="absolute inset-0 mix-blend-soft-light" style={{ backgroundColor: accent, opacity: 0.55 }} />
      <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${accent}59 0%, transparent 55%)` }} />
    </div>
  );
}
