"use client";

import { memo, useMemo } from "react";
import { motion } from "framer-motion";
import { TESTIMONIALS } from "@/constants/testimonials";
import { SectionHeading } from "@/components/ui/SectionHeading";

const TestimonialCard = memo(function TestimonialCard({
  testimonial,
}: {
  testimonial: (typeof TESTIMONIALS)[0];
}) {
  return (
    <div className="card-glow mx-3 flex h-[268px] w-[340px] shrink-0 flex-col rounded-2xl p-6">
      <p className="flex-1 text-sm leading-[1.75] text-muted">&ldquo;{testimonial.content}&rdquo;</p>
      <div className="mt-5 flex shrink-0 items-center gap-3 border-t border-border pt-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface font-mono text-[10px] font-bold">
          {testimonial.avatar}
        </div>
        <div>
          <p className="text-sm font-medium">{testimonial.name}</p>
          <p className="font-mono text-[10px] text-muted">
            {testimonial.role} · {testimonial.company}
          </p>
        </div>
      </div>
    </div>
  );
});

export const TestimonialsSection = memo(function TestimonialsSection() {
  const doubled = useMemo(() => [...TESTIMONIALS, ...TESTIMONIALS], []);

  return (
    <section className="relative overflow-hidden py-6 md:py-14" aria-label="Testimonials">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          id="testimonials"
          index="05"
          label="Testimonials"
          title="Trusted by teams"
          align="center"
        />
      </div>

      <div className="relative mt-4">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-background to-transparent" />

        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="flex w-max items-stretch"
        >
          {doubled.map((t, i) => (
            <TestimonialCard key={`${t.id}-${i}`} testimonial={t} />
          ))}
        </motion.div>
      </div>
    </section>
  );
});
