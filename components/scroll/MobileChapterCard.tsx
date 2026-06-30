"use client";

import { memo, type RefObject } from "react";
import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from "framer-motion";
import type { ScrollChapter } from "@/constants/scrollStory";
import { ProfileVisual } from "@/components/scroll/ProfileVisual";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

type MobileChapterCardProps = {
  chapter: ScrollChapter;
  sectionRef: RefObject<HTMLElement | null>;
  className?: string;
  pin?: boolean;
};

export const MobileChapterCard = memo(function MobileChapterCard({
  chapter,
  sectionRef,
  className,
  pin = true,
}: MobileChapterCardProps) {
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.9", "end 0.15"],
  });

  const baseRotate = chapter.rotate ?? 0;
  const rotateX = useTransform(scrollYProgress, [0, 0.45, 1], [16, 0, -12]);
  const rotateY = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [baseRotate - 14, baseRotate, baseRotate + 14]
  );
  const scale = useTransform(scrollYProgress, [0, 0.35, 0.65, 1], [0.9, 1, 1.02, 0.92]);
  const y = useTransform(scrollYProgress, [0, 0.5, 1], [48, 0, -32]);
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.18, pin ? 0.82 : 0.7, 1],
    [0, 1, 1, 0]
  );
  const blur = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [10, 0, 0, 8]);
  const shineX = useTransform(scrollYProgress, [0, 1], ["-120%", "220%"]);
  const glow = useTransform(scrollYProgress, [0, 0.5, 1], [0.15, 0.55, 0.2]);
  const filter = useMotionTemplate`blur(${blur}px)`;
  const badgeRotate = useTransform(rotateY, (value) => -value);

  if (reducedMotion) {
    return (
      <div className={cn("mb-8 w-full lg:hidden", className)}>
        <ProfileVisual chapter={chapter} size="lg" />
      </div>
    );
  }

  return (
    <div className={cn("mb-8 w-full lg:hidden", className)}>
      <div className={cn(pin ? "sticky top-[15vh] z-10 pt-6" : "relative z-10 pt-6", "[perspective:1200px]")}>
        <motion.div
          style={{ opacity, filter, y, scale, rotateX, rotateY, transformStyle: "preserve-3d" }}
          className="relative origin-center will-change-transform"
        >
          <motion.div
            className="pointer-events-none absolute -inset-3 -z-10 rounded-[1.35rem] bg-[radial-gradient(ellipse,rgba(139,92,246,0.45),transparent_68%)] blur-2xl"
            style={{ opacity: glow }}
            aria-hidden
          />

          <div className="relative overflow-hidden rounded-2xl">
            <ProfileVisual chapter={chapter} size="lg" />

            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              style={{ x: shineX }}
            />

            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-20 rounded-2xl ring-1 ring-inset ring-white/10"
              style={{ opacity: glow }}
            />
          </div>

          <motion.div
            className="absolute -right-1 -top-1 z-30 flex h-9 w-9 items-center justify-center rounded-full border border-border/80 bg-background/90 font-mono text-[10px] tracking-widest text-accent backdrop-blur-md"
            style={{ rotate: badgeRotate }}
          >
            {chapter.index}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
});
