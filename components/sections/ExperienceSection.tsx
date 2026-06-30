"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { EXPERIENCE } from "@/constants/experience";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";
import { EASE } from "@/lib/motion";

export function ExperienceSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.8", "end 0.5"] });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section ref={ref} id="experience" className="relative py-6 md:py-14" aria-label="Experience">
      <div className="section-line mx-auto mb-24 max-w-7xl" />

      <div className="mx-auto max-w-3xl px-5 md:px-8">
        <SectionHeading
          index="04"
          label="Experience"
          title="Where I've built"
          description="A track record of shipping at scale."
          align="center"
        />

        <div className="relative mt-4">
          <div className="absolute top-0 left-[19px] h-full w-px overflow-hidden bg-border md:left-1/2 md:-translate-x-px">
            <motion.div
              className="h-full w-full origin-top bg-accent"
              style={{ scaleY: lineScale }}
            />
          </div>

          {EXPERIENCE.map((item, i) => {
            const Icon = item.icon;
            const isLeft = i % 2 === 0;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
                className={cn(
                  "relative mb-8 flex gap-6 last:mb-0 md:mb-12",
                  isLeft ? "md:flex-row" : "md:flex-row-reverse"
                )}
              >
                <div className={cn("hidden flex-1 md:block", isLeft ? "text-right" : "text-left")}>
                  <span className="font-mono text-[11px] tracking-wide text-accent">{item.period}</span>
                </div>

                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.08, type: "spring", stiffness: 200 }}
                  className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-background md:absolute md:left-1/2 md:-translate-x-1/2"
                >
                  <Icon size={16} className="text-muted" />
                </motion.div>

                <div className="card-glow flex-1 rounded-2xl p-6">
                  <span className="font-mono text-[11px] text-accent md:hidden">{item.period}</span>
                  <h3 className="mt-1 font-display text-lg font-bold tracking-tight">{item.title}</h3>
                  <p className="text-sm text-muted">{item.organization}</p>
                  <p className="mt-3 text-sm leading-relaxed text-muted/80">{item.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
