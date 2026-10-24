"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react";
import type { ReactNode } from "react";

const ease = [0.16, 1, 0.3, 1] as const;

type RevealProps = {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article" | "p" | "h2";
} & Omit<HTMLMotionProps<"div">, "children">;

/** Fade-and-rise once the element scrolls into view. */
export function Reveal({ children, delay = 0, y = 20, className, as = "div", ...rest }: RevealProps) {
  const reduce = useReducedMotion();
  const Comp = motion[as] as typeof motion.div;
  return (
    <Comp
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.8, ease, delay }}
      className={className}
      {...rest}
    >
      {children}
    </Comp>
  );
}

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`text-[15px] font-medium text-brand ${className}`}>{children}</p>;
}

/** Brand gradient text; mirrors BRAND_GRADIENT in useContinuousGradient. */
export const GRADIENT_TEXT = "bg-[linear-gradient(90deg,#017649_0%,#03a35f_45%,#5fbf3f_100%)] bg-clip-text text-transparent";

/**
 * Renders `text` with `phrase` (when present in it) set in the brand gradient. The phrase stays one inline
 * span so the gradient runs once across it, continuing over line breaks (box-decoration-break: slice).
 */
export function HighlightTitle({ text, phrase }: { text: string; phrase?: string }) {
  const at = phrase ? text.indexOf(phrase) : -1;
  if (!phrase || at < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, at)}
      <span className={GRADIENT_TEXT}>{phrase}</span>
      {text.slice(at + phrase.length)}
    </>
  );
}

/** Section heading block: eyebrow, title and optional supporting copy. */
export function SectionIntro({
  eyebrow,
  title,
  copy,
  highlight,
  align = "left",
  className = "",
}: {
  eyebrow?: string;
  title: string;
  copy?: string;
  highlight?: string;
  align?: "left" | "center";
  className?: string;
}) {
  const center = align === "center";
  return (
    <Reveal className={`${center ? "mx-auto text-center" : ""} max-w-[640px] ${className}`}>
      {eyebrow && <Eyebrow className="mb-4">{eyebrow}</Eyebrow>}
      <h2 className="text-h2 text-balance text-ink">
        <HighlightTitle text={title} phrase={highlight} />
      </h2>
      {copy && <p className={`mt-5 text-lead text-pretty text-copy ${center ? "mx-auto" : ""} max-w-[56ch]`}>{copy}</p>}
    </Reveal>
  );
}
