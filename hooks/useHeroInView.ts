"use client";

import { useEffect, useState } from "react";

/** True while the hero section occupies the viewport (skills globe should defer WebGL). */
export function useHeroInView() {
  const [heroInView, setHeroInView] = useState(true);

  useEffect(() => {
    const hero = document.getElementById("hero");
    if (!hero) {
      setHeroInView(false);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setHeroInView(entry.isIntersecting),
      { threshold: 0.08, rootMargin: "0px 0px -5% 0px" }
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  return heroInView;
}
