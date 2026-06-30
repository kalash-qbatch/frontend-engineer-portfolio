"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { SITE } from "@/constants/site";
import { SKILLS } from "@/constants/skills";
import { BentoCard } from "@/components/ui/BentoCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/badge";

const STATS = [
  { value: "6+", label: "Years building products" },
  { value: "40+", label: "Projects shipped" },
  { value: "15+", label: "Teams & clients" },
  { value: "99", label: "Avg. Lighthouse score" },
];

export function AboutSection() {
  return (
    <section id="about" className="relative py-6 md:py-14" aria-label="About">
      <div className="section-line mx-auto mb-24 max-w-7xl" />

      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          index="01"
          label="About"
          title="Engineering with taste"
          description="I build interfaces where performance, accessibility, and motion design work together — not against each other."
        />

        <div className="grid gap-4 md:grid-cols-12 md:grid-rows-2 md:gap-4">
          {/* Profile bento — large */}
          <BentoCard className="md:col-span-5 md:row-span-2" delay={0}>
            <div className="flex h-full flex-col justify-between">
              <div>
                <p className="font-mono text-[10px] tracking-[0.2em] text-accent uppercase">About</p>
                <h3 className="mt-2 font-display text-2xl font-bold tracking-tight">{SITE.name}</h3>
                <p className="mt-1 text-muted">{SITE.title}</p>
                <p className="mt-1 font-mono text-xs text-muted/60">{SITE.location}</p>
              </div>
              <a
                href="#contact"
                className="group mt-8 inline-flex items-center gap-2 text-sm text-foreground transition-colors hover:text-accent"
              >
                Get in touch
                <ArrowUpRight
                  size={14}
                  className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>
            </div>
          </BentoCard>

          {/* Bio */}
          <BentoCard className="md:col-span-7" delay={0.05}>
            <p className="text-base leading-[1.8] text-muted md:text-lg">
              I specialize in production-grade React & Next.js applications with immersive 3D
              layers, scroll-driven narratives, and micro-interactions that respect{" "}
              <code className="rounded bg-surface px-1.5 py-0.5 font-mono text-xs text-foreground">
                prefers-reduced-motion
              </code>
              . From Stripe-scale dashboards to award-worthy agency sites — I ship code that
              recruiters and users both remember.
            </p>
          </BentoCard>

          {/* Stats grid */}
          <BentoCard className="md:col-span-7" delay={0.1} noPadding>
            <div className="grid grid-cols-2 divide-x divide-border md:grid-cols-4">
              {STATS.map((stat) => (
                <div key={stat.label} className="p-6 text-center md:p-8">
                  <p className="font-display text-3xl font-bold tracking-tight md:text-4xl">
                    {stat.value}
                  </p>
                  <p className="mt-2 font-mono text-[10px] leading-relaxed tracking-wide text-muted uppercase">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </BentoCard>
        </div>

        {/* Tech pills */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-4 flex flex-wrap gap-2"
        >
          {SKILLS.slice(0, 10).map((skill) => (
            <Badge key={skill.name} variant="outline">
              {skill.name}
            </Badge>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
