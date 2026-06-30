"use client";

import Image from "next/image";
import { motion, type MotionValue } from "framer-motion";
import { memo } from "react";
import { IMAGE_FRAMING } from "@/constants/images";
import { SITE } from "@/constants/site";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

type HeroPortraitProps = {
  className?: string;
  parallaxY?: MotionValue<number>;
};

export const HeroPortrait = memo(function HeroPortrait({
  className,
  parallaxY,
}: HeroPortraitProps) {
  return (
    <motion.div
      style={parallaxY ? { y: parallaxY } : undefined}
      className={cn(
        "pointer-events-none absolute inset-y-0 right-0 z-[3] hidden w-[min(50vw,640px)] md:block",
        className
      )}
      aria-hidden
    >
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.2, ease: EASE, delay: 0.4 }}
        className="relative h-full w-full"
      >
        <div
          className="absolute inset-y-0 right-0 w-full bg-[radial-gradient(ellipse_at_70%_42%,rgba(139,92,246,0.18),transparent_72%)]"
          aria-hidden
        />

        <div className="absolute inset-x-0 bottom-0 top-16 flex items-end justify-center pr-4">
          <Image
            src={SITE.heroPortraitImage}
            alt=""
            width={433}
            height={576}
            priority
            className={cn(
              "h-[min(78vh,820px)] w-auto max-w-full drop-shadow-[0_24px_80px_rgba(0,0,0,0.65)]",
              IMAGE_FRAMING.heroCutout
            )}
            sizes="(max-width: 1280px) 50vw, 640px"
          />
        </div>

        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 1.1 }}
          className="absolute bottom-36 right-8 rounded-lg border border-border/80 bg-background/70 px-3 py-2 backdrop-blur-md"
        >
          <p className="font-mono text-[9px] tracking-widest text-muted uppercase">Based in</p>
          <p className="text-xs font-medium">{SITE.location}</p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
});
