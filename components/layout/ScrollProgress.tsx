"use client";

import { memo } from "react";
import { useScrollProgress } from "@/hooks/useScrollProgress";

export const ScrollProgress = memo(function ScrollProgress() {
  const progress = useScrollProgress();

  return (
    <div
      className="fixed top-0 left-0 z-[100] h-px w-full bg-border"
      aria-hidden="true"
    >
      <div
        className="h-full bg-foreground transition-[width] duration-150 ease-out"
        style={{ width: `${progress * 100}%` }}
      />
    </div>
  );
});
