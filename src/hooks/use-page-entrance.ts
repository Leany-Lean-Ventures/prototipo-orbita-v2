import { useRef, type RefObject } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { DUR_ENTER, EASE_ENTER, prefersReducedMotion } from "@/lib/motion";

export interface PageEntranceStep {
  /** Seletor CSS, escopado ao container passado a usePageEntrance. */
  selector: string;
  vars: gsap.TweenVars;
  /** Position parameter do GSAP timeline (ex.: "-=0.15"). */
  position?: string | number;
}

/**
 * Coreografia de entrada de página (design-system §7.2): uma timeline única,
 * orquestrada, com deslocamento pequeno (8–16px) e stagger nos grupos.
 * Inclui o failsafe obrigatório (§7.3 ⚠️): se a timeline não completar em
 * ~2,5s, força o estado final — o conteúdo nunca depende de JS para
 * aparecer. Sob prefers-reduced-motion, aplica o estado final direto, sem
 * animar.
 */
export function usePageEntrance<T extends HTMLElement>(
  steps: PageEntranceStep[]
): RefObject<T> {
  const scope = useRef<T>(null);

  useGSAP(
    () => {
      if (!steps.length) return;

      if (prefersReducedMotion()) {
        steps.forEach((step) => gsap.set(step.selector, { clearProps: "all" }));
        return;
      }

      const tl = gsap.timeline({
        defaults: { ease: EASE_ENTER, duration: DUR_ENTER },
      });

      steps.forEach((step) => {
        tl.from(step.selector, step.vars, step.position);
      });

      const watchdog = window.setTimeout(() => {
        if (tl.progress() < 1) {
          tl.progress(1);
          steps.forEach((step) =>
            gsap.set(step.selector, { clearProps: "all" })
          );
        }
      }, 2500);

      return () => window.clearTimeout(watchdog);
    },
    { scope }
  );

  return scope;
}
