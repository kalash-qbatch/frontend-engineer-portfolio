"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect, useState, type ComponentType } from "react";
import { BootLoader } from "@/components/layout/BootLoader";
import { LazyMotionProvider } from "@/components/providers/LazyMotionProvider";
import { LazySection } from "@/components/ui/LazySection";
import { SectionFallback } from "@/components/ui/SectionFallback";
import { LenisProvider } from "@/hooks/useLenis";
import { useIdleMount } from "@/hooks/useIdleMount";
import { LenisResizeOnMount } from "@/components/layout/LenisResizeOnMount";
import { HeroSection } from "@/components/sections/HeroSection";
import { ScrollStorySection } from "@/components/sections/ScrollStorySection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { isHeroBlobReady, subscribeHeroBlobReady } from "@/lib/hero-blob-ready";
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
  const [heroBlobReady, setHeroBlobReady] = useState(isHeroBlobReady);
  const idleReady = useIdleMount(bootDone);

  useEffect(() => {
    void import("@/components/canvas/HeroBlobScene");
  }, []);

  useEffect(() => subscribeHeroBlobReady(() => setHeroBlobReady(true)), []);

  return (
    <LazyMotionProvider>
      <LenisProvider enabled={bootDone}>
        <LenisResizeOnMount />
        <div className={cn(!bootDone && "h-[100dvh] overflow-hidden")}>
          <SiteBackground />
          <NoiseOverlay />
          <Navbar />
          <main id="main-content" className="relative z-[2]">
            <HeroSection blobPreload={!bootDone} />
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
        {!bootDone && (
          <BootLoader canComplete={heroBlobReady} onComplete={() => setBootDone(true)} />
        )}
      </LenisProvider>
    </LazyMotionProvider>
  );
}
