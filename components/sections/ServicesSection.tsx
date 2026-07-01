"use client";

import { ServicesShowcase } from "@/components/sections/ServicesShowcase";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function ServicesSection() {
  return (
    <section id="services" className="relative py-6 md:py-14" aria-label="Services">
      <div className="section-line mx-auto mb-24 max-w-7xl" />

      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          index="05"
          label="Services"
          title="How I can help"
          description="Focused offerings for teams that care about craft."
          align="center"
        />

        <ServicesShowcase />
      </div>
    </section>
  );
}
