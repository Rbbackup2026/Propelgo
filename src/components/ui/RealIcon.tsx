import Image from "next/image";

export type RealIconName =
  | "versa"
  | "odcc"
  | "orchestration"
  | "routing"
  | "cards"
  | "workflow"
  | "reconcile"
  | "connect"
  | "issue"
  | "route"
  | "integrate"
  | "automate"
  | "settle"
  | "pharma"
  | "manufacturing"
  | "it"
  | "retail"
  | "hospitality"
  | "aviation";

/** Icons re-rendered in the photoreal style; each revision gets its own folder so cached copies of older art aren't served. */
const REVISION: Partial<Record<RealIconName, string>> = {
  versa: "v2",
  odcc: "v2",
  orchestration: "v2",
  cards: "v2",
  workflow: "v2",
  routing: "v3",
  reconcile: "v3",
  connect: "eco2",
  issue: "eco2",
  route: "eco2",
  integrate: "eco2",
  automate: "eco2",
  settle: "eco2",
};

/** Rendered 3D icon from /public/icons; decorative, so it carries no alt text. */
export function RealIcon({ name, className = "size-8" }: { name: RealIconName; className?: string }) {
  return (
    <Image
      src={REVISION[name] ? `/icons/${REVISION[name]}/${name}.png` : `/icons/${name}.png`}
      alt=""
      aria-hidden="true"
      width={256}
      height={256}
      sizes="96px"
      draggable={false}
      className={`object-contain select-none ${className}`}
    />
  );
}
