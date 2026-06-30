"use client";

import { AnimatePresence, motion } from "framer-motion";
import { memo, useCallback, useMemo, useState } from "react";
import { SkillCarousel } from "@/components/sections/SkillCarousel";
import { SKILL_CATEGORIES, SKILLS, getSkillIconColor, type Skill, type SkillCategory } from "@/constants/skills";
import { EASE, STAGGER } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Tab = SkillCategory | "all";

const TABS: Tab[] = ["all", ...SKILL_CATEGORIES.map((c) => c.id)];

function tabLabel(tab: Tab) {
  if (tab === "all") return "All";
  return SKILL_CATEGORIES.find((c) => c.id === tab)?.label ?? tab;
}

const chipVariants = {
  hidden: { opacity: 0, scale: 0.82, y: 10, filter: "blur(6px)" },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.4, delay: i * STAGGER.tight, ease: EASE },
  }),
  exit: {
    opacity: 0,
    scale: 0.86,
    y: -6,
    filter: "blur(4px)",
    transition: { duration: 0.25, ease: EASE },
  },
};

const SkillChip = memo(function SkillChip({
  skill,
  active,
}: {
  skill: Skill;
  active: boolean;
}) {
  const Icon = skill.icon;
  const iconColor = getSkillIconColor(skill.color);

  return (
    <motion.span
      layout
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg border py-1 pr-2.5 pl-1.5 text-xs font-medium",
        active
          ? "border-white/20 bg-white/8 text-foreground shadow-[0_0_20px_-8px_var(--skill)]"
          : "border-border/70 bg-background/30 text-foreground/90 hover:border-border-hover hover:bg-background/50"
      )}
      style={{ "--skill": skill.color } as React.CSSProperties}
      animate={active ? { scale: 1.03 } : { scale: 1 }}
      transition={{ duration: 0.25, ease: EASE }}
    >
      <span
        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md"
        style={{ backgroundColor: `${skill.color}${active ? "28" : "14"}` }}
      >
        <Icon size={12} style={{ color: iconColor }} aria-hidden />
      </span>
      {skill.name}
    </motion.span>
  );
});

export const SkillsShowcase = memo(function SkillsShowcase() {
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const [highlighted, setHighlighted] = useState<string | null>(null);

  const filtered = useMemo(
    () => (activeTab === "all" ? SKILLS : SKILLS.filter((s) => s.category === activeTab)),
    [activeTab]
  );

  const carouselSkills = useMemo(
    () => (activeTab === "all" ? SKILLS.slice(0, 10) : filtered),
    [activeTab, filtered]
  );

  const selectTab = useCallback((tab: Tab) => {
    setActiveTab(tab);
    setHighlighted(null);
  }, []);

  const onHover = useCallback((name: string | null) => setHighlighted(name), []);

  return (
    <div className="card-glow overflow-hidden rounded-2xl">
      <div className="relative h-[240px] overflow-hidden border-b border-border sm:h-[280px]">
        <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-[#080808] via-transparent to-[#080808]/20" />
        <SkillCarousel
          skills={carouselSkills}
          highlighted={highlighted}
          transitionKey={activeTab}
          onHover={onHover}
        />
        <AnimatePresence>
          <motion.div
            key={activeTab}
            className="pointer-events-none absolute inset-0 z-20 bg-[#080808]"
            initial={{ opacity: 0.4 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          />
        </AnimatePresence>
      </div>

      <div className="flex flex-wrap gap-1.5 border-b border-border p-3 sm:p-4">
        {TABS.map((tab) => {
          const active = activeTab === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => selectTab(tab)}
              className={cn(
                "relative rounded-lg px-3 py-1.5 font-mono text-[10px] tracking-wide uppercase transition-colors",
                active ? "text-background" : "text-muted hover:text-foreground"
              )}
            >
              {active && (
                <motion.span
                  layoutId="skill-tab-indicator"
                  className="absolute inset-0 rounded-lg bg-foreground"
                  transition={{ type: "spring", stiffness: 420, damping: 32 }}
                />
              )}
              <motion.span
                className="relative z-10"
                animate={active ? { y: 0 } : { y: 0 }}
                whileTap={{ scale: 0.94 }}
              >
                {tabLabel(tab)}
              </motion.span>
            </button>
          );
        })}
      </div>

      <div className="overflow-hidden p-3 sm:p-4">
        <motion.div layout className="flex flex-wrap gap-1.5">
          <AnimatePresence mode="popLayout">
            {filtered.map((skill, i) => (
              <motion.div
                key={skill.name}
                layout
                custom={i}
                variants={chipVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onHoverStart={() => setHighlighted(skill.name)}
                onHoverEnd={() => setHighlighted(null)}
              >
                <SkillChip skill={skill} active={highlighted === skill.name} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
});
