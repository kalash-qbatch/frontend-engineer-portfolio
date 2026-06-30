"use client";

import Image from "next/image";
import { memo } from "react";
import { SITE } from "@/constants/site";
import { IMAGE_FRAMING, PORTFOLIO_IMAGES, type PortfolioImageKey } from "@/constants/images";
import { cn } from "@/lib/utils";

const SIZE_MAP = {
  xs: { box: "h-8 w-8", sizes: "32px" },
  sm: { box: "h-11 w-11", sizes: "44px" },
  md: { box: "h-16 w-16", sizes: "64px" },
} as const;

interface ProfileAvatarProps {
  size?: keyof typeof SIZE_MAP;
  shape?: "circle" | "rounded";
  imageKey?: PortfolioImageKey;
  className?: string;
  priority?: boolean;
}

export const ProfileAvatar = memo(function ProfileAvatar({
  size = "sm",
  shape = "circle",
  imageKey = "professional",
  className,
  priority = false,
}: ProfileAvatarProps) {
  const config = SIZE_MAP[size];
  const framing = IMAGE_FRAMING[imageKey === "heroCutout" ? "avatar" : imageKey] ?? IMAGE_FRAMING.avatar;

  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden border border-border bg-surface",
        shape === "circle" ? "rounded-full" : "rounded-xl",
        config.box,
        className
      )}
    >
      <Image
        src={PORTFOLIO_IMAGES[imageKey]}
        alt={SITE.name}
        fill
        className={cn("object-cover", framing)}
        sizes={config.sizes}
        priority={priority}
      />
    </div>
  );
});

interface IdentityStripProps {
  className?: string;
}

export const IdentityStrip = memo(function IdentityStrip({ className }: IdentityStripProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <ProfileAvatar size="xs" shape="rounded" imageKey="executive" priority />
      <div className="h-9 w-px bg-border" aria-hidden />
      <div className="min-w-0">
        <p className="truncate text-sm font-medium leading-tight">{SITE.name}</p>
        <p className="truncate text-xs text-muted">{SITE.title}</p>
      </div>
    </div>
  );
});
