type IconProps = { className?: string };

/** The up-right "propel" arrow from the logo — used as the system arrow everywhere. */
export function ArrowUpRight({ className = "size-3.5" }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
      <path d="M4.5 11.5 11.5 4.5M5.5 4.5h6v6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
    </svg>
  );
}

export function ArrowRight({ className = "size-3.5" }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
      <path d="M2.5 8h10M8.5 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
    </svg>
  );
}

export function ArrowLeft({ className = "size-3.5" }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
      <path d="M13.5 8h-10M7.5 4l-4 4 4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
    </svg>
  );
}

export function Check({ className = "size-3" }: IconProps) {
  return (
    <svg viewBox="0 0 12 12" fill="none" className={className} aria-hidden="true">
      <path d="m2.5 6.2 2.3 2.3 4.7-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
    </svg>
  );
}

export function Chevron({ className = "size-2.5" }: IconProps) {
  return (
    <svg viewBox="0 0 10 10" fill="none" className={className} aria-hidden="true">
      <path d="m2 3.75 3 3 3-3" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

export function ShieldIcon({ className = "size-4" }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
      <path d="M8 1.75 2.75 3.75v4c0 3.1 2.2 5.4 5.25 6.5 3.05-1.1 5.25-3.4 5.25-6.5v-4L8 1.75Z" stroke="currentColor" strokeWidth="1.3" />
      <path d="m5.6 8 1.7 1.7 3.2-3.4" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

export function EyeIcon({ className = "size-4" }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
      <path d="M1.5 8S4 3.25 8 3.25 14.5 8 14.5 8 12 12.75 8 12.75 1.5 8 1.5 8Z" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

export function ContactlessIcon({ className = "size-4" }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
      <path d="M5 4.5c1 1 1.5 2.2 1.5 3.5S6 10.5 5 11.5M8 3c1.4 1.4 2.1 3.1 2.1 5S9.4 11.6 8 13M11 1.75c1.8 1.8 2.75 3.95 2.75 6.25S12.8 12.45 11 14.25" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}
