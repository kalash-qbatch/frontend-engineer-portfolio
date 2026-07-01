"use client";

import { motion, useSpring, useTransform } from "framer-motion";
import { memo, useEffect } from "react";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export const ScrollProgress = memo(function ScrollProgress() {
  const progress = useScrollProgress();
  const reducedMotion = useReducedMotion();
  const spring = useSpring(0, { stiffness: 120, damping: 24, mass: 0.25 });
  const width = useTransform(spring, (v) => `${v * 100}%`);

  useEffect(() => {
    spring.set(progress);
  }, [progress, spring]);

  return (
    <div
      className="pointer-events-none fixed top-0 left-0 z-[100] h-1.5 w-full bg-white/[0.06]"
      aria-hidden="true"
      role="presentation"
    >
      <motion.div
        className="scroll-progress-fill relative h-full overflow-hidden rounded-r-full"
        style={{ width: reducedMotion ? `${progress * 100}%` : width }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-violet-500 via-fuchsia-400 to-cyan-400" />
        {!reducedMotion && <div className="scroll-progress-shimmer absolute inset-0" />}
        <div className="scroll-progress-glow absolute top-1/2 right-0 h-4 w-4 -translate-y-1/2 translate-x-1/2 rounded-full bg-cyan-300/90 blur-[6px]" />
        <div className="absolute top-1/2 right-0 h-2 w-2 -translate-y-1/2 translate-x-1/2 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.9)]" />
      </motion.div>
    </div>
  );
});
