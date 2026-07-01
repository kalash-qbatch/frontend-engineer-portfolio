"use client";

import { memo, useCallback, useEffect, useRef } from "react";
import { SCROLL_CHAPTERS, type ScrollChapter } from "@/constants/scrollStory";
import { MobileChapterCard } from "@/components/scroll/MobileChapterCard";
import { useScrollStory } from "@/hooks/useScrollStory";
import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/utils";

interface StoryChapterProps {
  chapter: ScrollChapter;
  children: React.ReactNode;
  className?: string;
}

export const StoryChapter = memo(function StoryChapter({
  chapter,
  children,
  className,
}: StoryChapterProps) {
  const { registerAnchor } = useScrollStory();
  const ref = useRef<HTMLElement>(null);
  const desktopAnchorRef = useRef<HTMLDivElement>(null);
  const { ref: inViewRef, inView } = useInView<HTMLElement>({
    threshold: 0.35,
    rootMargin: "-10% 0px",
    once: false,
  });
  const isLastChapter = chapter.id === SCROLL_CHAPTERS[SCROLL_CHAPTERS.length - 1].id;
  const portraitOnLeft = chapter.side === "left";

  useEffect(() => {
    const syncAnchor = () => {
      const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
      registerAnchor(chapter.id, isDesktop ? desktopAnchorRef.current : null);
    };

    syncAnchor();
    window.addEventListener("resize", syncAnchor, { passive: true });

    return () => {
      window.removeEventListener("resize", syncAnchor);
      registerAnchor(chapter.id, null);
    };
  }, [chapter.id, registerAnchor]);

  const setRefs = useCallback(
    (node: HTMLElement | null) => {
      ref.current = node;
      (inViewRef as React.MutableRefObject<HTMLElement | null>).current = node;
    },
    [inViewRef]
  );

  return (
    <section
      ref={setRefs}
      aria-label={chapter.label}
      className={cn(
        "relative scroll-mt-24 min-h-[85vh] py-20 md:min-h-[90vh] md:py-28",
        className
      )}
    >
      <div className="section-line absolute top-0 left-1/2 w-full max-w-7xl -translate-x-1/2 px-5 md:px-8" />

      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <MobileChapterCard chapter={chapter} sectionRef={ref} pin={!isLastChapter} />

        <div className="grid items-start gap-10 lg:grid-cols-2 lg:items-center lg:gap-12 xl:gap-16">
          <div
            className={cn(
              "hidden w-full lg:sticky lg:top-[15vh] lg:block lg:self-center lg:pt-0",
              portraitOnLeft ? "order-1" : "order-2"
            )}
          >
            <div
              ref={desktopAnchorRef}
              data-portrait-anchor=""
              className="mx-auto aspect-[4/5] w-full max-h-[min(68vh,600px)]"
              aria-hidden="true"
            />
          </div>

          <div
            id={chapter.anchor}
            className={cn(
              "min-w-0 scroll-mt-24 transition-opacity duration-500",
              portraitOnLeft ? "order-2" : "order-1",
              inView ? "opacity-100" : "opacity-40"
            )}
          >
            <div className="mb-6 flex items-center gap-3">
              <span className="font-mono text-[11px] tracking-widest text-accent">
                {chapter.index}
              </span>
              <span className="h-px w-8 bg-border" />
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
                {chapter.label}
              </span>
            </div>

            <h2 className="font-display text-[clamp(2rem,4.5vw,3.25rem)] font-bold leading-[1.08] tracking-[-0.03em]">
              {chapter.title}
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted md:text-lg">
              {chapter.description}
            </p>

            <div className="mt-10">{children}</div>
          </div>
        </div>
      </div>
    </section>
  );
});
