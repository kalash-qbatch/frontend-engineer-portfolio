import { SCROLL_CHAPTERS } from "@/constants/scrollStory";

export type ScrollTarget = string | HTMLElement | number;

export const SCROLL_NAV_OFFSET = -96;
export const SCROLL_PADDING_TOP = "6rem";
export const SCROLL_RETRY_MS = 50;
export const SCROLL_MAX_ATTEMPTS = 50;

export const PAGE_SECTION_IDS = [
  "hero",
  "about",
  "skills",
  "experience",
  "services",
  "projects",
  "testimonials",
  "contact",
] as const;

export const SCROLL_STORY_SECTION_IDS = [
  "about",
  "skills",
  "experience",
  "services",
] as const;

/** Matches portrait tracker focal line — keeps card + content in the same chapter row */
export const STORY_CHAPTER_FOCAL_RATIO = 0.44;

export const SECTION_NAV_EVENT = "portfolio:section-navigate";

export function isScrollStorySectionId(id: string) {
  return (SCROLL_STORY_SECTION_IDS as readonly string[]).includes(id);
}

export function hasHomeSectionHash() {
  return typeof window !== "undefined" && /^#[a-z][\w-]*$/i.test(window.location.hash);
}

const RETURN_SECTION_KEY = "portfolio:return-section";

export function stashReturnSection(section: string) {
  const id = section.replace(/^#/, "");
  if (!(PAGE_SECTION_IDS as readonly string[]).includes(id)) return;
  try {
    sessionStorage.setItem(RETURN_SECTION_KEY, id);
  } catch {
    // Ignore storage errors
  }
}

export function consumeReturnSection(): string | null {
  try {
    const id = sessionStorage.getItem(RETURN_SECTION_KEY);
    if (id) sessionStorage.removeItem(RETURN_SECTION_KEY);
    return id && (PAGE_SECTION_IDS as readonly string[]).includes(id) ? id : null;
  } catch {
    return null;
  }
}

export function resolveHomeSectionTarget(): string | null {
  if (typeof window === "undefined") return null;

  const hash = window.location.hash.slice(1);
  if (hash && (PAGE_SECTION_IDS as readonly string[]).includes(hash)) {
    try {
      sessionStorage.removeItem(RETURN_SECTION_KEY);
    } catch {
      // Ignore storage errors
    }
    return hash;
  }

  return consumeReturnSection();
}

export function scrollToSectionInstant(sectionId: string) {
  if (typeof window === "undefined") return false;

  const resolved = resolveScrollPosition(`#${sectionId}`, 0);
  if (resolved === null) return false;

  window.scrollTo(0, resolved);
  return true;
}

export function emitSectionNavigate(sectionId: string) {
  window.dispatchEvent(
    new CustomEvent(SECTION_NAV_EVENT, { detail: { sectionId } })
  );
}

export function getScrollY(lenisScroll?: number | null) {
  return lenisScroll ?? window.scrollY;
}

export function getElementDocumentTop(el: HTMLElement, scrollY = getScrollY()) {
  return el.getBoundingClientRect().top + scrollY;
}

/** Heading row sits this far below the top — matches About section preview */
export const STORY_HEADING_VIEWPORT_Y = Math.abs(SCROLL_NAV_OFFSET) + 40;

export function getChapterSection(chapterId: string) {
  const el = document.getElementById(chapterId);
  if (!el) return null;
  const section = el.closest("section");
  return section instanceof HTMLElement ? section : el;
}

export function getChapterMids(scrollY = getScrollY()) {
  return SCROLL_CHAPTERS.map((chapter) => {
    const section = getChapterSection(chapter.id);
    if (!section) return scrollY;
    const rect = section.getBoundingClientRect();
    return scrollY + rect.top + rect.height * 0.5;
  });
}

export function getChapterSectionMid(chapterId: string, scrollY = getScrollY()) {
  const mids = getChapterMids(scrollY);
  const index = SCROLL_CHAPTERS.findIndex((chapter) => chapter.id === chapterId);
  return index >= 0 ? mids[index] : null;
}

/** Scroll position that matches About-style heading alignment + portrait chapter lock */
export function getStoryChapterScrollY(chapterId: string, scrollY = getScrollY()) {
  const heading = document.getElementById(chapterId);
  if (!heading) return null;

  const vh = window.innerHeight;
  const headingTop = getElementDocumentTop(heading, scrollY);
  const headingScroll = Math.max(0, headingTop - STORY_HEADING_VIEWPORT_Y);

  const chapterIndex = SCROLL_CHAPTERS.findIndex((chapter) => chapter.id === chapterId);
  if (chapterIndex < 0) return headingScroll;

  const mids = getChapterMids(scrollY);
  const nextMid = mids[chapterIndex + 1];
  const span = nextMid !== undefined ? nextMid - mids[chapterIndex] : vh * 0.85;
  const nudge = chapterIndex === 0 ? 0 : Math.min(span * 0.2, 96);
  const portraitScroll = Math.max(0, mids[chapterIndex] + nudge - vh * STORY_CHAPTER_FOCAL_RATIO);

  return Math.max(headingScroll, portraitScroll);
}

export function getStandardSectionScrollY(el: HTMLElement, scrollY = getScrollY()) {
  return Math.max(0, getElementDocumentTop(el, scrollY) + SCROLL_NAV_OFFSET);
}

export function resolveScrollPosition(target: ScrollTarget, scrollY = getScrollY()): number | null {
  if (typeof target === "number") return Math.max(0, target);

  let id: string | null = null;
  let el: HTMLElement | null = null;

  if (target instanceof HTMLElement) {
    el = target;
    id = target.id || null;
  } else {
    const normalized = target.startsWith("#") ? target.slice(1) : target;
    id = normalized;
    el = document.getElementById(normalized);
  }

  if (!el) return null;
  if (id === "hero") return 0;

  const isMobile = typeof window !== "undefined" && window.innerWidth < 1024;

  if (id && isScrollStorySectionId(id)) {
    if (isMobile) {
      return getStandardSectionScrollY(el, scrollY);
    }
    return getStoryChapterScrollY(id, scrollY);
  }

  return getStandardSectionScrollY(el, scrollY);
}

/** @deprecated Use resolveScrollPosition — kept for element-based fallbacks */
export function resolveScrollElement(target: ScrollTarget): HTMLElement | number | null {
  const position = resolveScrollPosition(target);
  return position === null ? null : position;
}

export function resolveActiveSection(
  sectionIds: readonly string[],
  scrollY: number,
  navOffset = Math.abs(SCROLL_NAV_OFFSET)
) {
  const vh = typeof window !== "undefined" ? window.innerHeight : 800;
  const focal = scrollY + navOffset + vh * 0.12;

  let active = sectionIds[0];

  for (const id of sectionIds) {
    const el = document.getElementById(id);
    if (!el) continue;

    const top = getElementDocumentTop(el, scrollY);
    const bottom = top + el.offsetHeight;

    if (focal >= top && focal < bottom) {
      return id;
    }

    if (focal >= top) {
      active = id;
    }
  }

  // Scroll-story chapters: match portrait segment when between section bounds
  for (const chapter of SCROLL_CHAPTERS) {
    const mid = getChapterSectionMid(chapter.id, scrollY);
    if (mid === null) continue;
    const storyFocal = scrollY + vh * STORY_CHAPTER_FOCAL_RATIO;
    if (Math.abs(storyFocal - mid) < vh * 0.22) {
      return chapter.id;
    }
  }

  return active;
}

export function nativeScrollTo(target: number) {
  window.scrollTo({ top: Math.max(0, target), behavior: "smooth" });
}
