"use client";

import { memo } from "react";
import { cn } from "@/lib/utils";

interface PortraitOverlayLabelsProps {
  index: string;
  label: string;
  caption: string;
  className?: string;
}

export const PortraitOverlayLabels = memo(function PortraitOverlayLabels({
  index,
  label,
  caption,
  className,
}: PortraitOverlayLabelsProps) {
  return (
    <div className={cn("portrait-label-panel", className)}>
      <span className="portrait-label-panel__accent" aria-hidden />
      <div className="portrait-label-panel__content">
        <span className="portrait-index-badge portrait-index-badge--inline">{index}</span>
        <p className="portrait-label-heading">{label}</p>
        <p className="portrait-label-caption">{caption}</p>
      </div>
    </div>
  );
});

interface PortraitMetaStackProps {
  caption: string;
  name: string;
  title: string;
  className?: string;
}

export const PortraitMetaStack = memo(function PortraitMetaStack({
  caption,
  name,
  title,
  className,
}: PortraitMetaStackProps) {
  return (
    <figcaption className={cn("portrait-meta-stack", className)}>
      <div className="portrait-meta-stack__accent" aria-hidden />
      <p className="portrait-meta-caption">{caption}</p>
      <p className="portrait-meta-name">{name}</p>
      <p className="portrait-meta-title">{title}</p>
    </figcaption>
  );
});
