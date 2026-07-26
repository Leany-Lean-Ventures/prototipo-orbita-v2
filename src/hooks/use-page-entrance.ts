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

      // Resolve os elementos uma vez, já escopados — evita depender do
      // escopo de seletor do gsap.context dentro de callbacks assíncronos
      // (onComplete/setTimeout rodam fora da função do contexto).
      const groups = steps
        .map((step) => ({
          step,
          els: gsap.utils.toArray<HTMLElement>(step.selector, scope.current),
        }))
        .filter((g) => g.els.length > 0);

      if (!groups.length) return;

      const allEls = groups.flatMap((g) => g.els);

      /** Estado final = sem estilo inline; o repouso é 100% do CSS. */
      const aplicarEstadoFinal = () => gsap.set(allEls, { clearProps: "all" });

      if (prefersReducedMotion()) {
        aplicarEstadoFinal();
        return;
      }

      // ⚠️ Card `interactive` traz `transition-[transform,box-shadow]` para o
      // hover lift. Se o GSAP animar `transform` enquanto essa transition
      // está ativa, as duas engines disputam a mesma propriedade e o tween
      // congela perto do valor inicial — os containers ficam deslocados para
      // sempre (ver MEMORY.md). Regra do design-system: CSS cuida de
      // hover/foco/press, GSAP cuida de orquestração — nunca os dois na mesma
      // propriedade ao mesmo tempo. Desligamos a transition durante a entrada
      // e devolvemos o controle ao CSS no estado final.
      gsap.set(allEls, { transition: "none" });

      const tl = gsap.timeline({
        defaults: { ease: EASE_ENTER, duration: DUR_ENTER },
        onComplete: aplicarEstadoFinal,
      });

      groups.forEach(({ step, els }) => {
        tl.from(els, step.vars, step.position);
      });

      const watchdog = window.setTimeout(() => {
        if (tl.progress() < 1) tl.progress(1);
        aplicarEstadoFinal();
      }, 2500);

      return () => window.clearTimeout(watchdog);
    },
    { scope }
  );

  return scope;
}
