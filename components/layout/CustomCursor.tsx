"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function CustomCursor() {
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const reducedMotion = useReducedMotion();
  const isTouch = useMediaQuery("(pointer: coarse)");

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const ringX = useSpring(cursorX, { stiffness: 180, damping: 22 });
  const ringY = useSpring(cursorY, { stiffness: 180, damping: 22 });
  const dotX = useSpring(cursorX, { stiffness: 400, damping: 30 });
  const dotY = useSpring(cursorY, { stiffness: 400, damping: 30 });

  useEffect(() => {
    if (reducedMotion || isTouch) return;

    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!visible) setVisible(true);
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest("a, button, [data-cursor], input, textarea, select");
      setHovering(!!interactive);
      const cursorLabel = target.closest("[data-cursor-label]")?.getAttribute("data-cursor-label");
      setLabel(cursorLabel ?? null);
    };

    window.addEventListener("mousemove", move);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseleave", () => setVisible(false));
    document.addEventListener("mouseenter", () => setVisible(true));

    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", onOver);
    };
  }, [cursorX, cursorY, visible, reducedMotion, isTouch]);

  if (reducedMotion || isTouch) return null;

  return (
    <>
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[9999] hidden items-center justify-center md:flex"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: hovering ? 56 : 36,
          height: hovering ? 56 : 36,
          opacity: visible ? 1 : 0,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
      >
        <div className="h-full w-full rounded-full border border-foreground/25" />
        {label && (
          <span className="absolute font-mono text-[9px] tracking-wider text-foreground/70 uppercase">
            {label}
          </span>
        )}
      </motion.div>
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[9999] hidden h-1.5 w-1.5 rounded-full bg-foreground md:block"
        style={{ x: dotX, y: dotY, translateX: "-50%", translateY: "-50%", opacity: visible ? 1 : 0 }}
      />
    </>
  );
}
