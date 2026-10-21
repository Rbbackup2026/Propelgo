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

/** Rendered 3D icon from /public/icons; decorative, so it carries no alt text. */
export function RealIcon({ name, className = "size-8" }: { name: RealIconName; className?: string }) {
  return (
    <Image
      src={`/icons/${name}.png`}
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
