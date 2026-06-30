"use client";

import Link from "next/link";
import { useLenis } from "@/hooks/useLenis";
import { cn } from "@/lib/utils";

interface ScrollLinkProps {
  href: string;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

export function ScrollLink({ href, className, children, onClick }: ScrollLinkProps) {
  const { scrollTo } = useLenis();

  if (!href.startsWith("#")) {
    return (
      <Link href={href} className={className} onClick={onClick}>
        {children}
      </Link>
    );
  }

  return (
    <a
      href={href}
      className={cn(className)}
      onClick={(e) => {
        e.preventDefault();
        scrollTo(href);
        onClick?.();
      }}
    >
      {children}
    </a>
  );
}
