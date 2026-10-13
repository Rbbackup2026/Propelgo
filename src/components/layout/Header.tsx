"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { nav } from "@/content/home";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Chevron } from "@/components/ui/icons";
import { ProductGlyph } from "@/components/ui/ProductGlyph";

type MenuKey = "products" | "solutions" | "resources" | "company";

const menus: { key: MenuKey; label: string }[] = [
  { key: "products", label: "Products" },
  { key: "solutions", label: "Solutions" },
  { key: "resources", label: "Resources" },
  { key: "company", label: "Company" },
];

const glyphs = ["versa", "odcc", "orchestration"] as const;
const ease = [0.16, 1, 0.3, 1] as const;

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState<MenuKey | null>(null);
  const [mobile, setMobile] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = mobile ? "hidden" : "";
  }, [mobile]);

  const enter = (key: MenuKey) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(key);
  };
  const leave = () => {
    closeTimer.current = setTimeout(() => setOpen(null), 140);
  };

  const solid = scrolled || open !== null || mobile;

  return (
    <header className="fixed inset-x-0 top-0 z-50" onMouseLeave={leave}>
      <div
        className={`border-b transition-[background-color,border-color] duration-300 ${
          solid ? "border-line bg-white/90 backdrop-blur-xl" : "border-transparent bg-transparent"
        }`}
      >
        <div className="container-page flex h-[72px] items-center justify-between">
          <Link href="/" aria-label="PropelGo home" className="shrink-0">
            <Logo className="h-8 w-auto" />
          </Link>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {menus.map((m) => (
                <li key={m.key} onMouseEnter={() => enter(m.key)}>
                  <button
                    type="button"
                    aria-expanded={open === m.key}
                    onClick={() => setOpen(open === m.key ? null : m.key)}
                    className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-[15px] transition-colors ${
                      open === m.key ? "bg-surface text-ink" : "text-copy hover:text-ink"
                    }`}
                  >
                    {m.label}
                    <Chevron className={`size-2.5 transition-transform duration-300 ${open === m.key ? "rotate-180" : ""}`} />
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <Button href="/contact" size="sm" arrow={false}>
                Talk to Us
              </Button>
            </div>
            <button
              type="button"
              aria-label={mobile ? "Close menu" : "Open menu"}
              aria-expanded={mobile}
              onClick={() => setMobile((v) => !v)}
              className="relative grid size-10 place-items-center rounded-full ring-1 ring-line lg:hidden"
            >
              <span className={`absolute h-[1.5px] w-4 bg-ink transition-transform duration-300 ${mobile ? "rotate-45" : "-translate-y-[3px]"}`} />
              <span className={`absolute h-[1.5px] w-4 bg-ink transition-transform duration-300 ${mobile ? "-rotate-45" : "translate-y-[3px]"}`} />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4, transition: { duration: 0.15 } }}
            transition={{ duration: 0.35, ease }}
            onMouseEnter={() => open && enter(open)}
            className="absolute inset-x-0 top-[72px] hidden lg:block"
          >
            <div className="container-page">
              <div className="mt-2 overflow-hidden rounded-2xl border border-line bg-white shadow-[0_24px_60px_-24px_rgba(31,31,31,0.18)]">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={open}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}
                  >
                    <MenuPanel kind={open} />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>{mobile && <MobileMenu onClose={() => setMobile(false)} />}</AnimatePresence>
    </header>
  );
}

function MenuPanel({ kind }: { kind: MenuKey }) {
  if (kind === "products") {
    return (
      <div className="grid grid-cols-[1.4fr_1fr]">
        <ul className="grid gap-1 p-3">
          {nav.products.map((p, i) => (
            <li key={p.name}>
              <Link href={p.href} className="group flex items-start gap-4 rounded-xl p-4 transition-colors hover:bg-surface">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-mist text-forest ring-1 ring-mint">
                  <ProductGlyph kind={glyphs[i]} className="size-7" />
                </span>
                <span className="flex-1">
                  <span className="flex items-center gap-2 text-[16px] font-semibold text-ink">
                    {p.name}
                    <span className="text-[13px] font-normal text-sub">{p.tag}</span>
                  </span>
                  <span className="mt-1 block text-[14px] text-copy">{p.line}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="m-3 ml-0 flex flex-col justify-between rounded-xl bg-mist p-7">
          <div>
            <p className="text-[14px] font-medium text-brand">How it fits together</p>
            <p className="mt-2 max-w-[24ch] text-[20px] leading-snug font-semibold tracking-[-0.015em] text-ink">
              Credit, cards and vendor payments on one orchestration layer.
            </p>
          </div>
          <Link href="/#products" className="mt-6 inline-flex items-center gap-1.5 text-[14px] font-medium text-link">
            See the platform <ArrowRight />
          </Link>
        </div>
      </div>
    );
  }

  if (kind === "solutions") {
    return (
      <div className="grid grid-cols-[1fr_1fr_1.1fr] gap-4 p-8">
        <MenuColumn title="By use case" links={nav.solutions.useCases} />
        <MenuColumn title="By industry" links={nav.solutions.industries} />
        <div className="rounded-xl bg-mist p-6">
          <p className="text-[14px] font-medium text-brand">Not sure where to start?</p>
          <p className="mt-2 text-[15px] leading-relaxed text-copy">
            Tell us how your business pays today. We&apos;ll map it to the right PropelGo capability.
          </p>
          <Link href="/contact" className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-medium text-link">
            Talk to Us <ArrowRight />
          </Link>
        </div>
      </div>
    );
  }

  const items = kind === "resources" ? nav.resources : nav.company;
  return (
    <ul className="grid grid-cols-3 gap-1 p-3">
      {items.map((r) => (
        <li key={r.name}>
          <Link href={r.href} className="block rounded-xl p-5 transition-colors hover:bg-surface">
            <span className="text-[16px] font-semibold text-ink">{r.name}</span>
            <span className="mt-1 block text-[14px] text-copy">{r.line}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

function MenuColumn({ title, links }: { title: string; links: { name: string; href: string }[] }) {
  return (
    <div>
      <p className="text-[13px] font-medium text-sub">{title}</p>
      <ul className="mt-3 space-y-0.5">
        {links.map((l) => (
          <li key={l.name}>
            <Link href={l.href} className="-mx-3 block rounded-lg px-3 py-2 text-[15px] text-ink transition-colors hover:bg-surface">
              {l.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MobileMenu({ onClose }: { onClose: () => void }) {
  const groups = [
    { title: "Products", links: nav.products.map((p) => ({ name: p.name, href: p.href })) },
    { title: "Solutions", links: [...nav.solutions.useCases, ...nav.solutions.industries] },
    { title: "Resources", links: nav.resources },
    { title: "Company", links: nav.company },
  ];
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-x-0 top-[72px] bottom-0 overflow-y-auto bg-white px-5 pb-10 lg:hidden"
    >
      {groups.map((g, gi) => (
        <motion.div
          key={g.title}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.04 * gi, duration: 0.45, ease }}
          className="border-b border-line py-6"
        >
          <p className="text-[13px] font-medium text-sub">{g.title}</p>
          <ul className="mt-3 space-y-2.5">
            {g.links.map((l) => (
              <li key={l.name}>
                <Link href={l.href} onClick={onClose} className="text-[19px] text-ink">
                  {l.name}
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>
      ))}
      <div className="pt-8">
        <Button href="/contact" size="lg" className="w-full">
          Talk to Us
        </Button>
      </div>
    </motion.div>
  );
}
