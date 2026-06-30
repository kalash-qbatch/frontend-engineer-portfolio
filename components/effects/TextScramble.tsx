"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface TextScrambleProps {
  text: string;
  className?: string;
  delay?: number;
}

const CHARS = "!<>-_\\/[]{}—=+*^?#________";

export function TextScramble({ text, className, delay = 0 }: TextScrambleProps) {
  const [display, setDisplay] = useState(text);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      setDisplay(text);
      return;
    }

    let frame = 0;
    const totalFrames = 30;
    let interval: ReturnType<typeof setInterval>;

    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        frame++;
        const progress = frame / totalFrames;
        const scrambled = text
          .split("")
          .map((char, i) => {
            if (char === " ") return " ";
            if (i < progress * text.length) return text[i];
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("");
        setDisplay(scrambled);
        if (frame >= totalFrames) {
          clearInterval(interval);
          setDisplay(text);
        }
      }, 30);
    }, delay);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [text, delay, reducedMotion]);

  return (
    <motion.span className={className} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {display}
    </motion.span>
  );
}
