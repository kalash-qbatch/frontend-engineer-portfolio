"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { NAV_LINKS, SITE } from "@/constants/site";
import { ScrollLink } from "@/components/ui/ScrollLink";
import { useLenis } from "@/hooks/useLenis";

export const Footer = memo(function Footer() {
  const { scrollTo } = useLenis();

  return (
    <footer className="relative border-t border-border">
      <div className="mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-16">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div>
            <p className="font-display text-xl font-bold tracking-tight">{SITE.name}</p>
            <p className="mt-1 font-mono text-[11px] tracking-wide text-muted">
              {SITE.title} · {SITE.location}
            </p>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {NAV_LINKS.map((link) => (
              <ScrollLink
                key={link.href}
                href={link.href}
                className="text-sm text-muted transition-colors hover:text-foreground"
              >
                {link.label}
              </ScrollLink>
            ))}
          </div>

          <motion.button
            onClick={() => scrollTo(0)}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm text-muted transition-colors hover:border-border-hover hover:text-foreground"
            aria-label="Back to top"
          >
            <ArrowUp size={14} />
            Top
          </motion.button>
        </div>

        <div className="mt-10 flex flex-col justify-between gap-3 border-t border-border pt-8 md:flex-row md:items-center">
          <p className="font-mono text-[11px] text-muted/60">
            © {new Date().getFullYear()} {SITE.name}
          </p>
          <p className="font-mono text-[11px] text-muted/40">
            React · Vue · Gatsby · Three.js
          </p>
        </div>
      </div>
    </footer>
  );
});
