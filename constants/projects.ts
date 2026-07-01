export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  role: string;
  image: string;
  tags: string[];
  github?: string;
  live?: string;
  featured: boolean;
  year: string;
  gradient: string;
}

export const PROJECTS: Project[] = [
  {
    id: "nexus",
    title: "Nexus Dashboard",
    description: "Real-time analytics platform with WebGL data visualizations.",
    longDescription:
      "A premium analytics dashboard featuring real-time data streams, interactive 3D charts, and sub-100ms update latency. Built with Next.js 15 and React Three Fiber.",
    role: "Lead Frontend Engineer",
    image: "/projects/nexus.jpg",
    tags: ["Next.js", "Three.js", "TypeScript", "WebSockets"],
    github: "https://github.com",
    live: "https://example.com",
    featured: true,
    year: "2025",
    gradient: "from-blue-600/20 via-purple-600/20 to-cyan-500/20",
  },
  {
    id: "aurora",
    title: "Aurora Commerce",
    description: "Luxury e-commerce with immersive product experiences.",
    longDescription:
      "High-end shopping experience with 3D product viewers, smooth page transitions, and optimized Core Web Vitals scores across all metrics.",
    role: "Frontend Engineer",
    image: "/projects/aurora.jpg",
    tags: ["Vue.js", "Framer Motion", "Stripe", "Tailwind"],
    github: "https://github.com",
    live: "https://example.com",
    featured: true,
    year: "2025",
    gradient: "from-purple-600/20 via-pink-600/20 to-blue-500/20",
  },
  {
    id: "pulse",
    title: "Pulse Health",
    description: "Healthcare app with accessible, animated interfaces.",
    longDescription:
      "Patient-facing health platform prioritizing WCAG 2.1 AA compliance, reduced motion support, and delightful micro-interactions.",
    role: "UI Engineer",
    image: "/projects/pulse.jpg",
    tags: ["Next.js", "React Hook Form", "Accessibility", "GSAP"],
    github: "https://github.com",
    live: "https://example.com",
    featured: true,
    year: "2024",
    gradient: "from-cyan-600/20 via-teal-600/20 to-emerald-500/20",
  },
  {
    id: "vertex",
    title: "Vertex Studio",
    description: "Creative agency site with scroll-driven 3D narratives.",
    longDescription:
      "Award-worthy agency portfolio featuring scroll-synced camera movements, procedural particle systems, and cinematic transitions.",
    role: "Creative Developer",
    image: "/projects/vertex.jpg",
    tags: ["Three.js", "GSAP", "Lenis", "R3F"],
    github: "https://github.com",
    live: "https://example.com",
    featured: false,
    year: "2024",
    gradient: "from-violet-600/20 via-indigo-600/20 to-blue-500/20",
  },
  {
    id: "flux",
    title: "Flux Design System",
    description: "Component library with motion primitives and theming.",
    longDescription:
      "Open-source design system with 40+ components, animation presets, and full TypeScript support for enterprise teams.",
    role: "Design Systems Lead",
    image: "/projects/flux.jpg",
    tags: ["Gatsby", "TypeScript", "Storybook", "Tailwind"],
    github: "https://github.com",
    featured: false,
    year: "2024",
    gradient: "from-orange-600/20 via-amber-600/20 to-yellow-500/20",
  },
  {
    id: "orbit",
    title: "Orbit Social",
    description: "Social platform with real-time feeds and rich media.",
    longDescription:
      "Modern social experience with infinite scroll, optimistic updates, and GPU-accelerated animations maintaining 60fps.",
    role: "Senior Frontend Engineer",
    image: "/projects/orbit.jpg",
    tags: ["Next.js", "Node.js", "Redis", "Framer Motion"],
    github: "https://github.com",
    live: "https://example.com",
    featured: false,
    year: "2023",
    gradient: "from-rose-600/20 via-red-600/20 to-orange-500/20",
  },
];
