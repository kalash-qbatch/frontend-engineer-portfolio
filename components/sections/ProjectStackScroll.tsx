"use client";

import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import { memo, useCallback, type PointerEvent, type RefObject } from "react";
import type { Project } from "@/constants/projects";
import { getProjectVisual } from "@/constants/projectVisuals";
import { ProjectCardVisual } from "@/components/sections/ProjectCardVisual";
import { ProjectTechStack } from "@/components/sections/ProjectTechStack";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { EASE, STAGGER } from "@/lib/motion";

type ProjectStackScrollProps = {
  projects: Project[];
  sectionRef: RefObject<HTMLElement | null>;
};

function useCardTilt() {
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const tiltX = useSpring(rotateX, { stiffness: 260, damping: 24 });
  const tiltY = useSpring(rotateY, { stiffness: 260, damping: 24 });

  const onMove = useCallback(
    (event: PointerEvent<HTMLElement>) => {
      const rect = event.currentTarget.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      rotateY.set(x * 5);
      rotateX.set(-y * 5);
    },
    [rotateX, rotateY]
  );

  const onLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
  }, [rotateX, rotateY]);

  return { tiltX, tiltY, onMove, onLeave };
}

function useCardScrollMotion(
  sectionRef: RefObject<HTMLElement | null>,
  index: number,
  reducedMotion: boolean
) {
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.85", "end 0.35"],
  });

  const start = index * 0.08;
  const end = start + 0.35;
  const y = useTransform(scrollYProgress, [start, end], reducedMotion ? [0, 0] : [56, 0]);
  const opacity = useTransform(scrollYProgress, [start, end], reducedMotion ? [1, 1] : [0, 1]);
  const scale = useTransform(scrollYProgress, [start, end], reducedMotion ? [1, 1] : [0.94, 1]);
  const rotateX = useTransform(scrollYProgress, [start, end], reducedMotion ? [0, 0] : [8, 0]);

  return { y, opacity, scale, rotateX };
}

const ProjectGridCard = memo(function ProjectGridCard({
  project,
  index,
  sectionRef,
}: {
  project: Project;
  index: number;
  sectionRef: RefObject<HTMLElement | null>;
}) {
  const reducedMotion = useReducedMotion();
  const colors = getProjectVisual(project.id);
  const { tiltX, tiltY, onMove, onLeave } = useCardTilt();
  const { y, opacity, scale, rotateX } = useCardScrollMotion(sectionRef, index, reducedMotion);

  const accentStyle = {
    "--project-primary": colors.primary,
    "--project-accent": colors.accent,
  } as React.CSSProperties;

  return (
    <motion.div
      className="h-full"
      style={{
        y: reducedMotion ? undefined : y,
        opacity: reducedMotion ? undefined : opacity,
        scale: reducedMotion ? undefined : scale,
        rotateX: reducedMotion ? undefined : rotateX,
        transformPerspective: 1200,
      }}
    >
      <motion.article
        layout
        initial={false}
        style={{
          rotateX: reducedMotion ? undefined : tiltX,
          rotateY: reducedMotion ? undefined : tiltY,
          transformPerspective: 900,
          ...accentStyle,
        }}
        onPointerMove={reducedMotion ? undefined : onMove}
        onPointerLeave={reducedMotion ? undefined : onLeave}
        transition={{ layout: { duration: 0.45, ease: EASE } }}
        data-cursor-label="View"
        className="card-glow project-card group flex h-full flex-col overflow-hidden rounded-2xl border border-border/50 will-change-transform"
      >
        <ProjectCardVisual project={project} index={index} className="shrink-0" />

        <div className="relative flex min-h-0 flex-1 flex-col border-t border-border/40 bg-linear-to-b from-surface/30 via-surface/50 to-surface/70 p-5 backdrop-blur-sm">
          <div
            aria-hidden
            className="pointer-events-none absolute top-0 right-0 h-24 w-24 opacity-30"
            style={{
              background: `radial-gradient(circle at top right, ${colors.primary}40, transparent 70%)`,
            }}
          />

          <h3 className="relative font-display text-base font-bold tracking-tight text-foreground md:text-lg">
            <span className="bg-linear-to-r from-foreground to-foreground bg-size-[0%_2px] bg-bottom-left bg-no-repeat transition-all duration-300 group-hover:bg-size-[100%_2px] group-hover:from-[var(--project-accent)] group-hover:to-[var(--project-primary)]">
              {project.title}
            </span>
          </h3>
          <p
            className="relative mt-1 font-mono text-[9px] tracking-[0.16em] uppercase"
            style={{ color: `color-mix(in srgb, ${colors.accent} 70%, var(--muted))` }}
          >
            {project.role}
          </p>
          <p className="relative mt-2 line-clamp-2 min-h-10 text-xs leading-relaxed text-muted">
            {project.description}
          </p>

          <ProjectTechStack tags={project.tags} accent={colors.accent} className="mt-3 shrink-0" />

          <div className="relative mt-auto flex min-h-11 shrink-0 flex-wrap items-center gap-2 pt-5">
            <Link
              href={`/projects/${project.id}`}
              data-cursor="pointer"
              className="inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[11px] font-medium text-white shadow-md transition-all duration-300 hover:scale-[1.03] hover:shadow-lg active:scale-[0.98]"
              style={{
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                boxShadow: `0 4px 20px ${colors.primary}40`,
              }}
            >
              Case study
              <ArrowUpRight size={12} />
            </Link>
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border/70 bg-surface/30 px-3 py-2 text-[11px] text-muted backdrop-blur-sm transition-all duration-300 hover:border-[color-mix(in_srgb,var(--project-accent)_40%,transparent)] hover:text-foreground"
                aria-label={`${project.title} source code`}
              >
                <FaGithub size={12} />
              </a>
            )}
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border/70 bg-surface/30 px-3 py-1.5 text-[11px] text-muted backdrop-blur-sm transition-all duration-300 hover:border-[color-mix(in_srgb,var(--project-accent)_40%,transparent)] hover:text-foreground"
                aria-label={`${project.title} live demo`}
              >
                Live
                <ArrowUpRight size={12} />
              </a>
            )}
          </div>
        </div>
      </motion.article>
    </motion.div>
  );
});

export function ProjectStackScroll({ projects, sectionRef }: ProjectStackScrollProps) {
  if (projects.length === 0) return null;

  return (
    <motion.div
      layout
      className="grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3"
      style={{ perspective: 1200 }}
    >
      <AnimatePresence mode="popLayout">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            layout
            className="h-full"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{
              duration: 0.4,
              delay: index * STAGGER.tight,
              ease: EASE,
            }}
          >
            <ProjectGridCard
              project={project}
              index={index}
              sectionRef={sectionRef}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
