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
import { cn } from "@/lib/utils";

function loadNamed<P extends Record<string, unknown>, K extends keyof P>(key: K) {
  return (mod: P) => ({ default: mod[key] as ComponentType });
}

const CustomCursor = dynamic(
  () => import("@/components/layout/CustomCursor").then(loadNamed("CustomCursor")),
  { ssr: false }
);

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

const ScrollProgress = dynamic(
  () => import("@/components/layout/ScrollProgress").then(loadNamed("ScrollProgress")),
  { ssr: false }
);

const SiteBackground = dynamic(
  () => import("@/components/effects/BackgroundEffects").then(loadNamed("SiteBackground")),
  { ssr: false }
);

const NoiseOverlay = dynamic(
  () => import("@/components/effects/BackgroundEffects").then(loadNamed("NoiseOverlay")),
  { ssr: false }
);

const ScrollStorySection = dynamic(
  () =>
    import("@/components/sections/ScrollStorySection").then(loadNamed("ScrollStorySection")),
  { loading: () => <SectionFallback minHeight="90vh" className="mx-auto max-w-7xl px-5 md:px-8" /> }
);

const ProjectsSection = dynamic(
  () => import("@/components/sections/ProjectsSection").then(loadNamed("ProjectsSection")),
  { loading: () => <SectionFallback minHeight="60vh" className="mx-auto max-w-7xl px-5 md:px-8" /> }
);

const TestimonialsSection = dynamic(
  () =>
    import("@/components/sections/TestimonialsSection").then(loadNamed("TestimonialsSection")),
  { loading: () => <SectionFallback minHeight="40vh" className="mx-auto max-w-7xl px-5 md:px-8" /> }
);

const ContactSection = dynamic(
  () => import("@/components/sections/ContactSection").then(loadNamed("ContactSection")),
  { loading: () => <SectionFallback minHeight="55vh" className="mx-auto max-w-7xl px-5 md:px-8" /> }
);

const EndingSection = dynamic(
  () => import("@/components/sections/EndingSection").then(loadNamed("EndingSection")),
  { loading: () => <SectionFallback minHeight="35vh" /> }
);

export default function Portfolio() {
  const [bootDone, setBootDone] = useState(false);
  const idleReady = useIdleMount(bootDone);

  useEffect(() => {
    void import("@/components/canvas/HeroBlobScene");
  }, []);

  return (
    <LazyMotionProvider>
      <LenisProvider enabled={bootDone}>
        <LenisResizeOnMount />
        <div className={cn(!bootDone && "h-[100dvh] overflow-hidden")}>
          <Suspense fallback={null}>
            {idleReady && <CustomCursor />}
          </Suspense>
          <ScrollProgress />
          <SiteBackground />
          <NoiseOverlay />
          <Navbar />
          <main id="main-content" className="relative z-[2]">
            <HeroSection />
            <LazySection minHeight="120vh" rootMargin="480px 0px">
              <ScrollStorySection />
            </LazySection>
            <LazySection minHeight="60vh" rootMargin="400px 0px">
              <ProjectsSection />
            </LazySection>
            <LazySection minHeight="40vh" rootMargin="320px 0px">
              <TestimonialsSection />
            </LazySection>
            <LazySection minHeight="55vh" rootMargin="320px 0px">
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
        {!bootDone && <BootLoader onComplete={() => setBootDone(true)} />}
      </LenisProvider>
    </LazyMotionProvider>
  );
}
