"use client";

import { useEffect } from "react";

const EDITABLE = "input, textarea, select, [contenteditable='true']";

function isBlockedShortcut(e: KeyboardEvent) {
  if (e.key === "F12") return true;
  const mod = e.ctrlKey || e.metaKey;
  if (!mod) return false;
  // DevTools: Ctrl+Shift+I/J/C on Windows/Linux, Cmd+Option+I/J/C on macOS.
  if ((e.shiftKey || e.altKey) && ["KeyI", "KeyJ", "KeyC"].includes(e.code)) return true;
  // View source and save page.
  return e.code === "KeyU" || e.code === "KeyS";
}

/**
 * Deters casual inspection (right-click menu and DevTools/view-source shortcuts).
 * Production only, and not a security boundary: shipped code is always reachable.
 */
export function InspectGuard() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;

    const onContextMenu = (e: MouseEvent) => {
      if (e.target instanceof Element && e.target.closest(EDITABLE)) return;
      e.preventDefault();
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (!isBlockedShortcut(e)) return;
      e.preventDefault();
      e.stopPropagation();
    };

    window.addEventListener("contextmenu", onContextMenu, { capture: true });
    window.addEventListener("keydown", onKeyDown, { capture: true });
    return () => {
      window.removeEventListener("contextmenu", onContextMenu, { capture: true });
      window.removeEventListener("keydown", onKeyDown, { capture: true });
    };
  }, []);

  return null;
}
