"use client";

import dynamic from "next/dynamic";
import { memo, type ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { ExperienceShowcase } from "@/components/sections/ExperienceShowcase";
import { SCROLL_CHAPTERS } from "@/constants/scrollStory";
import { ServicesShowcase } from "@/components/sections/ServicesShowcase";
import { SKILLS } from "@/constants/skills";
import { StoryChapter } from "@/components/scroll/StoryChapter";
import { SkillBadge } from "@/components/ui/SkillBadge";
import { AboutStatsGrid } from "@/components/ui/AnimatedStat";
import { ScrollLink } from "@/components/ui/ScrollLink";
import { ScrollStoryProvider } from "@/hooks/useScrollStory";

const ScrollPortrait = dynamic(
  () => import("@/components/scroll/ScrollPortrait").then((m) => ({ default: m.ScrollPortrait })),
  { ssr: false }
);

const SkillsShowcase = dynamic(
  () => import("@/components/sections/SkillsShowcase").then((m) => ({ default: m.SkillsShowcase })),
  { loading: () => <div className="h-[min(52vh,520px)] animate-pulse rounded-2xl bg-surface/40" /> }
);

const PortraitGallery = dynamic(
  () => import("@/components/scroll/PortraitGallery").then((m) => ({ default: m.PortraitGallery })),
  { loading: () => <div className="grid grid-cols-3 gap-3">{[0, 1, 2].map((i) => <div key={i} className="aspect-[3/4] animate-pulse rounded-xl bg-surface/40" />)}</div> }
);

const STATS = [
  { value: "6+", label: "Years" },
  { value: "40+", label: "Projects" },
  { value: "15+", label: "Clients" },
  { value: "99", label: "Lighthouse" },
] as const;

const ABOUT_SKILLS = SKILLS.slice(0, 8);

const AboutContent = memo(function AboutContent() {
  return (
    <div className="space-y-6">
      <p className="text-sm leading-[1.85] text-muted md:text-base">
        I specialize in production-grade React, Next.js, Vue, and Gatsby applications with immersive 3D layers and
        scroll-driven narratives. Every interaction respects accessibility — including{" "}
        <code className="rounded bg-surface px-1.5 py-0.5 font-mono text-xs text-foreground">
          prefers-reduced-motion
        </code>
        .
      </p>

      <AboutStatsGrid stats={STATS} />

      <div className="flex flex-wrap gap-2">
        {ABOUT_SKILLS.map((s) => (
          <SkillBadge key={s.name} skill={s} />
        ))}
      </div>

      <PortraitGallery className="pt-2" />

      <ScrollLink
        href="#contact"
        className="group inline-flex items-center gap-2 text-sm text-foreground hover:text-accent"
      >
        Get in touch
        <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </ScrollLink>
    </div>
  );
});

const SkillsContent = memo(function SkillsContent() {
  return <SkillsShowcase />;
});

const ExperienceContent = memo(function ExperienceContent() {
  return <ExperienceShowcase />;
});

const ServicesContent = memo(function ServicesContent() {
  return <ServicesShowcase />;
});

const CHAPTER_CONTENT: Record<string, ReactNode> = {
  about: <AboutContent />,
  skills: <SkillsContent />,
  experience: <ExperienceContent />,
  services: <ServicesContent />,
};

export const ScrollStorySection = memo(function ScrollStorySection() {
  return (
    <ScrollStoryProvider>
      <div className="relative" id="scroll-story">
        <ScrollPortrait />

        {SCROLL_CHAPTERS.map((chapter) => (
          <StoryChapter key={chapter.id} chapter={chapter}>
            {CHAPTER_CONTENT[chapter.id]}
          </StoryChapter>
        ))}
      </div>
    </ScrollStoryProvider>
  );
});
