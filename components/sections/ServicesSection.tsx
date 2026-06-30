"use client";

import { motion } from "framer-motion";
import { SERVICES } from "@/constants/services";
import { BentoCard } from "@/components/ui/BentoCard";
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

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service, i) => {
            const Icon = service.icon;
            return (
              <BentoCard key={service.id} delay={i * 0.06}>
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface">
                  <Icon size={18} className="text-foreground" />
                </div>
                <h3 className="font-display text-lg font-bold tracking-tight">{service.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{service.description}</p>
              </BentoCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
