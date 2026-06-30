"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Search } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { NAV_LINKS } from "@/constants/site";
import { useLenis } from "@/hooks/useLenis";

const COMMANDS = [
  ...NAV_LINKS.map((l) => ({ label: `Go to ${l.label}`, href: l.href })),
  { label: "View Projects", href: "#projects" },
  { label: "Download Resume", href: "/resume.pdf" },
  { label: "Contact", href: "#contact" },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { scrollTo } = useLenis();

  const filtered = COMMANDS.filter((c) =>
    c.label.toLowerCase().includes(query.toLowerCase())
  );

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      setOpen((prev) => !prev);
    }
    if (e.key === "Escape") setOpen(false);
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const execute = (href: string) => {
    setOpen(false);
    setQuery("");
    if (href.startsWith("#")) {
      scrollTo(href);
    } else {
      window.open(href, "_blank");
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-50 flex h-10 items-center gap-2 rounded-xl border border-border bg-background/80 px-3 text-xs text-muted backdrop-blur-xl transition-colors hover:border-border-hover hover:text-foreground"
        aria-label="Open command palette"
      >
        <Search size={14} />
        <kbd className="hidden rounded border border-border px-1.5 py-0.5 font-mono text-[10px] sm:inline">
          ⌘K
        </kbd>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex items-start justify-center bg-background/80 pt-[18vh] backdrop-blur-md"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: -12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -12 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md overflow-hidden rounded-2xl border border-border bg-background shadow-2xl"
              role="dialog"
              aria-label="Command palette"
            >
              <div className="flex items-center gap-3 border-b border-border px-4">
                <Search size={16} className="text-muted" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search…"
                  className="flex-1 bg-transparent py-4 text-sm outline-none placeholder:text-muted/50"
                />
              </div>
              <div className="max-h-60 overflow-y-auto p-2" data-lenis-prevent>
                {filtered.map((cmd) => (
                  <button
                    key={cmd.label}
                    onClick={() => execute(cmd.href)}
                    className="flex w-full rounded-lg px-3 py-2.5 text-left text-sm text-muted transition-colors hover:bg-surface hover:text-foreground"
                  >
                    {cmd.label}
                  </button>
                ))}
                {filtered.length === 0 && (
                  <p className="px-3 py-8 text-center text-sm text-muted">No results</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
