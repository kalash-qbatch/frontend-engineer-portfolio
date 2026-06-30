"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useInView } from "@/hooks/useInView";

interface Viewport3DProps {
  children: ReactNode;
  rootMargin?: string;
  threshold?: number;
  className?: string;
}

/** Only mounts 3D children while in viewport — frees WebGL context when scrolled away */
export function Viewport3D({
  children,
  rootMargin = "0px",
  threshold = 0.05,
  className,
}: Viewport3DProps) {
  const { ref, inView } = useInView<HTMLDivElement>({ rootMargin, once: false, threshold });
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    setActive(inView);
  }, [inView, ready]);

  return (
    <div ref={ref} className={className} suppressHydrationWarning>
      {ready && active ? children : null}
    </div>
  );
}
