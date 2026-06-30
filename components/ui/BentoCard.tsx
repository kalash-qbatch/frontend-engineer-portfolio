"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BentoCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  noPadding?: boolean;
}

export const BentoCard = memo(function BentoCard({
  children,
  className,
  delay = 0,
  noPadding,
}: BentoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "card-glow relative overflow-hidden rounded-2xl",
        !noPadding && "p-6 md:p-8",
        className
      )}
    >
      {children}
    </motion.div>
  );
});
