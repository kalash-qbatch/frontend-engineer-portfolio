"use client";

import type Lenis from "lenis";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  nativeScrollTo,
  resolveScrollElement,
  SCROLL_MAX_ATTEMPTS,
  SCROLL_NAV_OFFSET,
  SCROLL_RETRY_MS,
  type ScrollTarget,
} from "@/lib/scroll-target";
import { useReducedMotion } from "./useReducedMotion";

type LenisContextValue = {
  lenis: Lenis | null;
  scrollTo: (target: ScrollTarget, offset?: number) => void;
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
  const lenisRef = useRef<Lenis | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    lenisRef.current = lenis;
  }, [lenis]);

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
        anchors: {
          offset: SCROLL_NAV_OFFSET,
          duration: 1.1,
        },
      });

      lenisRef.current = instance;
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
      lenisRef.current = null;
      setLenis(null);
    };
  }, [enabled, reducedMotion]);

  const scrollTo = useCallback((target: ScrollTarget, offset = SCROLL_NAV_OFFSET) => {
    const attemptScroll = (attempt = 0) => {
      const resolved =
        typeof target === "number" || target instanceof HTMLElement
          ? target
          : resolveScrollElement(target);

      if (resolved === null) {
        if (attempt < SCROLL_MAX_ATTEMPTS) {
          window.setTimeout(() => attemptScroll(attempt + 1), SCROLL_RETRY_MS);
        }
        return;
      }

      const instance = lenisRef.current;

      if (instance) {
        instance.resize();
        instance.scrollTo(resolved, {
          offset,
          duration: 1.1,
          force: true,
        });
        return;
      }

      if (attempt < SCROLL_MAX_ATTEMPTS) {
        window.setTimeout(() => attemptScroll(attempt + 1), SCROLL_RETRY_MS);
        return;
      }

      nativeScrollTo(resolved, offset);
    };

    attemptScroll();
  }, []);

  return (
    <LenisContext.Provider value={{ lenis, scrollTo }}>
      {children}
    </LenisContext.Provider>
  );
}

export function useLenis() {
  return useContext(LenisContext);
}
