"use client";

import dynamic from "next/dynamic";
import { memo, type ReactNode } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { EXPERIENCE } from "@/constants/experience";
import { SCROLL_CHAPTERS } from "@/constants/scrollStory";
import { SERVICES } from "@/constants/services";
import { SKILLS } from "@/constants/skills";
import { StoryChapter } from "@/components/scroll/StoryChapter";
import { Badge } from "@/components/ui/badge";
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
        I specialize in production-grade React & Next.js with immersive 3D layers and
        scroll-driven narratives. Every interaction respects accessibility — including{" "}
        <code className="rounded bg-surface px-1.5 py-0.5 font-mono text-xs text-foreground">
          prefers-reduced-motion
        </code>
        .
      </p>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {STATS.map((stat) => (
          <div key={stat.label} className="card-glow rounded-xl p-4 text-center">
            <p className="font-display text-2xl font-bold">{stat.value}</p>
            <p className="mt-1 font-mono text-[9px] tracking-widest text-muted uppercase">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {ABOUT_SKILLS.map((s) => (
          <Badge key={s.name} variant="outline">
            {s.name}
          </Badge>
        ))}
      </div>

      <PortraitGallery className="pt-2" />

      <a
        href="#contact"
        className="group inline-flex items-center gap-2 text-sm text-foreground hover:text-accent"
      >
        Get in touch
        <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </a>
    </div>
  );
});

const SkillsContent = memo(function SkillsContent() {
  return <SkillsShowcase />;
});

const ExperienceContent = memo(function ExperienceContent() {
  return (
    <div className="space-y-4">
      {EXPERIENCE.map((item, i) => {
        const Icon = item.icon;
        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            className="card-glow rounded-xl p-5"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border">
                <Icon size={14} className="text-muted" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-display text-base font-bold">{item.title}</h3>
                  <span className="font-mono text-[10px] text-accent">{item.period}</span>
                </div>
                <p className="text-sm text-muted">{item.organization}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted/80">{item.description}</p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
});

const ServicesContent = memo(function ServicesContent() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {SERVICES.map((service, i) => {
        const Icon = service.icon;
        return (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="card-glow rounded-xl p-5"
          >
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface">
              <Icon size={16} />
            </div>
            <h3 className="font-display text-sm font-bold">{service.title}</h3>
            <p className="mt-2 text-xs leading-relaxed text-muted">{service.description}</p>
          </motion.div>
        );
      })}
    </div>
  );
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
