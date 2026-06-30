"use client";

import type Lenis from "lenis";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useReducedMotion } from "./useReducedMotion";

type LenisContextValue = {
  lenis: Lenis | null;
  scrollTo: (target: string | HTMLElement | number, offset?: number) => void;
};

const LenisContext = createContext<LenisContextValue>({
  lenis: null,
  scrollTo: () => {},
});

export function LenisProvider({
  children,
  enabled,
}: {
  children: ReactNode;
  enabled: boolean;
}) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!enabled || reducedMotion) return;

    let instance: Lenis | null = null;
    let cancelled = false;
    let resize: (() => void) | undefined;
    let t1: ReturnType<typeof setTimeout>;
    let t2: ReturnType<typeof setTimeout>;

    void import("lenis").then(({ default: LenisCtor }) => {
      if (cancelled) return;

      instance = new LenisCtor({
        autoRaf: true,
        lerp: 0.075,
        duration: 1.2,
        smoothWheel: true,
        wheelMultiplier: 0.9,
        touchMultiplier: 1.5,
        syncTouch: true,
        syncTouchLerp: 0.1,
        infinite: false,
      });

      setLenis(instance);

      resize = () => instance?.resize();
      requestAnimationFrame(resize);
      t1 = setTimeout(resize, 150);
      t2 = setTimeout(resize, 600);
      window.addEventListener("resize", resize);
    });

    return () => {
      cancelled = true;
      clearTimeout(t1);
      clearTimeout(t2);
      if (resize) window.removeEventListener("resize", resize);
      instance?.destroy();
      setLenis(null);
    };
  }, [enabled, reducedMotion]);

  const scrollTo = useCallback(
    (target: string | HTMLElement | number, offset = -88) => {
      if (lenis) {
        lenis.scrollTo(target, { offset, duration: 1.1 });
        return;
      }
      if (typeof target === "number") {
        window.scrollTo({ top: target, behavior: "smooth" });
        return;
      }
      const el = typeof target === "string" ? document.querySelector(target) : target;
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    [lenis]
  );

  return (
    <LenisContext.Provider value={{ lenis, scrollTo }}>
      {children}
    </LenisContext.Provider>
  );
}

export function useLenis() {
  return useContext(LenisContext);
}
