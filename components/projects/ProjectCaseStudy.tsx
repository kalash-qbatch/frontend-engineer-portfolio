"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { memo } from "react";
import type { IconType } from "react-icons";
import { SiReact, SiThreedotjs, SiTypescript } from "react-icons/si";
import { TbBolt, TbSparkles } from "react-icons/tb";
import type { CaseStudy } from "@/constants/caseStudies";
import type { Project } from "@/constants/projects";
import { SITE } from "@/constants/site";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HomeSectionLink } from "@/components/ui/HomeSectionLink";
import { ScrollLink } from "@/components/ui/ScrollLink";
import { LenisResizeOnMount } from "@/components/layout/LenisResizeOnMount";
import { LenisProvider, useLenis } from "@/hooks/useLenis";
import { EASE, fadeInUp, staggerContainer } from "@/lib/motion";

interface ProjectCaseStudyProps {
  project: Project;
  caseStudy: CaseStudy;
}

const STACK_ICONS: Record<string, { icon: IconType; color: string }> = {
  "Three.js": { icon: SiThreedotjs, color: "#ffffff" },
  "React Three Fiber": { icon: SiReact, color: "#61DAFB" },
  "@react-three/drei": { icon: SiThreedotjs, color: "#8B5CF6" },
  Zustand: { icon: TbBolt, color: "#E4B34C" },
  "Framer Motion": { icon: TbSparkles, color: "#BB4B96" },
  TypeScript: { icon: SiTypescript, color: "#3178C6" },
};

function SectionLabel({ children, accent }: { children: React.ReactNode; accent?: string }) {
  return (
    <p
      className="font-mono text-[10px] tracking-[0.24em] uppercase"
      style={accent ? { color: accent } : undefined}
    >
      {children}
    </p>
  );
}

const CaseStudyHeroVisual = memo(function CaseStudyHeroVisual({
  headline,
  theme,
}: {
  headline: string[];
  theme: CaseStudy["theme"];
}) {
  const watermark = headline.join(" ").toUpperCase();

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 72% 42%, ${theme.primary}35 0%, transparent 55%),
            radial-gradient(ellipse 50% 40% at 85% 70%, ${theme.accent}18 0%, transparent 50%),
            radial-gradient(ellipse 60% 50% at 20% 80%, ${theme.secondary}25 0%, transparent 55%),
            #050505
          `,
        }}
      />
      <div className="bg-grid absolute inset-0 opacity-[0.14]" />
      <motion.div
        className="absolute top-[18%] right-[-4%] hidden select-none font-display text-[clamp(3.5rem,11vw,8rem)] font-bold leading-[0.88] tracking-[-0.04em] text-white/[0.04] md:block"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.2, ease: EASE }}
      >
        {watermark.split(" ").map((word, i) => (
          <span key={`${word}-${i}`} className="block">
            {word}
          </span>
        ))}
      </motion.div>
      <motion.div
        className="absolute top-1/2 right-[8%] h-[min(52vw,420px)] w-[min(52vw,420px)] -translate-y-1/2 md:right-[12%]"
        initial={{ opacity: 0, scale: 0.88 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: EASE, delay: 0.15 }}
      >
        <motion.div
          className="absolute inset-0 rounded-full border border-white/[0.07]"
          animate={{ rotate: 360 }}
          transition={{ duration: 48, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-[12%] rounded-full border border-dashed border-white/[0.1]"
          animate={{ rotate: -360 }}
          transition={{ duration: 36, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-[24%] rounded-full"
          style={{
            background: `radial-gradient(circle at 35% 35%, ${theme.primary}55, ${theme.secondary}30 45%, transparent 72%)`,
            boxShadow: `0 0 120px ${theme.primary}40, inset 0 0 60px ${theme.primary}25`,
          }}
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
        <div
          className="absolute inset-[32%] rounded-full opacity-80 blur-2xl"
          style={{ background: `radial-gradient(circle, ${theme.primary}70, transparent 70%)` }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: theme.accent, boxShadow: `0 0 24px ${theme.accent}` }}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </div>
  );
});

const CaseStudyHero = memo(function CaseStudyHero({
  project,
  caseStudy,
}: ProjectCaseStudyProps) {
  const { theme, eyebrow, headline, subheadline, heroImage, heroImageAlt } = caseStudy;
  const hasBanner = Boolean(heroImage);

  return (
    <section className="relative min-h-[92dvh] overflow-hidden bg-black">
      {hasBanner ? (
        <div className="absolute inset-0">
          <Image
            src={heroImage!}
            alt={heroImageAlt ?? project.title}
            fill
            priority
            className="object-cover object-[62%_center]"
            sizes="100vw"
          />
        </div>
      ) : (
        <CaseStudyHeroVisual headline={headline} theme={theme} />
      )}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: hasBanner
            ? `
              linear-gradient(to right, rgba(0,0,0,0.94) 0%, rgba(0,0,0,0.72) 38%, rgba(0,0,0,0.28) 68%, rgba(0,0,0,0.12) 100%),
              linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.35) 40%, transparent 72%)
            `
            : `
              linear-gradient(to right, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.45) 45%, rgba(0,0,0,0.15) 100%),
              linear-gradient(to top, rgba(0,0,0,0.92) 0%, transparent 42%)
            `,
        }}
      />
      <div className="relative z-10 mx-auto flex min-h-[92dvh] max-w-7xl flex-col px-5 pb-16 pt-28 md:px-8 md:pb-20 md:pt-32">
        <HomeSectionLink
          section="projects"
          className="mb-10 inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 font-mono text-[10px] tracking-[0.18em] text-white/60 uppercase backdrop-blur-sm transition-colors hover:border-white/20 hover:text-white"
        >
          <ArrowLeft size={13} />
          Back to work
        </HomeSectionLink>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="mt-auto max-w-2xl"
        >
          <motion.p
            variants={fadeInUp}
            className="font-mono text-[11px] tracking-[0.28em] uppercase"
            style={{ color: theme.accent }}
          >
            {eyebrow}
          </motion.p>

          <h1 className="mt-5 font-display text-[clamp(2.75rem,8vw,5.5rem)] font-bold leading-[0.92] tracking-[-0.04em] text-white">
            {headline.map((line, i) => (
              <motion.span key={`${line}-${i}`} variants={fadeInUp} className="block">
                {line}
              </motion.span>
            ))}
          </h1>

          <motion.p
            variants={fadeInUp}
            className="mt-6 max-w-lg text-base leading-relaxed text-white/60 md:text-lg"
          >
            {subheadline}
          </motion.p>

          <motion.div variants={fadeInUp} className="mt-10 flex flex-wrap gap-3">
            {project.live && (
              <Button
                asChild
                size="lg"
                className="rounded-full border-0 px-7 text-white shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
                  boxShadow: `0 8px 32px ${theme.primary}55`,
                }}
              >
                <a href={project.live} target="_blank" rel="noopener noreferrer">
                  Explore live
                  <ArrowUpRight size={16} />
                </a>
              </Button>
            )}
            <ScrollLink
              href="#case-study-content"
              className="inline-flex h-11 items-center justify-center rounded-full border border-white/20 bg-white/5 px-7 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/10 hover:text-white"
            >
              Read case study
            </ScrollLink>
          </motion.div>

          <motion.div variants={fadeInUp} className="mt-8 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-mono text-[9px] tracking-[0.14em] text-white/70 uppercase backdrop-blur-sm"
              >
                {tag}
              </span>
            ))}
          </motion.div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="pointer-events-none absolute bottom-8 left-1/2 hidden -translate-x-1/2 font-mono text-[10px] tracking-[0.3em] text-white/35 uppercase md:block"
        >
          Scroll
        </motion.p>
      </div>
    </section>
  );
});

const StatGrid = memo(function StatGrid({
  stats,
  theme,
}: {
  stats: CaseStudy["stats"];
  theme: CaseStudy["theme"];
}) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: i * 0.06, ease: EASE }}
          className="group relative overflow-hidden rounded-2xl border border-border/60 bg-surface/30 p-5 text-center backdrop-blur-sm md:p-6"
          style={{ boxShadow: `inset 0 1px 0 ${theme.primary}15` }}
        >
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-60"
            style={{ background: `linear-gradient(90deg, transparent, ${theme.primary}80, transparent)` }}
          />
          <p className="font-display text-3xl font-bold md:text-4xl" style={{ color: theme.accent }}>
            {stat.value}
          </p>
          <p className="mt-2 font-mono text-[9px] leading-snug tracking-[0.18em] text-muted uppercase">
            {stat.label}
          </p>
        </motion.div>
      ))}
    </div>
  );
});

const FeatureGrid = memo(function FeatureGrid({
  features,
  theme,
}: {
  features: CaseStudy["features"];
  theme: CaseStudy["theme"];
}) {
  return (
    <div className="grid gap-3 md:grid-cols-2 md:gap-4 lg:grid-cols-3">
      {features.map((feature, i) => (
        <motion.div
          key={feature.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.55, delay: (i % 3) * 0.06, ease: EASE }}
          className="group relative overflow-hidden rounded-2xl border border-border/50 bg-surface/25 p-5 transition-colors duration-300 hover:border-border-hover hover:bg-surface/40 md:p-6"
        >
          <span
            className="font-mono text-[10px] tracking-[0.2em] text-muted transition-colors group-hover:text-foreground/70"
            style={{ color: `color-mix(in srgb, ${theme.primary} 50%, var(--muted))` }}
          >
            {String(i + 1).padStart(2, "0")}
          </span>
          <h3 className="mt-3 font-display text-base font-bold tracking-tight md:text-lg">{feature.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">{feature.description}</p>
          <div
            className="pointer-events-none absolute -right-6 -bottom-6 h-24 w-24 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
            style={{ background: `${theme.primary}30` }}
          />
        </motion.div>
      ))}
    </div>
  );
});

const SectionNav = memo(function SectionNav({
  sections,
  theme,
}: {
  sections: CaseStudy["sections"];
  theme: CaseStudy["theme"];
}) {
  const { scrollTo } = useLenis();

  return (
    <nav aria-label="Case study sections" className="mb-4">
      <SectionLabel accent={theme.accent}>On this page</SectionLabel>
      <ul className="mt-4 space-y-1">
        {sections.map((section) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              onClick={(e) => {
                e.preventDefault();
                const hash = `#${section.id}`;
                if (window.location.hash !== hash) {
                  window.history.pushState(null, "", hash);
                }
                scrollTo(hash);
              }}
              className="group flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:bg-surface/50 hover:text-foreground"
            >
              <span
                className="h-1 w-1 shrink-0 rounded-full opacity-50 transition-all group-hover:w-2 group-hover:opacity-100"
                style={{ background: theme.primary }}
              />
              {section.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
});

const StackList = memo(function StackList({
  stack,
  theme,
}: {
  stack: CaseStudy["stack"];
  theme: CaseStudy["theme"];
}) {
  return (
    <div
      className="overflow-hidden rounded-2xl border border-border/60 bg-surface/30 backdrop-blur-sm"
      style={{ boxShadow: `0 0 0 1px ${theme.primary}12, inset 0 1px 0 ${theme.primary}18` }}
    >
      <div
        className="border-b border-border/50 px-5 py-4 md:px-6"
        style={{ background: `linear-gradient(135deg, ${theme.primary}12, transparent)` }}
      >
        <SectionLabel accent={theme.accent}>Tech stack</SectionLabel>
      </div>
      <ul className="divide-y divide-border/40">
        {stack.map((item) => {
          const meta = STACK_ICONS[item.name];
          const Icon = meta?.icon;

          return (
            <li key={item.name} className="group px-5 py-4 transition-colors hover:bg-surface/40 md:px-6">
              <div className="flex items-start gap-3">
                {Icon && (
                  <span
                    className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border/60 bg-background/60 transition-colors group-hover:border-border-hover"
                    style={{ boxShadow: `inset 0 0 0 1px ${meta.color}15` }}
                  >
                    <Icon size={16} style={{ color: meta.color }} aria-hidden />
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-display text-sm font-semibold tracking-tight text-foreground">
                    {item.name}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-muted">{item.detail}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
});

const ContentSection = memo(function ContentSection({
  section,
  index,
  theme,
}: {
  section: CaseStudy["sections"][number];
  index: number;
  theme: CaseStudy["theme"];
}) {
  return (
    <motion.article
      id={section.id}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.65, delay: index * 0.04, ease: EASE }}
      className="scroll-mt-28 overflow-hidden rounded-2xl border border-border/50 bg-surface/20"
    >
      <div className="flex">
        <div className="w-1 shrink-0" style={{ background: `linear-gradient(180deg, ${theme.primary}, ${theme.accent})` }} />
        <div className="flex-1 p-6 md:p-8">
          <div className="flex items-center gap-3">
            <span
              className="font-mono text-[10px] tracking-[0.2em] uppercase"
              style={{ color: theme.accent }}
            >
              {section.label}
            </span>
            <span className="h-px flex-1 bg-border/60" />
            <span className="font-mono text-[10px] text-muted/50">{String(index + 1).padStart(2, "0")}</span>
          </div>
          <h2 className="mt-4 font-display text-xl font-bold tracking-tight md:text-2xl lg:text-3xl">
            {section.title}
          </h2>
          <div className="mt-5 space-y-4">
            {section.body.map((paragraph) => (
              <p key={paragraph.slice(0, 48)} className="text-sm leading-[1.9] text-muted md:text-base">
                {paragraph}
              </p>
            ))}
          </div>
          {section.bullets && (
            <ul className="mt-6 grid gap-2 sm:grid-cols-2">
              {section.bullets.map((bullet) => (
                <li
                  key={bullet}
                  className="flex gap-2.5 rounded-xl border border-border/40 bg-background/40 px-3.5 py-3 text-xs leading-relaxed text-muted md:text-sm"
                >
                  <span
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ background: theme.primary }}
                  />
                  {bullet}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </motion.article>
  );
});

const ProjectCaseStudyContent = memo(function ProjectCaseStudyContent({
  project,
  caseStudy,
}: ProjectCaseStudyProps) {
  const { theme, sections, features, stats, stack } = caseStudy;

  return (
    <main className="bg-background">
      <CaseStudyHero project={project} caseStudy={caseStudy} />

      <div id="case-study-content" className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mb-14 flex flex-col gap-6 border-b border-border/60 pb-10 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <Badge
              variant="outline"
              className="mb-4 border-border/80 font-mono text-[10px] tracking-widest uppercase"
              style={{ color: theme.accent, borderColor: `${theme.accent}40` }}
            >
              {project.year}
            </Badge>
            <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">{project.title}</h2>
            <p className="mt-2 text-sm text-muted md:text-base">
              {project.role} · {SITE.name}
            </p>
          </div>
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit items-center gap-2 rounded-xl border border-border/60 bg-surface/30 px-4 py-2.5 font-mono text-[11px] tracking-wide text-muted transition-colors hover:border-border-hover hover:text-foreground"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              {new URL(project.live).host}
              <ExternalLink size={13} />
            </a>
          )}
        </motion.div>

        <StatGrid stats={stats} theme={theme} />

        <div className="mt-16 md:mt-20">
          <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <SectionLabel accent={theme.accent}>Key features</SectionLabel>
              <h2 className="mt-2 font-display text-2xl font-bold tracking-tight md:text-3xl">
                What the experience delivers
              </h2>
            </div>
            <p className="max-w-sm text-sm text-muted">
              Six interactive layers that define the Ferrari 458 concept demo.
            </p>
          </div>
          <FeatureGrid features={features} theme={theme} />
        </div>

        <div className="mt-16 flex flex-col gap-10 md:mt-20 lg:grid lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-12">
          <aside className="order-first lg:sticky lg:top-28 lg:order-last lg:self-start">
            <SectionNav sections={sections} theme={theme} />
            <StackList stack={stack} theme={theme} />
            {project.live && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: EASE }}
                className="mt-4"
              >
                <Button
                  asChild
                  size="lg"
                  className="h-12 w-full rounded-xl border-0 text-white shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
                    boxShadow: `0 8px 28px ${theme.primary}45`,
                  }}
                >
                  <a href={project.live} target="_blank" rel="noopener noreferrer">
                    Open live demo
                    <ArrowUpRight size={16} />
                  </a>
                </Button>
              </motion.div>
            )}
          </aside>

          <div className="order-last space-y-6 lg:order-first">
            {sections.map((section, i) => (
              <ContentSection key={section.id} section={section} index={i} theme={theme} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
});

export const ProjectCaseStudy = memo(function ProjectCaseStudy(props: ProjectCaseStudyProps) {
  return (
    <LenisProvider enabled preset="relaxed">
      <LenisResizeOnMount />
      <ProjectCaseStudyContent {...props} />
    </LenisProvider>
  );
});
