import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { EASE_ENTER, prefersReducedMotion } from "@/lib/motion";

const formatter = new Intl.NumberFormat("pt-BR");

/**
 * Count-up de KPI (design-system §7.2): número sobe do valor anterior ao
 * novo valor em ~0.6s com snap inteiro, formatado com separador de milhar pt-BR.
 * Sob prefers-reduced-motion, mostra o valor final direto.
 *
 * Bugs corrigidos vs. versão original:
 *   (a) Sempre animava a partir do zero — agora anima do valor exibido anteriormente.
 *   (b) useGSAP não matava o tween anterior ao mudar a dependência, acumulando
 *       tweens concorrentes que escrevem no mesmo textContent e param no valor errado.
 *       Agora o tween anterior é morto explicitamente antes de criar o próximo.
 */
export function useCountUp(targetValue: number) {
  const ref = useRef<HTMLSpanElement>(null);
  /** Valor exibido no momento do último render — anima a partir daqui. */
  const prevValueRef = useRef<number>(0);
  /** Handle do tween ativo — para matar antes de criar o próximo. */
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useGSAP(() => {
    if (!ref.current) return;

    if (prefersReducedMotion()) {
      prevValueRef.current = targetValue;
      ref.current.textContent = formatter.format(targetValue);
      return;
    }

    // Matar tween anterior antes de criar o próximo (evita tweens empilhados).
    tweenRef.current?.kill();

    const proxy = { value: prevValueRef.current };
    tweenRef.current = gsap.to(proxy, {
      value: targetValue,
      duration: 0.6,
      ease: EASE_ENTER,
      snap: { value: 1 },
      onUpdate: () => {
        if (ref.current) {
          ref.current.textContent = formatter.format(proxy.value);
        }
      },
      onComplete: () => {
        prevValueRef.current = targetValue;
      },
    });
  }, [targetValue]);

  return ref;
}
