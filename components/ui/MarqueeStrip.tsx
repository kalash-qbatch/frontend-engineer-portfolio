"use client";

import type { IconType } from "react-icons";
import { cn } from "@/lib/utils";

export type MarqueeStripItem = {
  id: string;
  label: string;
  icon?: IconType;
  color?: string;
};

type MarqueeStripProps = {
  items: MarqueeStripItem[];
  className?: string;
};

export function MarqueeStrip({ items, className }: MarqueeStripProps) {
  const doubled = [...items, ...items];

  return (
    <div
      className={cn(
        "flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]",
        className
      )}
    >
      <div className="animate-marquee flex shrink-0 items-center gap-6 whitespace-nowrap">
        {doubled.map((item, i) => {
          const Icon = item.icon;

          return (
            <span key={`${item.id}-${i}`} className="flex items-center gap-6">
              <span className="flex items-center gap-2.5">
                {Icon ? (
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border/60 bg-white/[0.03]">
                    <Icon size={14} style={{ color: item.color }} aria-hidden />
                  </span>
                ) : null}
                <span className="font-mono text-[10px] tracking-[0.22em] text-muted/70 uppercase">
                  {item.label}
                </span>
              </span>
              <span className="h-1 w-1 rounded-full bg-accent/50" aria-hidden />
            </span>
          );
        })}
      </div>
    </div>
  );
}
