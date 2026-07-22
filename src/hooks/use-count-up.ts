import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { EASE_ENTER, prefersReducedMotion } from "@/lib/motion";

const formatter = new Intl.NumberFormat("pt-BR");

/**
 * Count-up de KPI (design-system §7.2): número sobe de 0 ao valor final
 * em ~0.6s com snap inteiro, formatado com separador de milhar pt-BR.
 * Sob prefers-reduced-motion, mostra o valor final direto.
 */
export function useCountUp(targetValue: number) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    if (!ref.current) return;

    if (prefersReducedMotion()) {
      ref.current.textContent = formatter.format(targetValue);
      return;
    }

    const proxy = { value: 0 };
    gsap.to(proxy, {
      value: targetValue,
      duration: 0.6,
      ease: EASE_ENTER,
      snap: { value: 1 },
      onUpdate: () => {
        if (ref.current) {
          ref.current.textContent = formatter.format(proxy.value);
        }
      },
    });
  }, [targetValue]);

  return ref;
}
