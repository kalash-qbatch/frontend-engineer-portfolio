"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { memo, useCallback, useState } from "react";
import { EXPERIENCE, type TimelineItem } from "@/constants/experience";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

const MARQUEE_ITEMS = EXPERIENCE.flatMap((item) => [item.organization, item.period]);

function ExperienceMarquee() {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
      <div className="animate-marquee flex shrink-0 items-center gap-6 whitespace-nowrap">
        {items.map((item, i) => (
          <span key={`${item}-${i}`} className="flex items-center gap-6">
            <span className="font-mono text-[10px] tracking-[0.22em] text-muted/70 uppercase">
              {item}
            </span>
            <span className="h-1 w-1 rounded-full bg-accent/50" aria-hidden />
          </span>
        ))}
      </div>
    </div>
  );
}

const ExperienceRow = memo(function ExperienceRow({
  item,
  index,
  active,
  onSelect,
  reducedMotion,
}: {
  item: TimelineItem;
  index: number;
  active: boolean;
  onSelect: () => void;
  reducedMotion: boolean;
}) {
  const Icon = item.icon;

  return (
    <button
      type="button"
      onClick={onSelect}
      onMouseEnter={onSelect}
      aria-expanded={active}
      className={cn(
        "group relative w-full overflow-hidden text-left transition-colors duration-500",
        active ? "bg-white/[0.03]" : "hover:bg-white/[0.02]"
      )}
      style={
        {
          "--item": item.color,
          "--item-glow": `${item.color}40`,
        } as React.CSSProperties
      }
    >
      <motion.span
        className="absolute inset-y-0 left-0 w-[3px] rounded-full"
        style={{ background: item.color }}
        initial={false}
        animate={{ opacity: active ? 1 : 0, scaleY: active ? 1 : 0.4 }}
        transition={{ duration: reducedMotion ? 0 : 0.35, ease: EASE }}
        aria-hidden
      />

      <div
        className={cn(
          "pointer-events-none absolute -right-4 -bottom-6 opacity-[0.04] transition-all duration-700",
          active ? "scale-110 opacity-[0.07]" : "scale-100"
        )}
        aria-hidden
      >
        <Icon size={120} style={{ color: item.color }} />
      </div>

      <div
        className={cn(
          "pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500",
          active && "opacity-100"
        )}
        style={{
          background: `radial-gradient(ellipse 70% 80% at 85% 50%, ${item.color}14, transparent 65%)`,
        }}
        aria-hidden
      />

      <div className="relative flex items-start gap-4 px-5 py-4 sm:px-6 sm:py-5">
        <span
          className={cn(
            "mt-0.5 shrink-0 font-mono text-[11px] tracking-widest transition-colors duration-300",
            active ? "text-foreground/80" : "text-muted/40"
          )}
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="mb-1.5 flex flex-wrap items-center gap-2">
                <span
                  className={cn(
                    "inline-block rounded-md px-2 py-0.5 font-mono text-[9px] tracking-wide uppercase transition-all duration-300",
                    active ? "opacity-100" : "opacity-60"
                  )}
                  style={{
                    color: item.color,
                    backgroundColor: active ? `${item.color}18` : `${item.color}0c`,
                  }}
                >
                  {item.tag}
                </span>
                <span
                  className={cn(
                    "font-mono text-[10px] transition-colors duration-300",
                    active ? "text-accent" : "text-muted/50"
                  )}
                >
                  {item.period}
                </span>
              </div>
              <h3
                className={cn(
                  "font-display font-bold tracking-tight transition-colors duration-300",
                  active ? "text-base text-foreground sm:text-lg" : "text-sm text-foreground/80"
                )}
              >
                {item.title}
              </h3>
              <p
                className={cn(
                  "mt-0.5 text-sm transition-colors duration-300",
                  active ? "text-muted" : "text-muted/60"
                )}
              >
                {item.organization}
              </p>
            </div>

            <div
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-all duration-500",
                active
                  ? "border-white/12 shadow-[0_0_28px_-8px_var(--item-glow)]"
                  : "border-border/60 bg-surface/40"
              )}
              style={active ? { backgroundColor: `${item.color}16` } : undefined}
            >
              <Icon
                size={16}
                style={{ color: active ? item.color : "var(--muted)" }}
                aria-hidden
              />
            </div>
          </div>

          <AnimatePresence initial={false}>
            {active && (
              <motion.div
                key="body"
                initial={reducedMotion ? false : { height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={reducedMotion ? undefined : { height: 0, opacity: 0 }}
                transition={{ duration: reducedMotion ? 0 : 0.4, ease: EASE }}
                className="overflow-hidden"
              >
                <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted">
                  {item.description}
                </p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {item.highlights.map((highlight) => (
                    <li
                      key={highlight}
                      className="rounded-full border border-border/70 bg-background/40 px-2.5 py-1 font-mono text-[9px] tracking-wide text-muted/90"
                    >
                      {highlight}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </button>
  );
});

export const ExperienceShowcase = memo(function ExperienceShowcase() {
  const reducedMotion = useReducedMotion();
  const [activeId, setActiveId] = useState(EXPERIENCE[0].id);
  const onSelect = useCallback((id: string) => setActiveId(id), []);

  return (
    <div className="card-glow overflow-hidden rounded-2xl">
      <div className="relative overflow-hidden border-b border-border">
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-violet-600/10 via-transparent to-amber-500/8"
          aria-hidden
        />
        <div className="relative py-3.5">
          <ExperienceMarquee />
        </div>
      </div>

      <div className="divide-y divide-border/50">
        {EXPERIENCE.map((item, i) => (
          <ExperienceRow
            key={item.id}
            item={item}
            index={i}
            active={activeId === item.id}
            onSelect={() => onSelect(item.id)}
            reducedMotion={reducedMotion}
          />
        ))}
      </div>

      <div className="flex items-center justify-between gap-4 border-t border-border px-5 py-3.5 sm:px-6">
        <p className="font-mono text-[10px] tracking-widest text-muted/70 uppercase">
          6+ years shipping
        </p>
        <a
          href="#contact"
          className="group inline-flex items-center gap-1.5 font-mono text-[10px] tracking-wide text-foreground/80 uppercase transition-colors hover:text-accent"
        >
          View resume
          <ArrowUpRight
            size={12}
            className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </a>
      </div>
    </div>
  );
});
