import "@testing-library/jest-dom";

/**
 * jsdom não implementa matchMedia. Necessário para o gsap.matchMedia()
 * usado em src/lib/motion.ts (registro do ScrollTrigger, reduced-motion)
 * e para qualquer código que consulte prefers-reduced-motion/color-scheme.
 */
if (typeof window !== "undefined" && !window.matchMedia) {
  window.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}
