"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { memo } from "react";
import { SITE } from "@/constants/site";
import { PROFILE_GALLERY } from "@/components/scroll/ProfileVisual";
import { cn } from "@/lib/utils";

export const PortraitGallery = memo(function PortraitGallery({
  className,
}: {
  className?: string;
}) {
  return (
    <div className={cn("grid grid-cols-3 gap-2.5 sm:gap-3", className)}>
      {PROFILE_GALLERY.map((item, i) => (
        <motion.figure
          key={item.src}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ delay: i * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="group relative aspect-[3/4] overflow-hidden rounded-xl border border-border/70 bg-[#0a0a0a] ring-1 ring-white/[0.04]"
        >
          <Image
            src={item.src}
            alt={`${SITE.name} — ${item.label}`}
            fill
            className={cn(
              "object-cover transition-transform duration-700 group-hover:scale-105",
              item.position
            )}
            sizes="(max-width: 640px) 30vw, 180px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
          <figcaption className="absolute inset-x-0 bottom-0 z-10 p-2.5">
            <p className="font-mono text-[8px] tracking-[0.18em] text-white/55 uppercase sm:text-[9px]">
              {item.label}
            </p>
          </figcaption>
        </motion.figure>
      ))}
    </div>
  );
});
