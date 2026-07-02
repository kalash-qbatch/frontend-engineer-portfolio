"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { memo, useCallback, useState } from "react";
import { SkillCarousel } from "@/components/sections/SkillCarousel";
import { ScrollLink } from "@/components/ui/ScrollLink";
import { MarqueeStrip } from "@/components/ui/MarqueeStrip";
import {
  SKILL_CATEGORIES,
  SKILLS,
  SKILLS_BY_CATEGORY,
  getCategoryColor,
  getCategoryMeta,
  type Skill,
  type SkillCategory,
} from "@/constants/skills";
import { getSkillsMarqueeItems } from "@/lib/marquee-items";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { EASE, STAGGER } from "@/lib/motion";
import { cn } from "@/lib/utils";

function SkillsMarquee() {
  return <MarqueeStrip items={getSkillsMarqueeItems()} />;
}

const ProficiencyRing = memo(function ProficiencyRing({
  level,
  color,
  active,
  reducedMotion,
}: {
  level: number;
  color: string;
  active: boolean;
  reducedMotion: boolean;
}) {
  const r = 18;
  const c = 2 * Math.PI * r;
  const offset = c - (level / 100) * c;

  return (
    <svg className="h-11 w-11 shrink-0 -rotate-90" viewBox="0 0 44 44" aria-hidden>
      <circle cx="22" cy="22" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2.5" />
      <motion.circle
        cx="22"
        cy="22"
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray={c}
        initial={reducedMotion ? false : { strokeDashoffset: c }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: reducedMotion ? 0 : 0.8, ease: EASE, delay: 0.08 }}
        style={{ opacity: active ? 1 : 0.55 }}
      />
    </svg>
  );
});

const SkillCard = memo(function SkillCard({
  skill,
  active,
  reducedMotion,
  index,
  onHover,
}: {
  skill: Skill;
  active: boolean;
  reducedMotion: boolean;
  index: number;
  onHover: (name: string | null) => void;
}) {
  const Icon = skill.icon;

  return (
    <motion.button
      type="button"
      initial={reducedMotion ? false : { opacity: 0, y: 12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={reducedMotion ? undefined : { opacity: 0, y: -8, scale: 0.96 }}
      transition={{ duration: 0.35, delay: index * STAGGER.tight, ease: EASE }}
      onMouseEnter={() => onHover(skill.name)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(skill.name)}
      onBlur={() => onHover(null)}
      className={cn(
        "group relative flex w-full items-center gap-3 overflow-hidden rounded-xl border px-3 py-3 text-left transition-all duration-300",
        active
          ? "border-white/16 bg-white/[0.05] shadow-[0_0_32px_-10px_var(--skill-glow)]"
          : "border-border/50 bg-background/25 hover:border-border-hover hover:bg-white/[0.03]"
      )}
      style={
        {
          "--skill": skill.color,
          "--skill-glow": `${skill.color}55`,
        } as React.CSSProperties
      }
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500",
          active && "opacity-100"
        )}
        style={{
          background: `radial-gradient(ellipse 80% 100% at 0% 50%, ${skill.color}12, transparent 70%)`,
        }}
        aria-hidden
      />

      <div className="relative flex h-11 w-11 shrink-0 items-center justify-center">
        <ProficiencyRing
          level={skill.level}
          color={skill.color}
          active={active}
          reducedMotion={reducedMotion}
        />
        <span
          className="absolute flex h-7 w-7 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-110"
          style={{ backgroundColor: `${skill.color}${active ? "28" : "16"}` }}
        >
          <Icon size={14} style={{ color: skill.color }} aria-hidden />
        </span>
      </div>

      <div className="relative min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-sm font-medium text-foreground/90">{skill.name}</span>
          <span
            className="font-mono text-[10px] tabular-nums transition-colors duration-300"
            style={{ color: active ? skill.color : "var(--muted)" }}
          >
            {skill.level}%
          </span>
        </div>
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/8">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: skill.color }}
            initial={reducedMotion ? false : { width: 0 }}
            animate={{ width: `${skill.level}%` }}
            transition={{ duration: reducedMotion ? 0 : 0.65, ease: EASE, delay: 0.1 + index * 0.04 }}
          />
        </div>
      </div>
    </motion.button>
  );
});

export const SkillsShowcase = memo(function SkillsShowcase() {
  const reducedMotion = useReducedMotion();
  const [activeCategory, setActiveCategory] = useState<SkillCategory>("frontend");
  const [highlighted, setHighlighted] = useState<string | null>(null);

  const categorySkills = SKILLS_BY_CATEGORY[activeCategory];
  const activeMeta = getCategoryMeta(activeCategory);
  const activeColor = getCategoryColor(activeCategory);

  const onSelectCategory = useCallback((id: SkillCategory) => {
    setActiveCategory(id);
    setHighlighted(null);
  }, []);

  const onHighlight = useCallback((name: string | null) => setHighlighted(name), []);

  return (
    <div className="card-glow overflow-hidden rounded-2xl">
      <div className="relative overflow-hidden border-b border-border">
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-cyan-500/8 via-transparent to-violet-600/10"
          aria-hidden
        />
        <div className="relative py-3.5">
          <SkillsMarquee />
        </div>
      </div>

      <div className="relative h-[210px] overflow-hidden border-b border-border sm:h-[260px]">
        <div
          className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-[#080808]/30 via-transparent to-[#080808]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 z-10 transition-[background] duration-700"
          style={{
            background: `radial-gradient(ellipse 90% 75% at 50% 85%, ${activeColor}22, transparent 68%)`,
          }}
          aria-hidden
        />
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <SkillCarousel
          skills={categorySkills}
          highlighted={highlighted}
          transitionKey={activeCategory}
          accentColor={activeColor}
          onHover={onHighlight}
        />

        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between px-5 pt-4 sm:px-6">
          <div>
            <p className="font-mono text-[9px] tracking-[0.2em] text-muted/60 uppercase">
              Orbiting stack
            </p>
            <p className="mt-0.5 font-display text-sm font-bold text-foreground/90">
              {activeMeta.label}
            </p>
          </div>
          <div className="rounded-lg border border-border/60 bg-background/50 px-2.5 py-1.5 text-center backdrop-blur-sm">
            <p className="font-display text-lg font-bold leading-none" style={{ color: activeColor }}>
              {categorySkills.length}
            </p>
            <p className="mt-0.5 font-mono text-[8px] tracking-widest text-muted uppercase">tools</p>
          </div>
        </div>
      </div>

      <div className="flex gap-1 overflow-x-auto border-b border-border p-3 sm:p-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {SKILL_CATEGORIES.map((category) => {
          const active = activeCategory === category.id;
          const Icon = category.icon;
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onSelectCategory(category.id)}
              className={cn(
                "relative flex shrink-0 cursor-pointer items-center gap-2 rounded-lg px-3 py-2 font-mono text-[10px] tracking-wide uppercase transition-colors",
                active ? "text-background" : "text-muted hover:text-foreground"
              )}
            >
              {active && (
                <motion.span
                  layoutId="skill-category-pill"
                  className="absolute inset-0 rounded-lg"
                  style={{ backgroundColor: category.color }}
                  transition={{ type: "spring", stiffness: 420, damping: 32 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                <Icon size={12} aria-hidden />
                {category.label}
              </span>
            </button>
          );
        })}
      </div>

      <div className="border-b border-border/50 px-5 py-4 sm:px-6">
        <p className="text-sm leading-relaxed text-muted">{activeMeta.description}</p>
      </div>

      <div className="p-3 sm:p-4">
        <div key={activeCategory} className="grid gap-2 sm:grid-cols-2">
          {categorySkills.map((skill, i) => (
            <SkillCard
              key={skill.name}
              skill={skill}
              index={i}
              active={highlighted === skill.name}
              reducedMotion={reducedMotion}
              onHover={onHighlight}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 border-t border-border px-5 py-3.5 sm:px-6">
        <p className="font-mono text-[10px] tracking-widest text-muted/70 uppercase">
          {SKILLS.length} skills · 4 stacks
        </p>
        <ScrollLink
          href="#projects"
          className="group inline-flex items-center gap-1.5 font-mono text-[10px] tracking-wide text-foreground/80 uppercase transition-colors hover:text-accent"
        >
          See in projects
          <ArrowUpRight
            size={12}
            className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </ScrollLink>
      </div>
    </div>
  );
});
