import Link from "next/link";

const directions = [
  { key: "a", label: "A", name: "Light hero, payment rails", href: "/" },
  { key: "b", label: "B", name: "Gradient hero, live card", href: "/options/b" },
];

/** Floating review bar so the client can compare creative directions. */
export function DirectionSwitcher({ current }: { current: "a" | "b" }) {
  const active = directions.find((d) => d.key === current)!;
  return (
    <nav
      aria-label="Creative directions"
      className="fixed bottom-5 left-1/2 z-40 flex -translate-x-1/2 items-center gap-3 rounded-full bg-white/95 py-1.5 pr-1.5 pl-5 shadow-[0_12px_40px_-12px_rgba(31,31,31,0.3)] ring-1 ring-line backdrop-blur"
    >
      <span className="hidden text-[13px] text-copy sm:block">
        Direction {active.label} · <span className="text-ink">{active.name}</span>
      </span>
      <span className="text-[13px] text-copy sm:hidden">Direction</span>
      <span className="flex gap-1">
        {directions.map((d) => (
          <Link
            key={d.key}
            href={d.href}
            aria-current={d.key === current ? "page" : undefined}
            className={`grid size-9 place-items-center rounded-full text-[14px] font-semibold transition-colors ${
              d.key === current ? "bg-brand text-white" : "bg-surface text-ink hover:bg-mist"
            }`}
          >
            {d.label}
          </Link>
        ))}
      </span>
    </nav>
  );
}
