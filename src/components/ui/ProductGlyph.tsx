import { RealIcon } from "./RealIcon";

type Kind = "versa" | "odcc" | "orchestration";

/** Product icon, so each product has a recognisable object across the site. */
export function ProductGlyph({ kind, className = "size-9" }: { kind: Kind; className?: string }) {
  return <RealIcon name={kind} className={className} />;
}
