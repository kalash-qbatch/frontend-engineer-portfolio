"use client";

import Image from "next/image";
import { memo, useCallback, useMemo, useState } from "react";
import type { ScrollChapter } from "@/constants/scrollStory";
import { IMAGE_FRAMING, PORTFOLIO_IMAGES } from "@/constants/images";
import { SITE } from "@/constants/site";
import {
  PortraitMetaStack,
  PortraitOverlayLabels,
} from "@/components/scroll/PortraitTextChip";
import { cn } from "@/lib/utils";

export type PortraitVariant = "featured" | "ambient";

type ProfileVisualProps = {
  chapter: Pick<
    ScrollChapter,
    | "caption"
    | "image"
    | "imageKey"
    | "imageGradient"
    | "id"
    | "index"
    | "label"
    | "imageVariant"
    | "imageObjectPosition"
    | "imageTreatment"
    | "imageTone"
  >;
  className?: string;
  size?: "sm" | "md" | "lg" | "fill";
};

const FRAME_WIDTH = {
  fill: "h-full w-full",
  lg: "w-full",
  md: "w-full max-w-[200px]",
  sm: "w-full max-w-[240px]",
} as const;

const TONE_OVERLAY = {
  warm: "from-amber-950/50 via-black/10 to-violet-950/40",
  cool: "from-slate-950/55 via-black/10 to-cyan-950/35",
  neutral: "from-black/65 via-black/15 to-transparent",
  mono: "from-black/70 via-black/20 to-transparent",
} as const;

const TONE_RING = {
  warm: "ring-amber-400/10",
  cool: "ring-cyan-400/10",
  neutral: "ring-white/[0.06]",
  mono: "ring-white/[0.08]",
} as const;

function resolveVariant(chapter: ProfileVisualProps["chapter"]): PortraitVariant {
  if (chapter.imageVariant) return chapter.imageVariant;
  return chapter.id === "about" ? "featured" : "ambient";
}

function resolveObjectPosition(chapter: ProfileVisualProps["chapter"]) {
  if (chapter.imageKey) return IMAGE_FRAMING[chapter.imageKey];
  return chapter.imageObjectPosition ?? IMAGE_FRAMING.professional;
}

export const ProfileVisual = memo(function ProfileVisual({
  chapter,
  className,
  size = "lg",
}: ProfileVisualProps) {
  const [imgError, setImgError] = useState(false);
  const onError = useCallback(() => setImgError(true), []);
  const imageSrc = chapter.image ?? SITE.profileImage;
  const hasPhoto = Boolean(imageSrc) && !imgError;
  const variant = resolveVariant(chapter);
  const frameWidth = FRAME_WIDTH[size];
  const useCardLayout = size === "fill" || variant === "ambient";
  const tone = chapter.imageTone ?? "neutral";
  const objectPosition = resolveObjectPosition(chapter);
  const isEditorial = chapter.imageTreatment === "editorial";

  const imageSizes = useMemo(() => {
    if (size === "fill" || size === "lg") return "(max-width: 1024px) 100vw, 50vw";
    if (size === "md") return "200px";
    return "240px";
  }, [size]);

  const labels = (
    <PortraitOverlayLabels
      index={chapter.index}
      label={chapter.label}
      caption={chapter.caption}
    />
  );

  if (useCardLayout) {
    return (
      <div className={cn("group", frameWidth, className)}>
        <div
          className={cn(
            "relative flex h-full min-h-[280px] w-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-[#0a0a0a]",
            TONE_RING[tone],
            "ring-1",
            size !== "fill" && "aspect-[4/5]"
          )}
        >
          {hasPhoto ? (
            <>
              <Image
                src={imageSrc}
                alt={SITE.name}
                fill
                className={cn(
                  "transition-transform duration-700 ease-out group-hover:scale-[1.03]",
                  objectPosition,
                  isEditorial && "saturate-[0.88] contrast-[1.05]"
                )}
                sizes={imageSizes}
                priority={chapter.id === "about"}
                onError={onError}
              />
              <div
                className={cn(
                  "absolute inset-0 bg-gradient-to-t",
                  TONE_OVERLAY[tone]
                )}
                aria-hidden
              />
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.35] mix-blend-overlay"
                style={{
                  background:
                    "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(255,255,255,0.18), transparent 70%)",
                }}
                aria-hidden
              />
            </>
          ) : (
            <div className={cn("absolute inset-0 bg-gradient-to-br opacity-80", chapter.imageGradient)} />
          )}
          <div className="absolute inset-x-0 bottom-0 z-10 p-4 md:p-5">{labels}</div>
        </div>
      </div>
    );
  }

  if (!hasPhoto) {
    return (
      <div className={cn("flex flex-col", frameWidth, className)}>
        <div
          className={cn(
            "relative flex aspect-[4/5] flex-col overflow-hidden rounded-2xl border border-border/80",
            "bg-surface/40"
          )}
        >
          <div className={cn("absolute inset-0 bg-gradient-to-br opacity-80", chapter.imageGradient)} />
          <div className="absolute inset-x-0 bottom-0 z-10 p-4">{labels}</div>
        </div>
      </div>
    );
  }

  return (
    <figure className={cn("group flex flex-col gap-3", frameWidth, className)}>
      <div
        className={cn(
          "relative aspect-[4/5] overflow-hidden rounded-2xl bg-[#0c0c0c]",
          TONE_RING[tone],
          "ring-1 transition-transform duration-500 group-hover:scale-[1.012]"
        )}
      >
        <Image
          src={imageSrc}
          alt={SITE.name}
          fill
          className={cn(objectPosition, isEditorial && "saturate-[0.92] contrast-[1.06]")}
          sizes={imageSizes}
          priority={chapter.id === "about"}
          onError={onError}
        />
        <div className={cn("absolute inset-0 bg-gradient-to-t", TONE_OVERLAY[tone])} aria-hidden />
      </div>

      <PortraitMetaStack caption={chapter.caption} name={SITE.name} title={SITE.title} />
    </figure>
  );
});

export const PROFILE_GALLERY = [
  { src: PORTFOLIO_IMAGES.professional, label: "The craft", position: IMAGE_FRAMING.professional },
  { src: PORTFOLIO_IMAGES.executive, label: "Leadership", position: IMAGE_FRAMING.executive },
  { src: PORTFOLIO_IMAGES.outdoor, label: "Beyond the screen", position: IMAGE_FRAMING.outdoor },
] as const;
