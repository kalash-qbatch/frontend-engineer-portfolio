"use client";

import dynamic from "next/dynamic";
import { memo, useEffect, useMemo } from "react";
import { GlobeFallback } from "@/components/canvas/SkillGlobeScene";
import { Viewport3D } from "@/components/canvas/Viewport3D";
import { useHeroInView } from "@/hooks/useHeroInView";
import { useWebGL } from "@/hooks/useWebGL";
import type { Skill } from "@/constants/skills";

const SkillGlobeScene = dynamic(
  () => import("@/components/canvas/SkillGlobeScene").then((m) => m.SkillGlobeScene),
  {
    ssr: false,
    loading: () => <div className="h-full w-full bg-[#0a0a0a]" aria-hidden />,
  }
);

interface SkillCarouselProps {
  skills: Skill[];
  highlighted?: string | null;
  transitionKey?: string;
  accentColor?: string;
  onHover?: (name: string | null) => void;
}

export const SkillCarousel = memo(function SkillCarousel({
  skills,
  highlighted = null,
  transitionKey = "all",
  accentColor = "#8B5CF6",
  onHover,
}: SkillCarouselProps) {
  const canUse3D = useWebGL();
  const heroInView = useHeroInView();
  const showGlobe3D = canUse3D && !heroInView;

  useEffect(() => {
    if (!showGlobe3D) return;
    void import("@/components/canvas/SkillGlobeScene");
  }, [showGlobe3D]);

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#0a0a0a]">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.14]" />
      <div
        className="pointer-events-none absolute inset-0 transition-[background] duration-700"
        style={{
          background: `radial-gradient(ellipse 90% 80% at 50% 40%, ${accentColor}24, transparent 70%)`,
        }}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {showGlobe3D ? (
        <Viewport3D className="absolute inset-0" rootMargin="120px 0px">
          <SkillGlobeScene
            skills={skills}
            highlighted={highlighted}
            transitionKey={transitionKey}
            onHover={onHover}
            className="h-full w-full"
          />
        </Viewport3D>
      ) : (
        <GlobeFallback skills={skills} transitionKey={transitionKey} />
      )}
    </div>
  );
});
