import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

afterEach(() => {
  cleanup();
});

// jsdom lacks IntersectionObserver and matchMedia.
class MockIntersectionObserver {
  readonly root = null;
  readonly rootMargin = "";
  readonly thresholds = [];
  constructor(private callback: IntersectionObserverCallback) {}
  observe(target: Element) {
    this.callback([{ isIntersecting: true, target, intersectionRatio: 1 } as IntersectionObserverEntry], this as never);
  }
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}
vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);

export function setReducedMotion(reduce: boolean) {
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: reduce && query.includes("prefers-reduced-motion"),
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }));
}
setReducedMotion(false);

// jsdom lacks the Web Animations API used by motion/react-mini.
if (!Element.prototype.animate) {
  Element.prototype.animate = function animate() {
    const animation = {
      currentTime: 0,
      playbackRate: 1,
      playState: "finished",
      startTime: 0,
      effect: null,
      timeline: null,
      onfinish: null as null | (() => void),
      oncancel: null,
      finished: Promise.resolve(),
      cancel() {},
      finish() {},
      play() {},
      pause() {},
      reverse() {},
      commitStyles() {},
      persist() {},
      updatePlaybackRate() {},
      addEventListener() {},
      removeEventListener() {},
    };
    return animation as unknown as Animation;
  };
}
