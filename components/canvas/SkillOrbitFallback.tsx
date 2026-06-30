"use client";

import { useMemo } from "react";
import type { Skill } from "@/constants/skills";

export function SkillOrbitFallback({ skills }: { skills: Skill[] }) {
  const orbit = useMemo(
    () =>
      skills.slice(0, 8).map((skill, i, arr) => {
        const angle = (i / arr.length) * Math.PI * 2 - Math.PI / 2;
        return {
          skill,
          x: Math.cos(angle) * 96,
          y: Math.sin(angle) * 56,
        };
      }),
    [skills]
  );

  return (
    <div className="relative flex h-full items-center justify-center overflow-hidden bg-[#080808]">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-600/15 via-transparent to-cyan-500/10" />
      <div className="relative h-32 w-52 animate-[spin_40s_linear_infinite]">
        {orbit.map(({ skill, x, y }) => {
          const Icon = skill.icon;
          return (
            <div
              key={skill.name}
              className="absolute left-1/2 top-1/2"
              style={{ transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))` }}
            >
              <div className="flex h-9 w-9 animate-[spin_40s_linear_infinite_reverse] items-center justify-center rounded-lg border border-border/80 bg-background/80">
                <Icon size={16} style={{ color: skill.color }} />
              </div>
            </div>
          );
        })}
      </div>
      <div className="absolute h-3 w-3 rounded-full bg-cyan-400/80 shadow-[0_0_20px_#22d3ee]" />
    </div>
  );
}
