"use client";

import { useEffect, useState } from "react";
import { useLenis } from "@/hooks/useLenis";

export function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  const { lenis } = useLenis();

  useEffect(() => {
    const update = () => {
      const scrollTop = lenis?.scroll ?? window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? scrollTop / docHeight : 0);
    };

    update();
    lenis?.on("scroll", update);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });

    return () => {
      lenis?.off("scroll", update);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [lenis]);

  return progress;
}
