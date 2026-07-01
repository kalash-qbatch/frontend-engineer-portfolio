"use client";

import { memo, useEffect, useState } from "react";
import { useInView } from "@/hooks/useInView";
import { useReducedMotion } from "@/hooks/useReducedMotion";

function parseStatValue(value: string) {
  const match = value.match(/^(\d+)(.*)$/);
  if (!match) return { target: 0, suffix: value };
  return { target: Number(match[1]), suffix: match[2] };
}

export const AnimatedStatValue = memo(function AnimatedStatValue({
  value,
  active,
  className,
}: {
  value: string;
  active: boolean;
  className?: string;
}) {
  const reducedMotion = useReducedMotion();
  const { target, suffix } = parseStatValue(value);
  const [count, setCount] = useState(reducedMotion ? target : 0);

  useEffect(() => {
    if (reducedMotion || !active) {
      if (active || reducedMotion) setCount(target);
      return;
    }

    setCount(0);
    const duration = 1400;
    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(target * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, reducedMotion, target]);

  return (
    <span className={className}>
      {count}
      {suffix}
    </span>
  );
});

export const AboutStatsGrid = memo(function AboutStatsGrid({
  stats,
}: {
  stats: readonly { value: string; label: string }[];
}) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.35, rootMargin: "-8% 0px" });

  return (
    <div ref={ref} className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="card-glow rounded-xl p-4 text-center">
          <p className="font-display text-2xl font-bold">
            <AnimatedStatValue value={stat.value} active={inView} />
          </p>
          <p className="mt-1 font-mono text-[9px] tracking-widest text-muted uppercase">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
});
