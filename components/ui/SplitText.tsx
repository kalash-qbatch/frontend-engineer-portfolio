"use client";

import { motion, type Variants } from "framer-motion";
import { useEffect, useState, memo } from "react";
import {
  charReveal,
  charRevealSpring,
  reducedMotionFade,
  STAGGER,
  transition,
  wordRevealSpring,
} from "@/lib/motion";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

interface SplitTextProps {
  text: string;
  as?: "h1" | "h2" | "p" | "span";
  className?: string;
  delay?: number;
  by?: "char" | "word";
  accent?: boolean;
}

export const SplitText = memo(function SplitText({
  text,
  as: Tag = "span",
  className,
  delay = 0,
  by = "word",
  accent = false,
}: SplitTextProps) {
  const reducedMotion = useReducedMotion();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const mobileMotion = mounted && isMobile;
  const parts = by === "char" ? text.split("") : text.split(" ");
  const variants: Variants = mobileMotion
    ? by === "char"
      ? charRevealSpring
      : wordRevealSpring
    : charReveal;
  const stagger = mobileMotion ? STAGGER.loose : STAGGER.tight;

  if (reducedMotion) {
    return (
      <Tag className={className}>
        <motion.span initial="hidden" animate="visible" variants={reducedMotionFade}>
          {text}
        </motion.span>
      </Tag>
    );
  }

  return (
    <Tag
      className={cn(
        by === "word" ? "inline-flex flex-nowrap items-baseline gap-x-[0.32em]" : "inline",
        className
      )}
      style={mobileMotion && by === "word" ? { perspective: 900 } : undefined}
      aria-label={text}
    >
      {parts.map((part, i) => (
        <motion.span
          key={`${part}-${i}`}
          initial="hidden"
          animate="visible"
          variants={variants}
          transition={
            mobileMotion
              ? { delay: delay + i * stagger }
              : { ...transition, delay: delay + i * stagger }
          }
          className={cn(
            "inline-block",
            accent &&
              mobileMotion &&
              "bg-gradient-to-r from-foreground via-violet-300 to-foreground bg-[length:200%_auto] bg-clip-text text-transparent animate-[shimmer_3s_linear_infinite]"
          )}
          style={{
            transformOrigin: by === "word" ? "bottom center" : "center bottom",
            whiteSpace: part === " " ? "pre" : undefined,
          }}
          aria-hidden={part !== " "}
        >
          {part === " " ? "\u00A0" : part}
        </motion.span>
      ))}
    </Tag>
  );
});
