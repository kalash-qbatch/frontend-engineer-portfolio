export type ScrollTarget = string | HTMLElement | number;

export const SCROLL_NAV_OFFSET = -88;
export const SCROLL_RETRY_MS = 50;
export const SCROLL_MAX_ATTEMPTS = 50;

export function resolveScrollElement(target: ScrollTarget): HTMLElement | number | null {
  if (typeof target === "number") return target;
  if (target instanceof HTMLElement) return target;

  const selector = target.startsWith("#") ? target : `#${target}`;
  const id = selector.slice(1);

  return document.getElementById(id) ?? (document.querySelector(selector) as HTMLElement | null);
}

export function nativeScrollTo(target: HTMLElement | number, offset = SCROLL_NAV_OFFSET) {
  const top =
    typeof target === "number"
      ? target
      : target.getBoundingClientRect().top + window.scrollY + offset;

  window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
}
