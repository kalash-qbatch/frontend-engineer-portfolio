"use client";

import { createContext, useCallback, useContext, useMemo, useRef } from "react";
import { SCROLL_CHAPTERS } from "@/constants/scrollStory";

interface ScrollStoryContextValue {
  anchorsRef: React.RefObject<Map<string, HTMLElement>>;
  registerAnchor: (id: string, el: HTMLElement | null) => void;
}

const ScrollStoryContext = createContext<ScrollStoryContextValue | null>(null);

export function ScrollStoryProvider({ children }: { children: React.ReactNode }) {
  const anchorsRef = useRef<Map<string, HTMLElement>>(new Map());

  const registerAnchor = useCallback((id: string, el: HTMLElement | null) => {
    if (el) anchorsRef.current.set(id, el);
    else anchorsRef.current.delete(id);
  }, []);

  const value = useMemo(
    () => ({ anchorsRef, registerAnchor }),
    [registerAnchor]
  );

  return (
    <ScrollStoryContext.Provider value={value}>{children}</ScrollStoryContext.Provider>
  );
}

export function useScrollStory() {
  const ctx = useContext(ScrollStoryContext);
  if (!ctx) throw new Error("useScrollStory must be used within ScrollStoryProvider");
  return ctx;
}

export { SCROLL_CHAPTERS };
