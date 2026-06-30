"use client";

import { memo, useMemo } from "react";
import { SKILLS } from "@/constants/skills";

const MARQUEE_ITEMS = [...SKILLS, ...SKILLS];

export const TechMarquee = memo(function TechMarquee() {
  const items = useMemo(() => MARQUEE_ITEMS, []);

  return (
    <div className="relative overflow-hidden border-y border-border py-4" aria-hidden="true">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />
      <div className="flex w-max animate-marquee gap-10">
        {items.map((skill, i) => (
          <span
            key={`${skill.name}-${i}`}
            className="flex shrink-0 items-center gap-2 font-mono text-xs tracking-wider text-muted uppercase"
          >
            <span className="h-1 w-1 rounded-full bg-accent/60" />
            {skill.name}
          </span>
        ))}
      </div>
    </div>
  );
});
