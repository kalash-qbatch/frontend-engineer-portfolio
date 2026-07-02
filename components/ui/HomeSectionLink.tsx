"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { stashReturnSection } from "@/lib/scroll-target";

type HomeSectionLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  section: string;
};

/** In-app link to a homepage section — preserves hash and avoids Next.js scroll-to-top. */
export function HomeSectionLink({ section, onClick, ...props }: HomeSectionLinkProps) {
  const hash = section.startsWith("#") ? section : `#${section}`;

  return (
    <Link
      href={`/${hash}`}
      scroll={false}
      onClick={(event) => {
        stashReturnSection(section);
        onClick?.(event);
      }}
      {...props}
    />
  );
}
