"use client";

import { memo, useMemo } from "react";
import { motion } from "framer-motion";
import { SKILLS } from "@/constants/skills";
import type { Skill } from "@/constants/skills";

const CLOUD_ITEMS = SKILLS.slice(0, 8);

const SkillOrbitIcon = memo(function SkillOrbitIcon({
  skill,
  x,
  y,
}: {
  skill: Skill;
  x: number;
  y: number;
}) {
  const Icon = skill.icon;
  return (
    <div
      className="absolute left-1/2 top-1/2"
      style={{ transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))` }}
    >
      <motion.div
        className="relative z-0 flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background/90 shadow-sm backdrop-blur-sm hover:z-20"
        whileHover={{ scale: 1.12 }}
        transition={{ type: "spring", stiffness: 400, damping: 24 }}
      >
        <Icon size={16} style={{ color: skill.color }} />
      </motion.div>
    </div>
  );
});

/** CSS-only skill visualization — avoids extra WebGL contexts */
export const SkillCloudVisual = memo(function SkillCloudVisual() {
  const orbit = useMemo(
    () =>
      CLOUD_ITEMS.map((skill, i) => {
        const angle = (i / CLOUD_ITEMS.length) * Math.PI * 2;
        return {
          skill,
          x: Math.cos(angle) * 72,
          y: Math.sin(angle) * 72,
        };
      }),
    []
  );

  return (
    <div className="relative flex min-h-[280px] items-center justify-center rounded-2xl border border-border bg-surface">
      <div className="absolute inset-0 overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600/10 via-transparent to-blue-600/10" />
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="relative z-10 h-48 w-48"
      >
        {orbit.map(({ skill, x, y }) => (
          <SkillOrbitIcon key={skill.name} skill={skill} x={x} y={y} />
        ))}
      </motion.div>
      <div className="pointer-events-none absolute bottom-4 z-10 font-mono text-[10px] tracking-widest text-muted uppercase">
        Tech stack
      </div>
    </div>
  );
});
