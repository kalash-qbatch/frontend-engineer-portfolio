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
  resolveScrollPosition,
  emitSectionNavigate,
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

  const scrollTo = useCallback((target: ScrollTarget) => {
    const refineTarget = (instance: Lenis, delays = [350, 800, 1400]) => {
      delays.forEach((ms) => {
        window.setTimeout(() => {
          instance.resize();
          const refined = resolveScrollPosition(target, instance.scroll);
          if (refined !== null && Math.abs(instance.scroll - refined) > 12) {
            instance.scrollTo(refined, {
              offset: 0,
              duration: 0.45,
              force: true,
            });
          }
        }, ms);
      });
    };

    const attemptScroll = (attempt = 0) => {
      const instance = lenisRef.current;
      instance?.resize();

      const resolved = resolveScrollPosition(
        target,
        instance?.scroll ?? window.scrollY
      );

      if (resolved === null) {
        if (attempt < SCROLL_MAX_ATTEMPTS) {
          window.setTimeout(() => attemptScroll(attempt + 1), SCROLL_RETRY_MS);
        }
        return;
      }

      if (instance) {
        instance.scrollTo(resolved, {
          offset: 0,
          duration: 1.1,
          force: true,
          onComplete: () => {
            instance?.resize();
            const refined = resolveScrollPosition(
              target,
              instance?.scroll ?? window.scrollY
            );
            if (
              refined !== null &&
              instance &&
              Math.abs(instance.scroll - refined) > 12
            ) {
              instance.scrollTo(refined, {
                offset: 0,
                duration: 0.45,
                force: true,
              });
            }
            if (instance) refineTarget(instance);
          },
        });
        refineTarget(instance);
        return;
      }

      if (attempt < SCROLL_MAX_ATTEMPTS) {
        window.setTimeout(() => attemptScroll(attempt + 1), SCROLL_RETRY_MS);
        return;
      }

      nativeScrollTo(resolved);
    };

    attemptScroll();
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const scrollToHash = () => {
      const hash = window.location.hash;
      if (!hash) return;
      emitSectionNavigate(hash.slice(1));
      scrollTo(hash);
    };

    const onPopState = () => {
      const hash = window.location.hash;
      if (hash) emitSectionNavigate(hash.slice(1));
      scrollTo(hash || 0);
    };

    const bootTimer = window.setTimeout(scrollToHash, 300);
    window.addEventListener("hashchange", scrollToHash);
    window.addEventListener("popstate", onPopState);

    return () => {
      clearTimeout(bootTimer);
      window.removeEventListener("hashchange", scrollToHash);
      window.removeEventListener("popstate", onPopState);
    };
  }, [enabled, scrollTo]);

  return (
    <LenisContext.Provider value={{ lenis, scrollTo }}>
      {children}
    </LenisContext.Provider>
  );
}

export function useLenis() {
  return useContext(LenisContext);
}
