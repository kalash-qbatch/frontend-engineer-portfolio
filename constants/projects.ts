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
    id: "ferrari-458",
    title: "Ferrari 458 Interactive",
    description: "Scroll-driven 3D car experience with engine audio, configurator, and immersive chapters.",
    longDescription:
      "A full-browser Ferrari 458 Italia concept — drag-to-rotate 3D model, ignition sequence with spatial audio, performance dashboard, drive modes, color configurator, and interior customization. Built with React Three Fiber, Zustand, and Framer Motion.",
    role: "Creative Frontend Developer",
    image: "/projects/ferrari-458.jpg",
    tags: ["Three.js", "R3F", "Framer Motion", "Zustand", "React", "TypeScript"],
    live: "https://animated-car-website-delta.vercel.app/",
    featured: true,
    year: "2024",
    gradient: "from-red-600/25 via-red-950/20 to-black",
  },
  {
    id: "ball-puzzle",
    title: "BALLPUZZLE",
    description: "3D physics arcade — roll through 1,000 procedural stages, collect coins, and unlock 174 ball skins.",
    longDescription:
      "A browser-based 3D rolling-ball game with six difficulty modes, procedural stage layouts, stacked jump mechanics, coin XP progression, per-mode saves, and a 174-skin cosmetic unlock system — built for the full arcade loop from home menu to stage select.",
    role: "Creative Frontend Developer",
    image: "/projects/ball-puzzle-hero.png",
    tags: ["Three.js", "R3F", "React", "TypeScript", "WebGL"],
    live: "https://ball-puzzle.vercel.app/",
    featured: true,
    year: "2025",
    gradient: "from-violet-600/25 via-cyan-600/20 to-black",
  },
  {
    id: "pack-and-ship",
    title: "Pack & Ship",
    description: "Animated e-commerce — shop in 2D, pack and deliver in 3D with live tracking animations.",
    longDescription:
      "A Three.js-powered storefront cycling fruit, electronics, and furniture categories — 3D hero previews, cart checkout with box-sealing pack animation, and a live truck journey on order tracking. Built as a demo-ready experience with no signup.",
    role: "Creative Frontend Developer",
    image: "/projects/pack-and-ship-hero.png",
    tags: ["Three.js", "R3F", "React", "TypeScript", "Framer Motion"],
    live: "https://pack-and-ship.vercel.app/",
    featured: true,
    year: "2025",
    gradient: "from-amber-600/25 via-teal-600/20 to-black",
  },
];
