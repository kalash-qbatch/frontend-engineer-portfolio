"use client";

import { useCallback, useEffect, useMemo, useRef, useState, memo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { PROJECTS } from "@/constants/projects";
import { ProjectStackScroll } from "@/components/sections/ProjectStackScroll";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectsAmbientFallback } from "@/components/canvas/ProjectsAmbientScene";
import { useLenis } from "@/hooks/useLenis";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

export const ProjectsSection = memo(function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [filter, setFilter] = useState<"all" | "featured">("featured");
  const reducedMotion = useReducedMotion();
  const { lenis } = useLenis();

  const filtered = useMemo(
    () => (filter === "featured" ? PROJECTS.filter((p) => p.featured) : PROJECTS),
    [filter]
  );
  const setFeatured = useCallback(() => setFilter("featured"), []);
  const setAll = useCallback(() => setFilter("all"), []);
  const featuredCount = PROJECTS.filter((p) => p.featured).length;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.9", "end 0.2"],
  });
  const headerY = useTransform(scrollYProgress, [0, 1], reducedMotion ? [0, 0] : [32, -8]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.35], reducedMotion ? [1, 1] : [0.4, 1]);
  const lineScale = useTransform(scrollYProgress, [0, 0.5], [0, 1]);

  useEffect(() => {
    const resize = () => lenis?.resize();
    requestAnimationFrame(resize);
    const t = setTimeout(resize, 200);
    return () => clearTimeout(t);
  }, [filter, lenis, filtered.length]);

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative overflow-hidden py-6 md:py-14"
      aria-label="Projects"
    >
      <ProjectsAmbientFallback />

      <div className="section-line mx-auto mb-24 max-w-7xl">
        <motion.div
          className="h-px w-full origin-left bg-accent/60"
          style={{ scaleX: reducedMotion ? 1 : lineScale }}
        />
      </div>

      <div className="relative z-[1] mx-auto max-w-7xl px-5 md:px-8">
        <motion.div
          style={{
            y: reducedMotion ? undefined : headerY,
            opacity: reducedMotion ? undefined : headerOpacity,
          }}
          className="mb-12 flex flex-col gap-8 border-b border-border/80 pb-10 md:mb-14 md:flex-row md:items-end md:justify-between md:pb-12"
        >
          <SectionHeading
            index="03"
            label="Work"
            title="Selected projects"
            description="Production dashboards, commerce flows, and scroll-driven 3D narratives — engineered for speed and polish."
            className="mb-0 md:mb-0"
          />

          <div className="flex flex-col gap-4 sm:items-end">
            <div className="inline-flex rounded-xl border border-border bg-surface/50 p-1 backdrop-blur-sm">
              {(["featured", "all"] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={f === "featured" ? setFeatured : setAll}
                  className={cn(
                    "rounded-lg px-4 py-2 font-mono text-[11px] tracking-wide uppercase transition-all duration-300",
                    filter === f
                      ? "bg-foreground text-background shadow-sm"
                      : "text-muted hover:text-foreground"
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
            <motion.p
              key={filter}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="font-mono text-[10px] tracking-widest text-muted uppercase"
            >
              {filter === "featured"
                ? `${featuredCount} featured projects`
                : `${PROJECTS.length} total projects`}
            </motion.p>
          </div>
        </motion.div>

        <ProjectStackScroll projects={filtered} sectionRef={sectionRef} />
      </div>
    </section>
  );
});
