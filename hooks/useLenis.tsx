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
  hasHomeSectionHash,
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

const LENIS_PRESETS = {
  default: {
    lerp: 0.075,
    duration: 1.2,
    wheelMultiplier: 0.9,
    touchMultiplier: 1.5,
    syncTouchLerp: 0.1,
    anchorDuration: 1.1,
  },
  relaxed: {
    lerp: 0.1,
    duration: 1.45,
    wheelMultiplier: 0.82,
    touchMultiplier: 1.35,
    syncTouchLerp: 0.12,
    anchorDuration: 1.35,
  },
} as const;

export function LenisProvider({
  children,
  enabled,
  preset = "default",
}: {
  children: ReactNode;
  enabled: boolean;
  preset?: keyof typeof LENIS_PRESETS;
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

      const tuning = LENIS_PRESETS[preset];

      instance = new LenisCtor({
        autoRaf: true,
        lerp: tuning.lerp,
        duration: tuning.duration,
        smoothWheel: true,
        wheelMultiplier: tuning.wheelMultiplier,
        touchMultiplier: tuning.touchMultiplier,
        syncTouch: true,
        syncTouchLerp: tuning.syncTouchLerp,
        infinite: false,
        anchors: {
          offset: SCROLL_NAV_OFFSET,
          duration: tuning.anchorDuration,
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
  }, [enabled, reducedMotion, preset]);

  const scrollTo = useCallback((target: ScrollTarget) => {
    const anchorDuration = preset === "relaxed" ? 1.35 : 1.1;
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
          duration: anchorDuration,
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
  }, [preset]);

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

    const bootTimer = window.setTimeout(scrollToHash, hasHomeSectionHash() ? 80 : 300);
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
