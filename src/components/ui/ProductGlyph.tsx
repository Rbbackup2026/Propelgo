type Kind = "versa" | "odcc" | "orchestration";

/** Small hand-drawn product glyphs, so each product has a recognisable shape across the site. */
export function ProductGlyph({ kind, className = "size-9" }: { kind: Kind; className?: string }) {
  if (kind === "versa") {
    return (
      <svg viewBox="0 0 36 36" fill="none" className={className} aria-hidden="true">
        <rect x="9" y="7" width="20" height="13" rx="2.5" stroke="currentColor" strokeOpacity=".35" strokeWidth="1.2" />
        <rect x="6" y="11" width="20" height="13" rx="2.5" stroke="currentColor" strokeOpacity=".6" strokeWidth="1.2" />
        <rect x="3" y="15" width="20" height="13" rx="2.5" fill="#07F258" fillOpacity=".12" stroke="#07F258" strokeWidth="1.3" />
        <path d="M6.5 24.5h6" stroke="#07F258" strokeWidth="1.3" />
        <path d="m27 28 5-5m-3.5 0H32v3.5" stroke="#07F258" strokeWidth="1.3" />
      </svg>
    );
  }
  if (kind === "odcc") {
    return (
      <svg viewBox="0 0 36 36" fill="none" className={className} aria-hidden="true">
        <path d="M4 8.5h28" stroke="currentColor" strokeOpacity=".35" strokeWidth="3" strokeLinecap="round" />
        <path d="M4 8.5h13" stroke="currentColor" strokeOpacity=".8" strokeWidth="3" strokeLinecap="round" />
        <path d="M18 8.5h7" stroke="#07F258" strokeWidth="3" strokeLinecap="round" />
        <rect x="6" y="14" width="24" height="15.5" rx="2.8" fill="#07F258" fillOpacity=".12" stroke="#07F258" strokeWidth="1.3" />
        <rect x="9.5" y="18" width="5" height="3.8" rx=".8" stroke="#07F258" strokeWidth="1.1" />
        <path d="M9.5 25.5h9" stroke="#07F258" strokeWidth="1.2" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 36 36" fill="none" className={className} aria-hidden="true">
      <circle cx="4.5" cy="9" r="2" stroke="currentColor" strokeOpacity=".6" strokeWidth="1.2" />
      <circle cx="4.5" cy="18" r="2" stroke="currentColor" strokeOpacity=".6" strokeWidth="1.2" />
      <circle cx="4.5" cy="27" r="2" stroke="currentColor" strokeOpacity=".6" strokeWidth="1.2" />
      <path d="M6.5 9h4v9m-4 9h4v-9m-4 0h7" stroke="currentColor" strokeOpacity=".6" strokeWidth="1.2" />
      <rect x="13.5" y="13" width="9" height="10" rx="2" fill="#07F258" fillOpacity=".15" stroke="#07F258" strokeWidth="1.3" />
      <path d="M22.5 18h3m0-9v18m0-18h4m-4 9h4m-4 9h4" stroke="#07F258" strokeWidth="1.2" />
      <circle cx="31.5" cy="9" r="2" stroke="#07F258" strokeWidth="1.2" />
      <circle cx="31.5" cy="18" r="2" stroke="#07F258" strokeWidth="1.2" />
      <circle cx="31.5" cy="27" r="2" stroke="#07F258" strokeWidth="1.2" />
    </svg>
  );
}
