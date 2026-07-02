"use client";

import { memo, useMemo } from "react";
import { resolveProjectTags } from "@/constants/projectTags";
import { cn } from "@/lib/utils";

type ProjectTechStackProps = {
  tags: string[];
  accent?: string;
  className?: string;
};

function tagIconColor(color: string) {
  const normalized = color.toLowerCase();
  if (normalized === "#ffffff" || normalized === "#fff") return "#f4f4f5";
  return color;
}

export const ProjectTechStack = memo(function ProjectTechStack({
  tags,
  accent = "#8b5cf6",
  className,
}: ProjectTechStackProps) {
  const stack = useMemo(() => resolveProjectTags(tags, tags.length), [tags]);

  return (
    <div className={cn("relative", className)}>
      <div className="mb-2.5 flex items-center gap-2">
        <span
          className="h-px flex-1"
          style={{
            background: `linear-gradient(90deg, ${accent}55, transparent)`,
          }}
        />
        <span className="font-mono text-[9px] tracking-[0.22em] text-muted uppercase">
          Tech stack
        </span>
        <span
          className="h-px flex-1"
          style={{
            background: `linear-gradient(270deg, ${accent}55, transparent)`,
          }}
        />
      </div>

      <div className="flex min-h-[4.25rem] flex-wrap content-start gap-1.5">
        {stack.map((tag) => {
          const Icon = tag.icon;
          const iconColor = tagIconColor(tag.color);

          return (
            <span
              key={tag.name}
              className="inline-flex items-center gap-1.5 rounded-md border border-border/60 bg-surface/40 px-2 py-1 font-mono text-[10px] tracking-wide text-foreground/90"
              title={tag.name}
            >
              <Icon size={12} style={{ color: iconColor }} aria-hidden />
              {tag.name}
            </span>
          );
        })}
      </div>
    </div>
  );
});
