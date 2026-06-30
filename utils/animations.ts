/** @deprecated Import from @/lib/motion instead */
export {
  EASE,
  DURATION,
  STAGGER,
  transition as defaultTransition,
  fadeInUp,
  fadeIn,
  staggerContainer,
  staggerFast,
  charReveal,
  reducedMotionFade,
} from "@/lib/motion";

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
};

export const slideInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0 },
};

export const slideInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0 },
};

export const springTransition = {
  type: "spring" as const,
  stiffness: 100,
  damping: 15,
};
