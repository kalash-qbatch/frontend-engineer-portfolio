"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  index: string;
  label: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  id?: string;
}

export const SectionHeading = memo(function SectionHeading({
  index,
  label,
  title,
  description,
  align = "left",
  className,
  id,
}: SectionHeadingProps) {
  return (
    <div
      id={id}
      className={cn(
        "mb-14 md:mb-20",
        id && "scroll-mt-24",
        align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-3xl",
        className
      )}
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className={cn(
          "mb-5 flex items-center gap-3",
          align === "center" && "justify-center"
        )}
      >
        <span className="font-mono text-[11px] tracking-widest text-accent">{index}</span>
        <span className="h-px w-8 bg-border" />
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
          {label}
        </span>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.65, delay: 0.05 }}
        className="font-display text-[clamp(2.25rem,5vw,4rem)] font-bold leading-[1.05] tracking-[-0.03em] text-foreground"
      >
        {title}
      </motion.h2>

      {description && (
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.12 }}
          className="mt-5 text-base leading-relaxed text-muted md:text-lg"
        >
          {description}
        </motion.p>
      )}
    </div>
  );
});
