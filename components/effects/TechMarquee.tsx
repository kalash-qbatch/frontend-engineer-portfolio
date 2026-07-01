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
      <div className="flex w-max animate-marquee items-center gap-10">
        {items.map((skill, i) => {
          const Icon = skill.icon;

          return (
            <span
              key={`${skill.name}-${i}`}
              className="flex shrink-0 items-center gap-2.5 font-mono text-xs tracking-wider text-muted uppercase"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-md border border-border/60 bg-white/[0.03]">
                <Icon size={14} style={{ color: skill.color }} aria-hidden />
              </span>
              {skill.name}
            </span>
          );
        })}
      </div>
    </div>
  );
});
