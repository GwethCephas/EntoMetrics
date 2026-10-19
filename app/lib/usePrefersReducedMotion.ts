import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(callback: () => void) {
  if (typeof window === "undefined" || !window.matchMedia) return () => {};
  const media = window.matchMedia(QUERY);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}

function getSnapshot() {
  return typeof window !== "undefined" && !!window.matchMedia?.(QUERY).matches;
}

/**
 * Hydration-safe reduced-motion preference: false on the server and during
 * hydration, then the real value. Animated components treat `true` as
 * "render the final state immediately, with no movement".
 */
export function usePrefersReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
