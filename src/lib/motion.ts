import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Tokens de motion — espelham design-system/context/input-DESIGN.md §7.1
 * e as CSS custom properties equivalentes em src/index.css.
 */
export const EASE_MICRO = "power1.out"; // hover, press, focus
export const EASE_ENTER = "power2.out"; // entradas padrão
export const EASE_SIGNATURE = "back.out(1.4)"; // entrada de KPIs — único easing expressivo

export const DUR_MICRO = 0.175; // 0.15–0.2s
export const DUR_BASE = 0.275; // 0.25–0.3s
export const DUR_ENTER = 0.45; // 0.4–0.5s
export const STAGGER_LIST = 0.06; // 0.03–0.06s/item, máx. ~8 itens

export function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Rede de segurança global (§7.5): sob prefers-reduced-motion, acelera
 * qualquer timeline/tween GSAP que não tenha um tratamento explícito
 * (ex.: microinterações futuras via gsap.quickTo). Entradas de página têm
 * tratamento dedicado em usePageEntrance — não dependem só disto.
 */
const mm = gsap.matchMedia();
mm.add("(prefers-reduced-motion: reduce)", () => {
  gsap.globalTimeline.timeScale(100);
});
