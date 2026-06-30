"use client";

import { useCallback, useMemo, useState, memo } from "react";
import { PROJECTS } from "@/constants/projects";
import { ProjectStackScroll } from "@/components/sections/ProjectStackScroll";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";

export const ProjectsSection = memo(function ProjectsSection() {
  const [filter, setFilter] = useState<"all" | "featured">("featured");
  const filtered = useMemo(
    () => (filter === "featured" ? PROJECTS.filter((p) => p.featured) : PROJECTS),
    [filter]
  );
  const setFeatured = useCallback(() => setFilter("featured"), []);
  const setAll = useCallback(() => setFilter("all"), []);
  const featuredCount = PROJECTS.filter((p) => p.featured).length;

  return (
    <section id="projects" className="relative py-6 md:py-14" aria-label="Projects">
      <div className="section-line mx-auto mb-24 max-w-7xl" />

      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="mb-12 flex flex-col gap-8 border-b border-border/80 pb-10 md:mb-14 md:flex-row md:items-end md:justify-between md:pb-12">
          <SectionHeading
            index="03"
            label="Work"
            title="Selected projects"
            description="Production dashboards, commerce flows, and scroll-driven 3D narratives — engineered for speed and polish."
            className="mb-0 md:mb-0"
          />

          <div className="flex flex-col gap-4 sm:items-end">
            <div className="inline-flex rounded-xl border border-border bg-surface/50 p-1">
              {(["featured", "all"] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={f === "featured" ? setFeatured : setAll}
                  className={cn(
                    "rounded-lg px-4 py-2 font-mono text-[11px] tracking-wide uppercase transition-all",
                    filter === f
                      ? "bg-foreground text-background shadow-sm"
                      : "text-muted hover:text-foreground"
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
            <p className="font-mono text-[10px] tracking-widest text-muted uppercase">
              {filter === "featured"
                ? `${featuredCount} featured projects`
                : `${PROJECTS.length} total projects`}
            </p>
          </div>
        </div>

        <ProjectStackScroll projects={filtered} />
      </div>
    </section>
  );
});
