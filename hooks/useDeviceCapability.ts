"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "./useReducedMotion";
import { useMediaQuery } from "./useMediaQuery";

export function useDeviceCapability() {
  const reducedMotion = useReducedMotion();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [lowEnd, setLowEnd] = useState(false);

  useEffect(() => {
    const cores = navigator.hardwareConcurrency ?? 4;
    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;
    setLowEnd(cores <= 4 || memory <= 4);
  }, []);

  const prefersSimple3D = reducedMotion || isMobile || lowEnd;

  return { reducedMotion, isMobile, lowEnd, prefersSimple3D };
}
