import { TbCode, TbDeviceDesktop, TbSparkles, TbPalette, TbRocket } from "react-icons/tb";
import { IconType } from "react-icons";

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: IconType;
}

export const SERVICES: Service[] = [
  {
    id: "frontend",
    title: "Frontend Development",
    description:
      "Production-grade React & Next.js applications with clean architecture, type safety, and scalable component systems.",
    icon: TbCode,
  },
  {
    id: "landing",
    title: "Landing Pages",
    description:
      "High-converting, visually stunning landing pages that load fast and tell your brand story with precision.",
    icon: TbDeviceDesktop,
  },
  {
    id: "animations",
    title: "Animations & Motion",
    description:
      "Purposeful motion design using Framer Motion, GSAP, and Three.js — enhancing UX without sacrificing performance.",
    icon: TbSparkles,
  },
  {
    id: "ui",
    title: "UI Engineering",
    description:
      "Pixel-perfect implementation of designs with attention to micro-interactions, responsive behavior, and design systems.",
    icon: TbPalette,
  },
  {
    id: "performance",
    title: "Performance Optimization",
    description:
      "Core Web Vitals optimization, bundle analysis, lazy loading strategies, and GPU-friendly animation techniques.",
    icon: TbRocket,
  },
];
