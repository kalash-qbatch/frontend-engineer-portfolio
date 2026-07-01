import { TbCode, TbDeviceDesktop, TbSparkles, TbPalette, TbRocket } from "react-icons/tb";
import { IconType } from "react-icons";

export interface Service {
  id: string;
  title: string;
  description: string;
  tag: string;
  highlights: string[];
  icon: IconType;
  color: string;
}

export const SERVICES: Service[] = [
  {
    id: "frontend",
    title: "Frontend Development",
    tag: "React · Next.js · Vue",
    description:
      "Production-grade applications with clean architecture, type safety, and scalable component systems.",
    highlights: ["App Router & SSR", "Design systems", "Clean architecture"],
    icon: TbCode,
    color: "#8B5CF6",
  },
  {
    id: "landing",
    title: "Landing Pages",
    tag: "Conversion-first",
    description:
      "High-converting, visually stunning pages that load fast and tell your brand story with precision.",
    highlights: ["A/B-ready layouts", "SEO & metadata", "Sub-second LCP"],
    icon: TbDeviceDesktop,
    color: "#3B82F6",
  },
  {
    id: "animations",
    title: "Animations & Motion",
    tag: "Framer · GSAP · Three.js",
    description:
      "Purposeful motion design that enhances UX without sacrificing performance or accessibility.",
    highlights: ["Scroll narratives", "3D & WebGL", "Reduced-motion safe"],
    icon: TbSparkles,
    color: "#EC4899",
  },
  {
    id: "ui",
    title: "UI Engineering",
    tag: "Pixel-perfect",
    description:
      "Design implementation with micro-interactions, responsive behavior, and cohesive design systems.",
    highlights: ["Figma → code", "Micro-interactions", "Responsive polish"],
    icon: TbPalette,
    color: "#F59E0B",
  },
  {
    id: "performance",
    title: "Performance Optimization",
    tag: "Core Web Vitals",
    description:
      "Bundle analysis, lazy loading, and GPU-friendly animation techniques for blazing-fast experiences.",
    highlights: ["Bundle splitting", "Image optimization", "Lighthouse 90+"],
    icon: TbRocket,
    color: "#22D3EE",
  },
];
