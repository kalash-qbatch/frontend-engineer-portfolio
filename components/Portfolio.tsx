"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect, useLayoutEffect, useState, type ComponentType } from "react";
import { BootLoader } from "@/components/layout/BootLoader";
import { LazyMotionProvider } from "@/components/providers/LazyMotionProvider";
import { LazySection } from "@/components/ui/LazySection";
import { SectionFallback } from "@/components/ui/SectionFallback";
import { LenisProvider } from "@/hooks/useLenis";
import { useIdleMount } from "@/hooks/useIdleMount";
import { LenisResizeOnMount } from "@/components/layout/LenisResizeOnMount";
import { HomeHashScroller } from "@/components/layout/HomeHashScroller";
import { HeroSection } from "@/components/sections/HeroSection";
import { ScrollStorySection } from "@/components/sections/ScrollStorySection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { isHeroBlobReady, markHeroBlobReady, subscribeHeroBlobReady } from "@/lib/hero-blob-ready";
import { markBootComplete, shouldSkipBootLoader } from "@/lib/boot";
import {
  emitSectionNavigate,
  resolveHomeSectionTarget,
  scrollToSectionInstant,
} from "@/lib/scroll-target";
import { cn } from "@/lib/utils";

function loadNamed<P extends Record<string, unknown>, K extends keyof P>(key: K) {
  return (mod: P) => ({ default: mod[key] as ComponentType });
}

const CommandPalette = dynamic(
  () => import("@/components/layout/CommandPalette").then(loadNamed("CommandPalette")),
  { ssr: false }
);

const Navbar = dynamic(
  () => import("@/components/layout/Navbar").then(loadNamed("Navbar")),
  { ssr: false, loading: () => <div className="h-[72px]" aria-hidden /> }
);

const Footer = dynamic(
  () => import("@/components/layout/Footer").then(loadNamed("Footer")),
  { loading: () => <footer className="h-40" aria-hidden /> }
);

const SiteBackground = dynamic(
  () => import("@/components/effects/BackgroundEffects").then(loadNamed("SiteBackground")),
  { ssr: false }
);

const NoiseOverlay = dynamic(
  () => import("@/components/effects/BackgroundEffects").then(loadNamed("NoiseOverlay")),
  { ssr: false }
);

const TestimonialsSection = dynamic(
  () =>
    import("@/components/sections/TestimonialsSection").then(loadNamed("TestimonialsSection")),
  { loading: () => <SectionFallback minHeight="40vh" className="mx-auto max-w-7xl px-5 md:px-8" /> }
);

const EndingSection = dynamic(
  () => import("@/components/sections/EndingSection").then(loadNamed("EndingSection")),
  { loading: () => <SectionFallback minHeight="35vh" /> }
);

export default function Portfolio() {
  const [bootDone, setBootDone] = useState(false);
  const [skipBoot, setSkipBoot] = useState(false);
  const [returnSection, setReturnSection] = useState<string | null>(null);
  const [heroBlobReady, setHeroBlobReady] = useState(isHeroBlobReady);
  const idleReady = useIdleMount(bootDone);

  useLayoutEffect(() => {
    const targetSection = resolveHomeSectionTarget();

    if (targetSection) {
      window.history.replaceState(null, "", `#${targetSection}`);
      if (!scrollToSectionInstant(targetSection)) {
        requestAnimationFrame(() => scrollToSectionInstant(targetSection));
      }
      emitSectionNavigate(targetSection);
      setReturnSection(targetSection);
      markBootComplete();
      markHeroBlobReady();
      setSkipBoot(true);
      setBootDone(true);
      return;
    }

    if (shouldSkipBootLoader()) {
      markBootComplete();
      markHeroBlobReady();
      setSkipBoot(true);
      setBootDone(true);
      return;
    }

    void import("@/components/canvas/HeroBlobScene");
  }, []);

  useEffect(() => subscribeHeroBlobReady(() => setHeroBlobReady(true)), []);

  return (
    <LazyMotionProvider>
      <LenisProvider enabled={bootDone}>
        <LenisResizeOnMount />
        <HomeHashScroller sectionId={returnSection} />
        <div className={cn(!bootDone && !skipBoot && "h-[100dvh] overflow-hidden")}>
          <SiteBackground />
          <NoiseOverlay />
          <Navbar />
          <main id="main-content" className="relative z-[2]">
            <HeroSection blobPreload={!bootDone && !returnSection} />
            <LazySection eager minHeight="120vh" rootMargin="480px 0px">
              <ScrollStorySection />
            </LazySection>
            <LazySection eager minHeight="60vh" rootMargin="400px 0px">
              <ProjectsSection />
            </LazySection>
            <LazySection eager minHeight="40vh" rootMargin="320px 0px">
              <TestimonialsSection />
            </LazySection>
            <LazySection eager minHeight="55vh" rootMargin="320px 0px">
              <ContactSection />
            </LazySection>
            <LazySection minHeight="35vh" rootMargin="240px 0px">
              <EndingSection />
            </LazySection>
          </main>
          <Footer />
          <Suspense fallback={null}>
            {idleReady && <CommandPalette />}
          </Suspense>
        </div>
        {!bootDone && !skipBoot && (
          <BootLoader
            canComplete={heroBlobReady}
            onComplete={() => {
              markBootComplete();
              setBootDone(true);
            }}
          />
        )}
      </LenisProvider>
    </LazyMotionProvider>
  );
}
