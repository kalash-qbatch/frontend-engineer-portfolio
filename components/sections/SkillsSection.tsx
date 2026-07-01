"use client";

import { SkillsShowcase } from "@/components/sections/SkillsShowcase";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function SkillsSection() {
  return (
    <section id="skills" className="relative py-6 md:py-14" aria-label="Skills">
      <div className="mx-auto max-w-3xl px-5 md:px-8">
        <SectionHeading
          index="02"
          label="Expertise"
          title="Tools I reach for daily"
          description="A curated stack for building fast, accessible, and visually rich web products."
        />

        <SkillsShowcase />
      </div>
    </section>
  );
}
