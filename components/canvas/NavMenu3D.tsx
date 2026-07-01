"use client";

import { memo } from "react";
import { NAV_LINKS } from "@/constants/site";
import { ScrollLink } from "@/components/ui/ScrollLink";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

function NavMenuLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return (
      <ScrollLink
        href={href}
        className={cn(
          "shrink-0 px-3 py-1.5 text-sm transition-colors",
          active ? "text-foreground" : "text-muted hover:text-foreground"
        )}
        aria-current={active ? "page" : undefined}
      >
        {label}
      </ScrollLink>
    );
  }

  return (
    <ScrollLink
      href={href}
      className="group relative shrink-0 px-3 py-1.5"
      aria-current={active ? "page" : undefined}
    >
      <span className="relative inline-block [perspective:600px]">
        <span aria-hidden className="block h-5 text-sm opacity-0">
          {label}
        </span>

        <span className="absolute inset-0 h-5 [transform-style:preserve-3d] transition-transform duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:[transform:rotateX(-90deg)]">
          <span
            className={cn(
              "absolute inset-0 flex items-center text-sm whitespace-nowrap [backface-visibility:hidden] [transform:translateZ(0.45rem)]",
              active ? "text-foreground" : "text-muted"
            )}
          >
            {label}
          </span>
          <span className="absolute inset-0 flex items-center text-sm whitespace-nowrap text-foreground [backface-visibility:hidden] [transform:rotateX(90deg)_translateZ(0.45rem)]">
            {label}
          </span>
        </span>

        <span
          aria-hidden
          className={cn(
            "absolute bottom-0 left-0 h-px w-full origin-left bg-foreground transition-transform duration-300 ease-out",
            active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
          )}
        />
      </span>
    </ScrollLink>
  );
}

export const NavMenu3D = memo(function NavMenu3D({ activeId }: { activeId: string }) {
  return (
    <div className="flex items-center gap-1">
      {NAV_LINKS.map((link) => (
        <NavMenuLink
          key={link.href}
          href={link.href}
          label={link.label}
          active={activeId === link.href.slice(1)}
        />
      ))}
    </div>
  );
});
