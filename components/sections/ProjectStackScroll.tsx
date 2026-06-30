"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import type { Project } from "@/constants/projects";
import { Badge } from "@/components/ui/badge";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

type ProjectStackScrollProps = {
  projects: Project[];
};

function ProjectGridCard({ project, index }: { project: Project; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: EASE }}
      data-cursor-label="View"
      className="card-glow group flex h-full flex-col overflow-hidden rounded-xl"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-surface">
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-br opacity-90 transition-opacity group-hover:opacity-100",
            project.gradient
          )}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-display text-5xl font-bold text-foreground/[0.06]">
            {project.title[0]}
          </span>
        </div>
        <div className="absolute top-3 left-3">
          <Badge variant="accent" className="text-[10px]">
            {project.year}
          </Badge>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-display text-base font-bold tracking-tight md:text-lg">
          {project.title}
        </h3>
        <p className="mt-1 font-mono text-[9px] tracking-wide text-muted uppercase">
          {project.role}
        </p>
        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted">
          {project.description}
        </p>

        <div className="mt-3 flex flex-wrap gap-1">
          {project.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="px-1.5 py-0 text-[10px]">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="mt-auto flex flex-wrap gap-2 pt-4">
          <Link
            href={`/projects/${project.id}`}
            data-cursor="pointer"
            className="inline-flex items-center gap-1.5 rounded-md bg-foreground px-3 py-1.5 text-[11px] text-background transition-opacity hover:opacity-90"
          >
            Case study
            <ArrowUpRight size={12} />
          </Link>
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-[11px] text-muted transition-colors hover:text-foreground"
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
              className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-[11px] text-muted transition-colors hover:text-foreground"
              aria-label={`${project.title} live demo`}
            >
              Live
              <ArrowUpRight size={12} />
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}

export function ProjectStackScroll({ projects }: ProjectStackScrollProps) {
  if (projects.length === 0) return null;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project, index) => (
        <ProjectGridCard key={project.id} project={project} index={index} />
      ))}
    </div>
  );
}
