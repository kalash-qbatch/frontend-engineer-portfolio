"use client";

import Link from "next/link";
import { useLenis } from "@/hooks/useLenis";
import { emitSectionNavigate } from "@/lib/scroll-target";
import { cn } from "@/lib/utils";
import type { AnchorHTMLAttributes, ReactNode } from "react";

interface ScrollLinkProps extends Pick<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "onMouseEnter" | "onMouseLeave" | "onFocus" | "onBlur" | "aria-label"
> {
  href: string;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
}

export function ScrollLink({
  href,
  className,
  children,
  onClick,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  ...rest
}: ScrollLinkProps) {
  const { scrollTo } = useLenis();

  if (!href.startsWith("#")) {
    return (
      <Link
        href={href}
        className={className}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onFocus={onFocus}
        onBlur={onBlur}
        {...rest}
      >
        {children}
      </Link>
    );
  }

  return (
    <a
      href={href}
      className={cn(className)}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onFocus={onFocus}
      onBlur={onBlur}
      onClick={(e) => {
        e.preventDefault();
        if (window.location.hash !== href) {
          window.history.pushState(null, "", href);
        }
        emitSectionNavigate(href.slice(1));
        scrollTo(href);
        onClick?.();
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
