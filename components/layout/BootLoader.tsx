"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { HeroBlobFallback } from "@/components/canvas/HeroBlobScene";
import { SITE } from "@/constants/site";
import { ProfileAvatar } from "@/components/ui/ProfileAvatar";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { EASE } from "@/lib/motion";

interface BootLoaderProps {
  onComplete: () => void;
}

const MIN_DISPLAY_MS = 1500;

export function BootLoader({ onComplete }: BootLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const [canSkip, setCanSkip] = useState(false);
  const reducedMotion = useReducedMotion();

  const finish = useCallback(() => {
    setVisible(false);
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      onComplete();
      return;
    }

    const skipTimer = setTimeout(() => setCanSkip(true), MIN_DISPLAY_MS);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          finish();
          return 100;
        }
        return prev + 4;
      });
    }, 45);

    return () => {
      clearTimeout(skipTimer);
      clearInterval(interval);
    };
  }, [reducedMotion, onComplete, finish]);

  if (reducedMotion) return null;

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {visible && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: EASE }}
          className="fixed inset-0 z-[200] flex cursor-pointer items-center justify-center overflow-hidden"
          onClick={() => canSkip && finish()}
          role="button"
          aria-label={canSkip ? "Skip loading" : "Loading"}
        >
          <div className="absolute inset-0 bg-background/75 backdrop-blur-3xl backdrop-saturate-150" aria-hidden />
          {/* <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
            <HeroBlobFallback />
          </div> */}

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.05 }}
            className="relative z-10 flex flex-col items-center rounded-2xl border border-border/70 bg-background/80 px-8 py-7 text-center shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-md"
          >
            <ProfileAvatar size="sm" shape="rounded" imageKey="outdoor" priority className="mb-4" />
            <p className="font-display text-xl font-bold tracking-tight md:text-2xl">
              {SITE.name}
            </p>
            <p className="mt-2 font-mono text-[10px] tracking-[0.22em] text-muted uppercase md:text-[11px]">
              Portfolio getting ready
            </p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-6 font-display text-2xl font-bold tracking-tight"
            >
              {progress}%
            </motion.p>
            {canSkip && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 font-mono text-[10px] tracking-[0.2em] text-muted uppercase"
              >
                Click to enter
              </motion.p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
