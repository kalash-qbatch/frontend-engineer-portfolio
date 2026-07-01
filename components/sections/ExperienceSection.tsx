"use client";

import { ExperienceShowcase } from "@/components/sections/ExperienceShowcase";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function ExperienceSection() {
  return (
    <section id="experience" className="relative py-6 md:py-14" aria-label="Experience">
      <div className="section-line mx-auto mb-24 max-w-7xl" />

      <div className="mx-auto max-w-3xl px-5 md:px-8">
        <SectionHeading
          index="04"
          label="Experience"
          title="Where I've built"
          description="A track record of shipping at scale."
          align="center"
        />

        <ExperienceShowcase />
      </div>
    </section>
  );
}
