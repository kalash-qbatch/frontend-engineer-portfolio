"use client";

import { memo, useEffect, useState, type ReactNode } from "react";
import { useInView } from "@/hooks/useInView";
import { SectionFallback } from "@/components/ui/SectionFallback";
import { cn } from "@/lib/utils";

interface LazySectionProps {
  children: ReactNode;
  className?: string;
  minHeight?: string;
  rootMargin?: string;
  fallback?: ReactNode;
  /** Mount immediately so in-page anchor links always resolve */
  eager?: boolean;
}

export const LazySection = memo(function LazySection({
  children,
  className,
  minHeight = "50vh",
  rootMargin = "320px 0px",
  fallback,
  eager = false,
}: LazySectionProps) {
  const { ref, inView } = useInView<HTMLDivElement>({
    threshold: 0,
    rootMargin,
    once: true,
  });
  const [mounted, setMounted] = useState(eager);

  useEffect(() => {
    if (eager || inView) setMounted(true);
  }, [eager, inView]);

  return (
    <div ref={ref} className={cn(className, mounted && "content-auto")} style={{ minHeight: mounted ? undefined : minHeight }}>
      {mounted ? children : (fallback ?? <SectionFallback minHeight={minHeight} />)}
    </div>
  );
});
