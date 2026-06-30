"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollLink } from "@/components/ui/ScrollLink";
import { SITE } from "@/constants/site";
import { IMAGE_FRAMING } from "@/constants/images";
import { transition } from "@/lib/motion";
import { cn } from "@/lib/utils";

const EndingLogo = memo(function EndingLogo() {
  return (
    <div className="relative mx-auto flex h-[168px] w-[168px] items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 rounded-full border border-dashed border-accent/35"
      />
      <motion.div
        animate={{ scale: [1, 1.04, 1] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        className="relative h-[120px] w-[120px] overflow-hidden rounded-full ring-2 ring-accent/25 ring-offset-2 ring-offset-background"
      >
        <Image
          src={SITE.endingPortraitImage}
          alt={SITE.name}
          fill
          className={cn(IMAGE_FRAMING.outdoor, "saturate-[0.85] contrast-[1.08]")}
          sizes="120px"
        />
      </motion.div>
    </div>
  );
});

export const EndingSection = memo(function EndingSection() {
  return (
    <section className="relative py-6 md:py-14" aria-label="Closing">
      <div className="section-line mx-auto mb-16 max-w-7xl" />

      <div className="mx-auto max-w-3xl px-5 text-center md:px-8">
        <EndingLogo />

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={transition}
          className="mt-8 font-display text-[clamp(2rem,5vw,3.5rem)] font-bold leading-tight tracking-[-0.03em]"
        >
          Ready to ship something{" "}
          <span className="text-shimmer">unforgettable</span>?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...transition, delay: 0.1 }}
          className="mx-auto mt-5 max-w-md text-muted"
        >
          Let&apos;s turn your vision into a product people love to use.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...transition, delay: 0.2 }}
          className="mt-8"
        >
          <Button variant="default" size="lg" asChild>
            <ScrollLink href="#contact">
              Start a conversation
              <ArrowUpRight size={16} />
            </ScrollLink>
          </Button>
        </motion.div>
      </div>
    </section>
  );
});
