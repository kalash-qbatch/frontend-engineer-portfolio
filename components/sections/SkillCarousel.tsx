"use client";

import dynamic from "next/dynamic";
import { memo, useMemo } from "react";
import { GlobeFallback } from "@/components/canvas/SkillGlobeScene";
import { Viewport3D } from "@/components/canvas/Viewport3D";
import { useHeroInView } from "@/hooks/useHeroInView";
import { useWebGL } from "@/hooks/useWebGL";
import type { Skill } from "@/constants/skills";

const SkillGlobeScene = dynamic(
  () => import("@/components/canvas/SkillGlobeScene").then((m) => m.SkillGlobeScene),
  {
    ssr: false,
    loading: () => <div className="h-full w-full animate-pulse bg-[#0a0a0a]" />,
  }
);

interface SkillCarouselProps {
  skills: Skill[];
  highlighted?: string | null;
  transitionKey?: string;
  onHover?: (name: string | null) => void;
}

export const SkillCarousel = memo(function SkillCarousel({
  skills,
  highlighted = null,
  transitionKey = "all",
  onHover,
}: SkillCarouselProps) {
  const canUse3D = useWebGL();
  const heroInView = useHeroInView();
  const stableSkills = useMemo(() => skills, [skills]);
  const showGlobe3D = canUse3D && !heroInView;

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#0a0a0a]">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.18]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_50%_45%,rgba(139,92,246,0.12),transparent)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_55%,rgba(59,130,246,0.08),transparent)]" />

      {showGlobe3D ? (
        <Viewport3D className="absolute inset-0">
          <SkillGlobeScene
            skills={stableSkills}
            highlighted={highlighted}
            transitionKey={transitionKey}
            onHover={onHover}
            className="h-full w-full"
          />
        </Viewport3D>
      ) : (
        <GlobeFallback skills={stableSkills} transitionKey={transitionKey} />
      )}
    </div>
  );
});
