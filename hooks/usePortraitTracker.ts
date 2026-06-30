"use client";

import { useMotionValue } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { SCROLL_CHAPTERS, type ScrollChapter } from "@/constants/scrollStory";
import { useLenis } from "@/hooks/useLenis";

const CLAMP_PAD = 120;
const PORTRAIT_TOP_OFFSET = 40;
const ARC_BOW = 0.1;
const ZONE_ENTER_START = 0.92;
const ZONE_ENTER_END = 0.58;
const ZONE_EXIT_START = 0.55;
const ZONE_EXIT_END = 0.1;
const STATIC_FADE_START = 300;
const STATIC_FADE_END = 130;
const FOCAL_RATIO = 0.44;

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function clampY(value: number, vh: number) {
  return clamp(value, CLAMP_PAD, vh - CLAMP_PAD);
}

function getScrollY(lenis: ReturnType<typeof useLenis>["lenis"]) {
  return lenis?.scroll ?? window.scrollY;
}

function quad(t: number, a: number, b: number, c: number) {
  const u = 1 - t;
  return u * u * a + 2 * u * t * b + t * t * c;
}

type Point = { x: number; y: number; side: ScrollChapter["side"] };

function getAnchorSlotPoint(
  chapter: ScrollChapter,
  anchorEl: HTMLElement,
  vh: number,
  isMobile: boolean
): Point {
  const rect = anchorEl.getBoundingClientRect();

  if (isMobile) {
    return {
      x: rect.left + rect.width * 0.5,
      y: clampY(rect.top + rect.height * 0.5, vh),
      side: chapter.side,
    };
  }

  return {
    x: chapter.side === "left" ? rect.left : rect.right,
    y: clampY(rect.top + rect.height * 0.42 + PORTRAIT_TOP_OFFSET, vh),
    side: chapter.side,
  };
}

function getCurveControl(from: Point, to: Point, vw: number, vh: number, isMobile: boolean) {
  const midY = (from.y + to.y) * 0.5;
  const span = Math.hypot(to.x - from.x, to.y - from.y);
  const bow = Math.max(64, span * ARC_BOW, vh * 0.06);

  if (isMobile) {
    return { x: (from.x + to.x) * 0.5, y: midY - bow * 0.15 };
  }

  const crossesSides = from.side !== to.side;

  if (crossesSides) {
    return { x: vw * 0.5, y: midY - bow };
  }

  const midX = (from.x + to.x) * 0.5;
  return {
    x: midX + (from.side === "left" ? bow * 0.5 : -bow * 0.5),
    y: midY - bow * 0.3,
  };
}

function getZoneOpacity(zoneTop: number, zoneBottom: number, vh: number) {
  if (zoneTop > vh * ZONE_ENTER_START) return 0;

  if (zoneTop > vh * ZONE_ENTER_END) {
    return 1 - (zoneTop - vh * ZONE_ENTER_END) / (vh * (ZONE_ENTER_START - ZONE_ENTER_END));
  }

  if (zoneBottom < vh * ZONE_EXIT_START) {
    return clamp(
      (zoneBottom - vh * ZONE_EXIT_END) / (vh * (ZONE_EXIT_START - ZONE_EXIT_END)),
      0,
      1
    );
  }

  return 1;
}

function getLastSectionOpacity(map: Map<string, HTMLElement>, vh: number) {
  const lastId = SCROLL_CHAPTERS[SCROLL_CHAPTERS.length - 1].id;
  const section = map.get(lastId)?.closest("section");
  if (!section) return 1;

  const { bottom } = section.getBoundingClientRect();
  const fadeStart = vh * 0.78;
  const fadeEnd = vh * 0.22;

  if (bottom >= fadeStart) return 1;
  if (bottom <= fadeEnd) return 0;

  return clamp((bottom - fadeEnd) / (fadeStart - fadeEnd), 0, 1);
}

function getStaticCardOpacity(px: number, py: number, vh: number) {
  const slots = document.querySelectorAll<HTMLElement>("[data-portrait-static]");
  let opacity = 1;

  slots.forEach((slot) => {
    const rect = slot.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > vh) return;

    const cx = rect.left + rect.width * 0.5;
    const cy = rect.top + rect.height * 0.5;
    const dist = Math.hypot(px - cx, py - cy);

    if (dist >= STATIC_FADE_START) return;

    const slotOpacity =
      dist <= STATIC_FADE_END ? 0 : (dist - STATIC_FADE_END) / (STATIC_FADE_START - STATIC_FADE_END);
    opacity = Math.min(opacity, slotOpacity);
  });

  return opacity;
}

function getScrollSegment(
  map: Map<string, HTMLElement>,
  scrollY: number,
  vh: number
) {
  const mids = SCROLL_CHAPTERS.map((chapter) => {
    const el = map.get(chapter.id);
    const section = el?.closest("section");
    const rect = section?.getBoundingClientRect();
    if (!rect) return scrollY;
    return scrollY + rect.top + rect.height * 0.5;
  });

  const focal = scrollY + vh * FOCAL_RATIO;
  let index = 0;
  let frac = 0;

  if (focal <= mids[0]) {
    index = 0;
    frac = 0;
  } else if (focal >= mids[mids.length - 1]) {
    index = Math.max(0, mids.length - 2);
    frac = 1;
  } else {
    for (let i = 0; i < mids.length - 1; i++) {
      const start = mids[i];
      const end = mids[i + 1];
      if (focal >= start && focal < end) {
        index = i;
        frac = (focal - start) / Math.max(1, end - start);
        break;
      }
    }
  }

  return { index, frac: clamp(frac, 0, 1) };
}

export function usePortraitTracker(
  anchorsRef: React.RefObject<Map<string, HTMLElement>>
) {
  const { lenis } = useLenis();
  const width = useMotionValue(typeof window !== "undefined" ? 400 : 0);
  const height = useMotionValue(typeof window !== "undefined" ? 500 : 0);
  const x = useMotionValue(typeof window !== "undefined" ? 120 : 0);
  const y = useMotionValue(
    typeof window !== "undefined" ? window.innerHeight * FOCAL_RATIO : 400
  );
  const blend = useMotionValue(0);
  const rotate = useMotionValue(0);
  const visibility = useMotionValue(0);
  const anchorX = useMotionValue(0);
  const [segment, setSegment] = useState({
    fromIndex: 0,
    toIndex: 0,
    activeId: SCROLL_CHAPTERS[0].id,
  });
  const segmentRef = useRef({ from: 0, to: 0, activeId: SCROLL_CHAPTERS[0].id });

  useEffect(() => {
    const update = () => {
      const map = anchorsRef.current;
      if (!map || map.size === 0) return;

      const zone = document.getElementById("scroll-story");
      if (!zone) return;

      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const isMobile = vw < 1024;
      if (isMobile) return;

      const scrollY = getScrollY(lenis);
      const zoneRect = zone.getBoundingClientRect();
      const zoneOpacity = getZoneOpacity(zoneRect.top, zoneRect.bottom, vh);
      const lastSectionOpacity = getLastSectionOpacity(map, vh);

      if (lastSectionOpacity <= 0) {
        visibility.set(0);
        return;
      }

      const { index, frac } = getScrollSegment(map, scrollY, vh);
      const toIndexSeg = Math.min(index + 1, SCROLL_CHAPTERS.length - 1);

      const fromChapter = SCROLL_CHAPTERS[index];
      const toChapter = SCROLL_CHAPTERS[toIndexSeg];
      const fromEl = map.get(fromChapter.id);
      const toEl = map.get(toChapter.id);
      if (!fromEl) return;

      const from = getAnchorSlotPoint(fromChapter, fromEl, vh, isMobile);
      const to = toEl ? getAnchorSlotPoint(toChapter, toEl, vh, isMobile) : from;
      const control = getCurveControl(from, to, vw, vh, isMobile);

      const targetX = index === toIndexSeg ? from.x : quad(frac, from.x, control.x, to.x);
      const targetY = index === toIndexSeg ? from.y : quad(frac, from.y, control.y, to.y);

      const fromTx = from.side === "left" ? 0 : 1;
      const toTx = to.side === "left" ? 0 : 1;
      const activeSide = frac < 0.5 ? from.side : to.side;

      const fromRect = fromEl.getBoundingClientRect();
      const toRect = toEl?.getBoundingClientRect() ?? fromRect;
      const targetW = fromRect.width + (toRect.width - fromRect.width) * frac;
      const targetH = fromRect.height + (toRect.height - fromRect.height) * frac;

      const fromRotate = fromChapter.rotate ?? 0;
      const toRotate = toChapter.rotate ?? 0;
      const targetRotate = isMobile
        ? (fromRotate + (toRotate - fromRotate) * frac) * 0.35
        : fromRotate + (toRotate - fromRotate) * frac;

      const cardHalfW = targetW / 2;
      const cardCenterX = isMobile ? targetX : activeSide === "left" ? targetX + cardHalfW : targetX - cardHalfW;
      const staticOpacity = getStaticCardOpacity(cardCenterX, targetY, vh);

      x.set(targetX);
      y.set(targetY);
      width.set(targetW);
      height.set(targetH);
      anchorX.set(isMobile ? 0.5 : fromTx + (toTx - fromTx) * frac);
      blend.set(frac);
      rotate.set(targetRotate);
      visibility.set(zoneOpacity * staticOpacity * lastSectionOpacity);

      let nextFrom = segmentRef.current.from;
      let nextTo = segmentRef.current.to;
      let nextActiveId = segmentRef.current.activeId;

      if (segmentRef.current.from !== index) nextFrom = index;
      if (segmentRef.current.to !== toIndexSeg) nextTo = toIndexSeg;

      const nextId = frac < 0.5 ? fromChapter.id : toChapter.id;
      if (segmentRef.current.activeId !== nextId) nextActiveId = nextId;

      if (
        nextFrom !== segmentRef.current.from ||
        nextTo !== segmentRef.current.to ||
        nextActiveId !== segmentRef.current.activeId
      ) {
        segmentRef.current = { from: nextFrom, to: nextTo, activeId: nextActiveId };
        setSegment({
          fromIndex: nextFrom,
          toIndex: nextTo,
          activeId: nextActiveId,
        });
      }
    };

    update();

    const onScroll = () => update();
    lenis?.on("scroll", onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update, { passive: true });

    return () => {
      lenis?.off("scroll", onScroll);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
    };
  }, [lenis, anchorsRef, x, y, width, height, blend, rotate, visibility, anchorX]);

  const { fromIndex, toIndex, activeId } = segment;
  const activeIndex = useMemo(
    () => SCROLL_CHAPTERS.findIndex((c) => c.id === activeId),
    [activeId]
  );

  return { x, y, width, height, blend, rotate, visibility, anchorX, fromIndex, toIndex, activeId, activeIndex };
}
