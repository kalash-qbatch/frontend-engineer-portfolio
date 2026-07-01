"use client";

import { memo } from "react";
import { NoiseOverlay, SiteBackground } from "@/components/effects/BackgroundEffects";
import { ScrollProgress } from "@/components/layout/ScrollProgress";

export const DeferredChrome = memo(function DeferredChrome() {
  return (
    <>
      <ScrollProgress />
      <SiteBackground />
      <NoiseOverlay />
    </>
  );
});
