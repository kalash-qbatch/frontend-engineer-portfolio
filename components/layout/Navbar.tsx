"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useState, memo, useCallback } from "react";
import { NAV_LINKS, SITE } from "@/constants/site";
import { NavMenu3D } from "@/components/canvas/NavMenu3D";
import { ProfileAvatar } from "@/components/ui/ProfileAvatar";
import { Button } from "@/components/ui/button";
import { ScrollLink } from "@/components/ui/ScrollLink";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { EASE, fadeInUp, staggerContainer } from "@/lib/motion";
import { cn } from "@/lib/utils";

const menuItemVariants = {
  hidden: { opacity: 0, x: -16, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.45, ease: EASE },
  },
};

export const Navbar = memo(function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const closeMenu = useCallback(() => setMobileOpen(false), []);

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
        className="fixed top-0 left-0 right-0 z-50 px-4 pt-5 md:px-6"
      >
        <nav
          className={cn(
            "mx-auto flex max-w-5xl items-center justify-between rounded-2xl border px-4 py-2.5 transition-all duration-500 md:px-5",
            scrolled || mobileOpen
              ? "border-border bg-background/70 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.5)] backdrop-blur-2xl"
              : "border-transparent bg-transparent"
          )}
          aria-label="Main navigation"
        >
          <ScrollLink
            href="#hero"
            className="flex items-center gap-2.5 transition-opacity hover:opacity-90"
            aria-label="Back to top"
            onClick={closeMenu}
          >
            <ProfileAvatar size="xs" shape="rounded" priority className="ring-0" />
            <span className="hidden text-sm font-medium text-muted sm:block">{SITE.name}</span>
          </ScrollLink>

          <div className="hidden items-center md:flex">
            <NavMenu3D />
          </div>

          <div className="hidden md:block">
            <Button variant="default" size="sm" asChild>
              <ScrollLink href="#contact">Hire me</ScrollLink>
            </Button>
          </div>

          <button
            className="relative rounded-lg p-2 text-muted hover:bg-surface hover:text-foreground md:hidden"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            <AnimatePresence mode="wait" initial={false}>
              {mobileOpen ? (
                <motion.span
                  key="close"
                  initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 90, scale: 0.8 }}
                  transition={{ duration: 0.2, ease: EASE }}
                  className="block"
                >
                  <X size={20} />
                </motion.span>
              ) : (
                <motion.span
                  key="menu"
                  initial={{ opacity: 0, rotate: 90, scale: 0.8 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: -90, scale: 0.8 }}
                  transition={{ duration: 0.2, ease: EASE }}
                  className="block"
                >
                  <Menu size={20} />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={closeMenu}
              className="fixed inset-0 z-40 bg-black/65 backdrop-blur-md md:hidden"
            />

            <motion.div
              initial={
                reducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: -24, scale: 0.94, filter: "blur(8px)" }
              }
              animate={
                reducedMotion
                  ? { opacity: 1 }
                  : { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }
              }
              exit={
                reducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: -16, scale: 0.97, filter: "blur(4px)" }
              }
              transition={{ type: "spring", damping: 30, stiffness: 340 }}
              className="fixed inset-x-4 top-[72px] z-50 overflow-hidden rounded-2xl border border-border bg-background/95 shadow-[0_24px_80px_-20px_rgba(0,0,0,0.8)] backdrop-blur-2xl md:hidden"
            >
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />

              <motion.div
                variants={reducedMotion ? undefined : staggerContainer}
                initial="hidden"
                animate="visible"
                className="flex flex-col gap-1 p-4"
              >
                {NAV_LINKS.map((link, i) => (
                  <motion.div
                    key={link.href}
                    variants={reducedMotion ? undefined : menuItemVariants}
                    custom={i}
                  >
                    <ScrollLink
                      href={link.href}
                      onClick={closeMenu}
                      className="flex items-center justify-between rounded-xl px-3 py-3 text-base font-medium text-foreground transition-colors hover:bg-surface"
                    >
                      {link.label}
                      <span className="font-mono text-[10px] text-muted">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </ScrollLink>
                  </motion.div>
                ))}

                <motion.div
                  variants={reducedMotion ? undefined : fadeInUp}
                  className="mt-3 border-t border-border pt-3"
                >
                  <Button variant="default" className="w-full" size="lg" asChild>
                    <ScrollLink href="#contact" onClick={closeMenu}>
                      Hire me
                    </ScrollLink>
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
});
