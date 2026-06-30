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
}

export const LazySection = memo(function LazySection({
  children,
  className,
  minHeight = "50vh",
  rootMargin = "320px 0px",
  fallback,
}: LazySectionProps) {
  const { ref, inView } = useInView<HTMLDivElement>({
    threshold: 0,
    rootMargin,
    once: true,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (inView) setMounted(true);
  }, [inView]);

  return (
    <div ref={ref} className={cn(className)} style={{ minHeight: mounted ? undefined : minHeight }}>
      {mounted ? children : (fallback ?? <SectionFallback minHeight={minHeight} />)}
    </div>
  );
});
