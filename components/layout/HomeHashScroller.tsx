"use client";

import { useEffect } from "react";
import { useLenis } from "@/hooks/useLenis";
import { emitSectionNavigate } from "@/lib/scroll-target";

/** Smoothly refines scroll position after Lenis mounts (instant jump happens earlier). */
export function HomeHashScroller({ sectionId }: { sectionId: string | null }) {
  const { scrollTo, lenis } = useLenis();

  useEffect(() => {
    if (!sectionId || !lenis) return;

    emitSectionNavigate(sectionId);
    scrollTo(`#${sectionId}`);

    const timers = [200, 600, 1200].map((ms) =>
      window.setTimeout(() => scrollTo(`#${sectionId}`), ms)
    );

    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [sectionId, lenis, scrollTo]);

  return null;
}
