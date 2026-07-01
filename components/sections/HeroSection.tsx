"use client";

import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowUpRight, Download } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRef, useEffect, useState, memo } from "react";
import { IMAGE_FRAMING } from "@/constants/images";
import { SITE } from "@/constants/site";
import { HeroBlobFallback } from "@/components/canvas/HeroBlobScene";
import { Viewport3D } from "@/components/canvas/Viewport3D";
import { IdentityStrip } from "@/components/ui/ProfileAvatar";
import { Button } from "@/components/ui/button";
import { ScrollLink } from "@/components/ui/ScrollLink";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useWebGL } from "@/hooks/useWebGL";
import { markHeroBlobReady } from "@/lib/hero-blob-ready";
import { EASE, heroStagger, slideInLeft } from "@/lib/motion";
import { cn } from "@/lib/utils";

const HeroBlobScene = dynamic(
  () => import("@/components/canvas/HeroBlobScene").then((m) => ({ default: m.HeroBlobScene })),
  { ssr: false, loading: () => <HeroBlobFallback /> }
);

const TechMarquee = dynamic(
  () => import("@/components/effects/TechMarquee").then((m) => ({ default: m.TechMarquee })),
  { ssr: false }
);

const HeroPortrait = dynamic(
  () => import("@/components/sections/HeroPortrait").then((m) => ({ default: m.HeroPortrait })),
  { ssr: false }
);

const SplitText = dynamic(
  () => import("@/components/ui/SplitText").then((m) => ({ default: m.SplitText })),
  { ssr: false }
);

export const HeroSection = memo(function HeroSection({
  blobPreload = false,
}: {
  blobPreload?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const scrollRef = useRef(0);
  const cursorRef = useRef({ x: 0, y: 0, active: false });
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const portraitY = useTransform(scrollYProgress, [0, 1], [0, 40]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const canUse3D = useWebGL();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!canUse3D) markHeroBlobReady();
  }, [mounted, canUse3D]);

  useEffect(() => {
    if (!mounted) return;
    const timeout = window.setTimeout(() => markHeroBlobReady(), 8000);
    return () => window.clearTimeout(timeout);
  }, [mounted]);

  const mobileMotion = mounted && isMobile;

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    scrollRef.current = v;
  });

  useEffect(() => {
    if (reducedMotion || isMobile) return;

    const onMove = (e: MouseEvent) => {
      const section = ref.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const inside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      cursorRef.current.active = inside;
      if (!inside) return;

      const nx = (e.clientX - rect.left) / rect.width;
      const ny = (e.clientY - rect.top) / rect.height;
      cursorRef.current.x = (nx - 0.5) * 2;
      cursorRef.current.y = -((ny - 0.5) * 2);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [reducedMotion, isMobile]);

  return (
    <section
      ref={ref}
      id="hero"
      className="relative flex min-h-[100dvh] flex-col justify-end overflow-x-clip"
      aria-label="Hero"
    >
      <motion.div
        className="absolute inset-0 z-[1]"
        style={{ opacity: blobPreload ? 0 : contentOpacity }}
        aria-hidden={blobPreload}
      >
        <HeroBlobFallback cursorRef={cursorRef} />
        {mounted && canUse3D && (
          <Viewport3D className="absolute inset-0" rootMargin="120px 0px" threshold={0}>
            <HeroBlobScene
              scrollRef={scrollRef}
              cursorRef={cursorRef}
              quality={isMobile ? "low" : "high"}
              onCanvasFailed={markHeroBlobReady}
            />
          </Viewport3D>
        )}
      </motion.div>

      <HeroPortrait parallaxY={portraitY} />

      <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-t from-background via-background/25 to-transparent" />
      <div className="pointer-events-none absolute inset-0 z-[2] bg-[radial-gradient(ellipse_55%_50%_at_58%_40%,rgba(139,92,246,0.12),transparent)]" />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-32 pt-28 md:px-8 md:pb-40 md:pt-36"
      >
        <motion.div
          key={mounted && isMobile ? "mobile-hero" : undefined}
          className="max-w-4xl"
          initial={mounted && isMobile ? "hidden" : false}
          animate={mounted && isMobile ? "visible" : false}
          variants={heroStagger}
        >
          <motion.div
            variants={mobileMotion ? slideInLeft : undefined}
            initial={mobileMotion ? undefined : { opacity: 0, y: 10 }}
            animate={mobileMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: EASE, delay: 0.2 }}
            className="mb-7"
          >
            <IdentityStrip />
          </motion.div>

          <motion.p
            variants={mobileMotion ? slideInLeft : undefined}
            initial={mobileMotion ? undefined : { opacity: 0, y: 12 }}
            animate={mobileMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.35 }}
            className="mb-5 font-mono text-[11px] tracking-[0.25em] text-muted uppercase"
          >
            {SITE.location} · Available 2026
          </motion.p>

          <motion.div
            variants={mobileMotion ? slideInLeft : undefined}
            className="relative"
          >
            {mobileMotion && (
              <motion.div
                aria-hidden
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: [0.35, 0.6, 0.35], scale: [1, 1.08, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
                className="pointer-events-none absolute -left-6 top-1/2 h-32 w-48 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(139,92,246,0.35),transparent_70%)] blur-2xl"
              />
            )}
            <h1 className="relative flex flex-col items-start font-display font-bold leading-[0.92]">
              <SplitText
                key={mobileMotion ? "name-mobile" : "name-desktop"}
                text={SITE.name}
                as="span"
                by="word"
                delay={0.45}
                accent={mobileMotion}
                className="tracking-[-0.04em] text-[clamp(1.85rem,7.2vw,5.75rem)]"
              />
              <span className="mt-2 inline-flex tracking-[-0.04em] text-[clamp(1.65rem,6vw,5rem)] text-muted">
                <SplitText
                  key={mobileMotion ? "title-mobile" : "title-desktop"}
                  text={SITE.title}
                  as="span"
                  by={mobileMotion ? "char" : "word"}
                  delay={0.85}
                />
              </span>
            </h1>
          </motion.div>

          <motion.p
            variants={mobileMotion ? slideInLeft : undefined}
            initial={mobileMotion ? undefined : { opacity: 0, y: 20, filter: "blur(6px)" }}
            animate={mobileMotion ? undefined : { opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.7, ease: EASE, delay: 1 }}
            className="mt-6 max-w-lg text-base leading-relaxed text-muted md:text-lg"
          >
            {SITE.tagline} Crafting fast, expressive web experiences with React, Next.js, Vue, Gatsby, WebGL, and motion.
          </motion.p>

          <motion.div
            variants={mobileMotion ? slideInLeft : undefined}
            initial={mobileMotion ? undefined : { opacity: 0, y: 16 }}
            animate={mobileMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 1.15 }}
            className="pointer-events-auto mt-10 flex flex-wrap gap-3"
          >
            <Button variant="default" size="lg" asChild data-cursor="pointer">
              <ScrollLink href="#projects">
                View work
                <ArrowUpRight size={16} />
              </ScrollLink>
            </Button>
            <Button variant="outline" size="lg" asChild data-cursor="pointer">
              <a href={SITE.resumeUrl}>
                <Download size={16} />
                Resume
              </a>
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: mobileMotion ? 72 : 0, scale: mobileMotion ? 0.86 : 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={
            mobileMotion
              ? { type: "spring", stiffness: 70, damping: 14, mass: 0.9, delay: 0.3 }
              : { duration: 0.9, ease: EASE, delay: 0.5 }
          }
          className="relative mx-auto mt-10 flex h-[min(52vh,420px)] w-full max-w-[300px] items-end justify-center md:hidden"
        >
          {mobileMotion && (
            <motion.div
              aria-hidden
              className="absolute bottom-8 left-1/2 h-40 w-56 -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(139,92,246,0.45),transparent_68%)] blur-2xl"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: [0.5, 0.85, 0.5], scale: [1, 1.12, 1] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
            />
          )}
          <motion.div
            animate={mobileMotion ? { y: [0, -10, 0] } : undefined}
            transition={mobileMotion ? { duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1.2 } : undefined}
            className="relative z-[1] h-full"
          >
            <Image
              src={SITE.heroPortraitImage}
              alt={SITE.name}
              width={433}
              height={576}
              priority
              className={cn(
                "h-full w-auto drop-shadow-[0_16px_48px_rgba(0,0,0,0.55)]",
                IMAGE_FRAMING.heroCutout
              )}
              sizes="300px"
            />
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-28 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2"
      >
        <span className="font-mono text-[10px] tracking-[0.3em] text-muted">SCROLL</span>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
          <ArrowDown size={16} className="text-muted" />
        </motion.div>
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0 z-10">
        <TechMarquee />
      </div>
    </section>
  );
});
