"use client";

import { memo, useMemo } from "react";
import type { Project } from "@/constants/projects";
import { resolveProjectTags } from "@/constants/projectTags";
import { EARTH_MAP } from "@/constants/images";
import { getProjectVisual } from "@/constants/projectVisuals";
import { getSkillIconColor } from "@/constants/skills";
import { Badge } from "@/components/ui/badge";
import { useInView } from "@/hooks/useInView";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

type ProjectCardVisualProps = {
  project: Project;
  index?: number;
  className?: string;
};

const STARS = [
  { top: "12%", left: "18%", size: 2, delay: "0s", duration: "2.8s" },
  { top: "22%", left: "78%", size: 1.5, delay: "0.6s", duration: "3.4s" },
  { top: "38%", left: "8%", size: 1, delay: "1.1s", duration: "2.5s" },
  { top: "55%", left: "88%", size: 2, delay: "0.3s", duration: "3.8s" },
  { top: "18%", left: "52%", size: 1, delay: "2.1s", duration: "3.6s" },
] as const;

function tagIconColor(color: string) {
  const normalized = color.toLowerCase();
  if (normalized === "#ffffff" || normalized === "#fff") return "#f4f4f5";
  return getSkillIconColor(color);
}

function Starfield() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {STARS.map((star, i) => (
        <span
          key={i}
          className="project-star absolute rounded-full bg-white"
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            "--twinkle-delay": star.delay,
            "--twinkle-duration": star.duration,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

function StackIconDock({ tags, accent }: { tags: string[]; accent: string }) {
  const stack = useMemo(() => resolveProjectTags(tags, tags.length), [tags]);

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 px-3 pb-3">
      <div
        className="mx-auto flex max-w-[calc(100%-0.5rem)] items-center justify-center gap-2 rounded-xl border border-white/15 bg-black/55 px-2.5 py-2 shadow-lg backdrop-blur-md sm:gap-2.5 sm:px-3"
        style={{ boxShadow: `0 8px 32px rgba(0,0,0,0.45), 0 0 0 1px ${accent}25` }}
      >
        {stack.map((tag) => {
          const Icon = tag.icon;
          return (
            <div
              key={tag.name}
              className="group/icon flex min-w-0 flex-1 flex-col items-center gap-1"
              title={tag.name}
            >
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 transition-transform duration-300 group-hover/icon:scale-105 sm:h-10 sm:w-10"
                style={{
                  background: `linear-gradient(160deg, ${tag.color}35, ${tag.color}12)`,
                  boxShadow: `inset 0 1px 0 rgba(255,255,255,0.12), 0 2px 10px ${tag.color}25`,
                }}
              >
                <Icon size={18} style={{ color: tagIconColor(tag.color) }} aria-hidden />
              </span>
              <span className="max-w-full truncate font-mono text-[8px] leading-none tracking-wide text-white/75 sm:text-[9px]">
                {tag.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ProjectCardGlobe({
  project,
  paused,
}: {
  project: Project;
  paused: boolean;
}) {
  const colors = getProjectVisual(project.id);

  const stageStyle = {
    "--globe-spin-duration": colors.globeSpinDuration ?? "36s",
    "--globe-glow": `${colors.primary}66`,
  } as React.CSSProperties;

  return (
    <div
      className={cn(
        "project-globe-stage relative flex h-full w-full flex-col items-center justify-center pb-16",
        paused && "project-globe-paused"
      )}
      style={stageStyle}
    >
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 30% 30%, ${colors.primary}50 0%, transparent 48%),
            radial-gradient(circle at 70% 55%, ${colors.secondary}35 0%, transparent 42%)
          `,
        }}
      />

      <Starfield />

      <div className="project-globe-core relative z-10 -mt-2">
        <div
          aria-hidden
          className="absolute -inset-10 rounded-full opacity-80 blur-2xl"
          style={{ background: `radial-gradient(circle, ${colors.accent}45 0%, transparent 70%)` }}
        />

        <svg
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 opacity-50 sm:h-48 sm:w-48"
          viewBox="0 0 200 200"
          fill="none"
        >
          <circle
            cx="100"
            cy="100"
            r="88"
            stroke={colors.accent}
            strokeOpacity="0.35"
            strokeWidth="1"
            strokeDasharray="3 6"
          />
        </svg>

        <div
          className="project-globe-earth relative h-[4.5rem] w-[4.5rem] overflow-hidden rounded-full bg-cover bg-center transition-shadow duration-500 sm:h-20 sm:w-20"
          style={{
            backgroundImage: `url(${EARTH_MAP})`,
            boxShadow: `
              0 16px 48px rgba(0,0,0,0.55),
              inset -10px -8px 22px rgba(0,0,0,0.5),
              0 0 36px ${colors.primary}55
            `,
          }}
        >
          <div
            aria-hidden
            className="absolute inset-0 rounded-full opacity-35 mix-blend-color"
            style={{ background: colors.primary }}
          />
          <div className="absolute inset-0 rounded-full bg-linear-to-br from-white/30 via-transparent to-black/55" />
          <div
            aria-hidden
            className="absolute top-[18%] left-[22%] h-3 w-3 rounded-full bg-white/70 blur-[2px]"
          />
        </div>
      </div>

      <StackIconDock tags={project.tags} accent={colors.accent} />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[42%] bg-linear-to-t from-[#060608] via-[#060608]/70 to-transparent"
      />

      <div
        aria-hidden
        className="project-card-shine project-card-shimmer pointer-events-none absolute inset-0 opacity-0"
      />
    </div>
  );
}

export const ProjectCardVisual = memo(function ProjectCardVisual({
  project,
  index,
  className,
}: ProjectCardVisualProps) {
  const colors = getProjectVisual(project.id);
  const reducedMotion = useReducedMotion();
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.15, once: false });

  return (
    <div
      ref={ref}
      className={cn("project-card-visual relative aspect-16/10 overflow-hidden bg-[#040406]", className)}
    >
      <div className="absolute inset-0">
        <div
          className={cn(
            "absolute inset-0 bg-linear-to-br opacity-75 transition-opacity duration-500 group-hover:opacity-95",
            project.gradient
          )}
        />

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 90% 70% at 50% 38%, ${colors.accent}18 0%, transparent 72%)`,
          }}
        />

        <div className="bg-grid pointer-events-none absolute inset-0 opacity-[0.1]" />

        <ProjectCardGlobe project={project} paused={!inView || reducedMotion} />
      </div>

      <div className="pointer-events-none absolute top-3 left-3 z-20 flex items-center gap-2">
        {typeof index === "number" && (
          <span className="font-mono text-[10px] tracking-[0.2em] text-white/40" aria-hidden>
            {String(index + 1).padStart(2, "0")}
          </span>
        )}
        <Badge
          variant="accent"
          className="border border-white/15 text-[10px] backdrop-blur-md"
          style={{
            background: `linear-gradient(135deg, ${colors.primary}40, ${colors.secondary}25)`,
            borderColor: `${colors.accent}40`,
          }}
        >
          {project.year}
        </Badge>
      </div>

      {project.featured && (
        <div
          className="pointer-events-none absolute top-3 right-3 z-20 rounded-full border border-white/15 px-2 py-0.5 font-mono text-[9px] tracking-widest text-white/80 uppercase backdrop-blur-md"
          style={{ background: `${colors.accent}25` }}
        >
          Featured
        </div>
      )}
    </div>
  );
});
