"use client";

import { useEffect, useState } from "react";

export function useIdleMount(enabled = true, timeout = 2000) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(() => setReady(true), { timeout });
      return () => window.cancelIdleCallback(id);
    }

    const id = window.setTimeout(() => setReady(true), 400);
    return () => window.clearTimeout(id);
  }, [enabled, timeout]);

  return ready;
}
