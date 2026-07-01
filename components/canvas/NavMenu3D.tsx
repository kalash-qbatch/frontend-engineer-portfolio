"use client";

import { memo } from "react";
import { NAV_LINKS } from "@/constants/site";
import { ScrollLink } from "@/components/ui/ScrollLink";
import { useReducedMotion } from "@/hooks/useReducedMotion";

function NavMenuLink({ href, label }: { href: string; label: string }) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return (
      <ScrollLink
        href={href}
        className="shrink-0 px-3 py-1.5 text-sm text-muted hover:text-foreground"
      >
        {label}
      </ScrollLink>
    );
  }

  return (
    <ScrollLink href={href} className="group relative shrink-0 px-3 py-1.5">
      <span className="relative inline-block [perspective:600px]">
        <span aria-hidden className="block h-5 text-sm opacity-0">
          {label}
        </span>

        <span className="absolute inset-0 h-5 [transform-style:preserve-3d] transition-transform duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:[transform:rotateX(-90deg)]">
          <span className="absolute inset-0 flex items-center text-sm whitespace-nowrap text-muted [backface-visibility:hidden] [transform:translateZ(0.45rem)]">
            {label}
          </span>
          <span className="absolute inset-0 flex items-center text-sm whitespace-nowrap text-foreground [backface-visibility:hidden] [transform:rotateX(90deg)_translateZ(0.45rem)]">
            {label}
          </span>
        </span>

        <span
          aria-hidden
          className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-foreground transition-transform duration-300 ease-out group-hover:scale-x-100"
        />
      </span>
    </ScrollLink>
  );
}

export const NavMenu3D = memo(function NavMenu3D() {
  return (
    <div className="flex items-center gap-1">
      {NAV_LINKS.map((link) => (
        <NavMenuLink key={link.href} href={link.href} label={link.label} />
      ))}
    </div>
  );
});
