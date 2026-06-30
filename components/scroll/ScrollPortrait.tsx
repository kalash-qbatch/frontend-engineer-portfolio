"use client";

import { memo, useMemo } from "react";
import { motion, useTransform, type MotionValue } from "framer-motion";
import { SCROLL_CHAPTERS } from "@/constants/scrollStory";
import type { ScrollChapter } from "@/constants/scrollStory";
import { ProfileVisual } from "@/components/scroll/ProfileVisual";
import { useScrollStory } from "@/hooks/useScrollStory";
import { usePortraitTracker } from "@/hooks/usePortraitTracker";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const PortraitLayers = memo(function PortraitLayers({
  fromChapter,
  toChapter,
  fromOpacity,
  toOpacity,
}: {
  fromChapter: ScrollChapter;
  toChapter: ScrollChapter;
  fromOpacity: MotionValue<number>;
  toOpacity: MotionValue<number>;
}) {
  return (
    <div className="relative h-full w-full">
      <motion.div className="absolute inset-0" style={{ opacity: fromOpacity }}>
        <ProfileVisual chapter={fromChapter} size="fill" />
      </motion.div>
      <motion.div className="absolute inset-0" style={{ opacity: toOpacity }}>
        <ProfileVisual chapter={toChapter} size="fill" />
      </motion.div>
    </div>
  );
});

export const ScrollPortrait = memo(function ScrollPortrait() {
  const { anchorsRef } = useScrollStory();
  const { x, y, width, height, blend, rotate, visibility, anchorX, fromIndex, toIndex } =
    usePortraitTracker(anchorsRef);
  const reducedMotion = useReducedMotion();

  const fromChapter = useMemo(
    () => SCROLL_CHAPTERS[fromIndex] ?? SCROLL_CHAPTERS[0],
    [fromIndex]
  );
  const toChapter = useMemo(
    () => SCROLL_CHAPTERS[toIndex] ?? fromChapter,
    [toIndex, fromChapter]
  );

  const fromOpacity = useTransform(blend, [0, 1], [1, 0]);
  const toOpacity = useTransform(blend, [0, 1], [0, 1]);
  const translateX = useTransform(anchorX, [0, 1], ["0%", "-100%"]);

  return (
    <div className="hidden lg:contents">
      <motion.div
        className="pointer-events-none fixed z-30 block -translate-y-1/2 will-change-[transform,opacity]"
        style={{
          left: x,
          top: y,
          width,
          height,
          translateX,
          rotate: reducedMotion ? 0 : rotate,
          opacity: visibility,
        }}
      >
        <PortraitLayers
          fromChapter={fromChapter}
          toChapter={toChapter}
          fromOpacity={fromOpacity}
          toOpacity={toOpacity}
        />
      </motion.div>
    </div>
  );
});
