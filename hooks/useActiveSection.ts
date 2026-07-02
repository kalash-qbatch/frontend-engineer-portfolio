"use client";

import { useEffect, useRef, useState } from "react";
import {
  PAGE_SECTION_IDS,
  SECTION_NAV_EVENT,
  getScrollY,
  resolveActiveSection,
} from "@/lib/scroll-target";
import { useLenis } from "@/hooks/useLenis";

const NAV_PIN_MS = 1300;
const ACTIVE_ROOT_MARGIN = "-18% 0px -58% 0px";

function syncHash(sectionId: string) {
  if (sectionId === "hero") {
    if (window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname);
    }
    return;
  }

  const hash = `#${sectionId}`;
  if (window.location.hash !== hash) {
    window.history.replaceState(null, "", hash);
  }
}

export function useActiveSection(sectionIds: readonly string[] = PAGE_SECTION_IDS) {
  const [activeId, setActiveId] = useState(() => {
    if (typeof window === "undefined") return sectionIds[0];
    const hash = window.location.hash.slice(1);
    if (hash && sectionIds.includes(hash) && window.scrollY > 120) {
      return hash;
    }
    return sectionIds[0];
  });
  const { lenis } = useLenis();
  const pinnedUntilRef = useRef(0);
  const visibleRatiosRef = useRef(new Map<string, number>());

  useEffect(() => {
    const applyActive = (next: string, syncUrl = true) => {
      setActiveId((prev) => (prev === next ? prev : next));
      const pinned = Date.now() < pinnedUntilRef.current;
      if (syncUrl && !pinned) {
        syncHash(next);
      }
    };

    const isHeroDominant = () => {
      const heroEl = document.getElementById("hero");
      if (!heroEl) return false;
      const rect = heroEl.getBoundingClientRect();
      return rect.top >= -32 && rect.bottom > window.innerHeight * 0.5;
    };

    const pickActive = () => {
      const scrollY = getScrollY(lenis?.scroll);
      const pinned = Date.now() < pinnedUntilRef.current;
      const urlHash = window.location.hash.slice(1);

      if (pinned && urlHash && sectionIds.includes(urlHash)) {
        applyActive(urlHash, false);
        return;
      }

      if (!pinned && (scrollY < 120 || isHeroDominant())) {
        applyActive("hero");
        return;
      }

      let bestId = "";
      let bestRatio = 0;

      for (const id of sectionIds) {
        const ratio = visibleRatiosRef.current.get(id) ?? 0;
        if (ratio > bestRatio) {
          bestRatio = ratio;
          bestId = id;
        }
      }

      if (bestRatio > 0) {
        applyActive(bestId);
        return;
      }

      applyActive(resolveActiveSection(sectionIds, scrollY));
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visibleRatiosRef.current.set(entry.target.id, entry.intersectionRatio);
        }
        pickActive();
      },
      {
        root: null,
        rootMargin: ACTIVE_ROOT_MARGIN,
        threshold: [0, 0.05, 0.1, 0.2, 0.35, 0.5, 0.75, 1],
      }
    );

    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    const onNavigate = (event: Event) => {
      const sectionId = (event as CustomEvent<{ sectionId: string }>).detail.sectionId;
      if (!sectionIds.includes(sectionId)) return;
      pinnedUntilRef.current = Date.now() + NAV_PIN_MS;
      applyActive(sectionId, false);
      if (sectionId === "hero") {
        syncHash("hero");
      } else {
        const hash = `#${sectionId}`;
        if (window.location.hash !== hash) {
          window.history.replaceState(null, "", hash);
        }
      }
    };

    pickActive();
    window.addEventListener(SECTION_NAV_EVENT, onNavigate);
    window.addEventListener("scroll", pickActive, { passive: true });
    lenis?.on("scroll", pickActive);

    return () => {
      observer.disconnect();
      window.removeEventListener(SECTION_NAV_EVENT, onNavigate);
      window.removeEventListener("scroll", pickActive);
      lenis?.off("scroll", pickActive);
    };
  }, [lenis, sectionIds]);

  return activeId;
}
