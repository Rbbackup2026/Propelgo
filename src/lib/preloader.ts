"use client";

import { useSyncExternalStore } from "react";

let done = false;
const listeners = new Set<() => void>();

export function markPreloaderDone() {
  if (done) return;
  done = true;
  listeners.forEach((l) => l());
}

/** True once the intro preloader has started revealing the page. */
export function usePreloaderDone() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => done,
    () => false,
  );
}
