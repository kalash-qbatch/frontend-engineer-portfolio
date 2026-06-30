"use client";

import { useEffect } from "react";
import { useLenis } from "@/hooks/useLenis";

/** Recalculate Lenis scroll bounds after dynamic content mounts */
export function LenisResizeOnMount() {
  const { lenis } = useLenis();

  useEffect(() => {
    if (!lenis) return;
    const resize = () => lenis.resize();
    resize();
    const t = setTimeout(resize, 300);
    return () => clearTimeout(t);
  }, [lenis]);

  return null;
}
