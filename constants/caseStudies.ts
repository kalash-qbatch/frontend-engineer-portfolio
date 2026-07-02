export interface CaseStudyFeature {
  title: string;
  description: string;
}

export interface CaseStudySection {
  id: string;
  label: string;
  title: string;
  body: string[];
  bullets?: string[];
}

export interface CaseStudyStat {
  value: string;
  label: string;
}

export interface CaseStudy {
  slug: string;
  eyebrow: string;
  headline: string[];
  subheadline: string;
  heroImage?: string;
  heroImageAlt?: string;
  theme: {
    primary: string;
    secondary: string;
    accent: string;
  };
  stats: CaseStudyStat[];
  features: CaseStudyFeature[];
  sections: CaseStudySection[];
  stack: { name: string; detail: string }[];
}

const FERRARI_458: CaseStudy = {
  slug: "ferrari-458",
  eyebrow: "458 Italia · 2024",
  headline: ["Pure", "Italian", "Passion."],
  subheadline:
    "A scroll-driven Ferrari 458 Italia concept — interactive 3D, spatial engine audio, live configurator, and chapter-based storytelling built for the browser.",
  theme: {
    primary: "#dc2626",
    secondary: "#991b1b",
    accent: "#fbbf24",
  },
  stats: [
    { value: "12+", label: "Interactive chapters" },
    { value: "7", label: "Paint finishes" },
    { value: "3", label: "Drive profiles" },
    { value: "60fps", label: "Target frame rate" },
  ],
  features: [
    {
      title: "Drag-to-rotate 3D model",
      description:
        "A GLB-based Ferrari 458 with OrbitControls-style rotation, wheel X-ray highlights, and responsive lighting tuned for mobile and desktop viewports.",
    },
    {
      title: "Ignition & engine audio",
      description:
        "Start-engine sequence with spatial audio layers, rev slider, and gas-hold interaction — performance gauges animate in sync with throttle input.",
    },
    {
      title: "Live configurator",
      description:
        "Rosso Mars, Verde Mantis, Giallo Orion, and more — gloss, matte, and metallic finishes with rim color, carbon fiber, and environment presets.",
    },
    {
      title: "Interior customization",
      description:
        "Seat leather swatches, stitching accents, and ambient cabin lighting — all wired through shared Zustand state so exterior and interior stay in sync.",
    },
    {
      title: "Drive experience modes",
      description:
        "Race, Sport, and Wet profiles with distinct copy and spec callouts — 0–100 km/h, top speed, and drivetrain details per mode.",
    },
    {
      title: "Garage & chapter nav",
      description:
        "Vertical section dots, scroll-to-ignite narrative, and a Garage flow to browse and compare configured builds across the experience.",
    },
  ],
  sections: [
    {
      id: "overview",
      label: "Overview",
      title: "Automotive storytelling in the browser",
      body: [
        "This concept demo recreates the feeling of a Ferrari showroom launch page — without leaving the web. The hero drops visitors straight into a cinematic 3D stage where the 458 Italia becomes the focal point.",
        "Every chapter below the fold extends the narrative: component deep-dives, ignition theatre, performance telemetry, drive profiles, engine anatomy, color configurator, and interior craft — all scroll-linked and motion-polished.",
      ],
    },
    {
      id: "challenge",
      label: "Challenge",
      title: "Luxury fidelity on the open web",
      body: [
        "High-end automotive sites rely on video and static renders. The goal here was real-time 3D interactivity — drag rotation, live paint swaps, engine sound — while keeping load times acceptable and touch gestures natural on mobile.",
      ],
      bullets: [
        "Balance GLB weight vs. visual fidelity across devices",
        "Sync 3D material updates with configurator UI instantly",
        "Coordinate scroll chapters, audio, and WebGL without jank",
        "Maintain a premium dark aesthetic with accessible contrast",
      ],
    },
    {
      id: "approach",
      label: "Approach",
      title: "R3F scene graph + Zustand orchestration",
      body: [
        "React Three Fiber owns the canvas lifecycle — camera, lights, model loading, and per-frame updates. Zustand stores paint selection, interior options, engine state, and garage entries so UI panels and the 3D mesh read from one source of truth.",
        "Framer Motion handles hero typography, chapter entrances, button hovers, and scroll-reveal timing. Lenis-style smooth scrolling ties section transitions to the vertical dot navigation.",
      ],
      bullets: [
        "Drei helpers for environment maps, contact shadows, and HTML overlays",
        "Lazy-loaded audio sprites for engine start, idle, and rev layers",
        "Reduced-motion and low-end device fallbacks for the 3D stage",
        "Vercel edge deployment with compressed assets and code splitting",
      ],
    },
    {
      id: "outcome",
      label: "Outcome",
      title: "A portfolio-grade interactive demo",
      body: [
        "The shipped experience demonstrates end-to-end creative frontend craft — from WebGL scene composition to micro-interactions and stateful product configuration. It reads as a luxury brand microsite while remaining fully explorable in the browser.",
      ],
    },
  ],
  stack: [
    { name: "Three.js", detail: "WebGL rendering, materials, lighting" },
    { name: "React Three Fiber", detail: "Declarative 3D scene in React" },
    { name: "@react-three/drei", detail: "Controls, environments, helpers" },
    { name: "Zustand", detail: "Configurator, engine, and garage state" },
    { name: "Framer Motion", detail: "Scroll reveals, hero motion, UI transitions" },
    { name: "TypeScript", detail: "Typed stores, props, and scene contracts" },
  ],
};

const BALL_PUZZLE: CaseStudy = {
  slug: "ball-puzzle",
  eyebrow: "3D Physics · Browser Arcade · 2025",
  headline: ["Roll.", "Collect.", "Clear."],
  subheadline:
    "A full browser arcade loop — 1,000 procedural stages across six difficulties, silver and gold coin XP, 174 unlockable ball skins, and per-mode progress saves.",
  heroImage: "/projects/ball-puzzle-hero.png",
  heroImageAlt: "BALLPUZZLE 3D rolling ball racing along a neon-lit space path with coins and a finish portal",
  theme: {
    primary: "#7c3aed",
    secondary: "#0891b2",
    accent: "#34d399",
  },
  stats: [
    { value: "1,000", label: "Procedural stages" },
    { value: "6", label: "Difficulty modes" },
    { value: "174", label: "Ball skins" },
    { value: "60fps", label: "Target frame rate" },
  ],
  features: [
    {
      title: "Procedural stage layouts",
      description:
        "Unique floating-platform routes every run — Wide Plaza, Sky Highway, Moving Maze, Narrow Gauntlet, and more — with start, caution, and finish zones mapped on the in-stage minimap.",
    },
    {
      title: "Six difficulty modes",
      description:
        "Light through Legendary tiers with distinct hazard density. Each mode maintains its own save slot, loop counter, and stage progress — pick up exactly where you left off.",
    },
    {
      title: "Stacked jump mechanics",
      description:
        "WASD roll and steer with momentum over gaps. Tap Space to jump — stack up to 100× for huge vertical clears on tower climbs and spiral ascents.",
    },
    {
      title: "Coin XP & cosmetics",
      description:
        "Silver pickups award 10 XP, gold awards 30 XP with burst effects. Earnings persist across runs and unlock 174 ball skins — classic, football, and gradient styles from starter to legendary tiers.",
    },
    {
      title: "Stage select & auto-save",
      description:
        "Home menu flows into mode picker, continue-or-new-game, and stage map. Progress auto-saves after every cleared finish ring — six independent save slots, one per difficulty.",
    },
    {
      title: "Full game loop polish",
      description:
        "From attract screen stats to in-run HUD, finish-ring celebrations, and loop-again harder tiers after clearing all 1,000 stages — every screen built for repeat play.",
    },
  ],
  sections: [
    {
      id: "overview",
      label: "Overview",
      title: "Browser arcade at full scale",
      body: [
        "BALLPUZZLE drops players straight into a 3D rolling-ball experience — no install, no plugin. The home screen surfaces the full scope: 1,000 stages, six modes, and 174 skins waiting to be unlocked.",
        "Each stage is a self-contained physics puzzle: steer across floating platforms, time stacked jumps, collect coins on riskier paths, and roll through the green finish ring to advance.",
      ],
    },
    {
      id: "challenge",
      label: "Challenge",
      title: "Real-time physics without compromise",
      body: [
        "Rolling-ball games live or die on feel — momentum, jump timing, and platform collision must stay crisp at 60fps while procedural layouts scale from gentle wide plazas to legendary narrow gauntlets.",
      ],
      bullets: [
        "Generate varied stage geometry without repeating layouts across 1,000 levels",
        "Keep jump stacking responsive up to 100× without physics instability",
        "Persist six independent save states with coins, XP, and loop counts",
        "Render minimap, coin bursts, and skin previews without frame drops",
      ],
    },
    {
      id: "approach",
      label: "Approach",
      title: "WebGL scene + procedural stage pipeline",
      body: [
        "React Three Fiber drives the 3D ball, platforms, hazards, and finish ring with a physics-backed roll controller. Stage definitions feed procedural layout generators per difficulty tier — platform width, gap size, mover speed, and hazard density all scale with mode level.",
        "Local storage handles per-mode saves: current stage, coin balance, unlocked skins, and loop count. The home menu, stage select, and in-run HUD share one state layer so continue flows feel instant.",
      ],
      bullets: [
        "Procedural stage templates per difficulty — plaza, highway, maze, gauntlet variants",
        "Stacked jump input with capped multiplier and vertical clearance tuning",
        "Coin pickup VFX with silver/gold XP tiers and skin-shop integration",
        "Minimap overlay tracking start, caution zones, coins, and finish ring",
      ],
    },
    {
      id: "outcome",
      label: "Outcome",
      title: "A complete arcade experience on the web",
      body: [
        "The shipped build demonstrates end-to-end game frontend craft — procedural content, physics feel, progression systems, and cosmetic unlocks — all running in the browser with zero install.",
      ],
    },
  ],
  stack: [
    { name: "Three.js", detail: "WebGL rendering, lighting, materials" },
    { name: "React Three Fiber", detail: "Declarative 3D game scene in React" },
    { name: "@react-three/drei", detail: "Helpers, controls, environment" },
    { name: "React", detail: "UI shell, menus, stage select flows" },
    { name: "TypeScript", detail: "Typed stage configs, saves, and game state" },
    { name: "Vercel", detail: "Edge deployment, instant play in browser" },
  ],
};

const PACK_AND_SHIP: CaseStudy = {
  slug: "pack-and-ship",
  eyebrow: "Animated E-Commerce · 2025",
  headline: ["Shop", "in 2D.", "Ship in 3D."],
  subheadline:
    "A cycling Three.js storefront across fruits, electronics, and furniture — 3D hero previews, checkout pack animations, and live delivery tracking with a truck journey.",
  theme: {
    primary: "#f59e0b",
    secondary: "#0d9488",
    accent: "#fbbf24",
  },
  stats: [
    { value: "15+", label: "Products" },
    { value: "3", label: "Categories" },
    { value: "3D", label: "Pack & track" },
    { value: "100%", label: "Demo-ready" },
  ],
  features: [
    {
      title: "Cycling 3D hero showcase",
      description:
        "Drag-to-orbit hero cycles Fruits, Electronics, and Furniture every five seconds — each category with its own 3D product stage and tailored lighting.",
    },
    {
      title: "Curated product shop",
      description:
        "Featured picks across honeycrisp apples, organic bananas, tech gadgets, and home furniture — add-to-cart flows with clean 2D product cards and pricing.",
    },
    {
      title: "Pack animation on checkout",
      description:
        "Cart checkout triggers a live 3D box-sealing sequence — items animate into a shipping carton with satisfying close-and-tape motion before order confirmation.",
    },
    {
      title: "Live delivery tracking",
      description:
        "Track Order view maps a truck journey from warehouse to doorstep — animated route progress with delivery history persisted across sessions.",
    },
    {
      title: "Cart & order history",
      description:
        "Full e-commerce shell — browse, cart, checkout, track, and delivery history — wired as a cohesive demo with no signup required.",
    },
    {
      title: "Category-driven merchandising",
      description:
        "Fruit, tech, and home verticals each get distinct visual treatment in the hero and shop grid, making the single-page demo feel like three storefronts in one.",
    },
  ],
  sections: [
    {
      id: "overview",
      label: "Overview",
      title: "E-commerce with a 3D delivery story",
      body: [
        "Pack & Ship reframes a standard shop flow — the headline promise is literal: browse and buy in familiar 2D cards, then watch your order come alive in 3D at checkout and tracking.",
        "The hero cycles product categories on a draggable orbit stage while featured picks below drive the cart. Every purchase closes the loop with pack animation and a truck-on-route tracking view.",
      ],
    },
    {
      id: "challenge",
      label: "Challenge",
      title: "Utility UX meets WebGL spectacle",
      body: [
        "E-commerce demos often stop at product grids. The goal here was to keep shopping fast and readable while reserving 3D for high-impact moments — hero showcase, box packing, and delivery tracking — without blocking the purchase path.",
      ],
      bullets: [
        "Cycle three distinct 3D product stages without layout shift or load spikes",
        "Transition from 2D cart UI into a seamless pack animation on checkout",
        "Animate truck progress on a tracking map that feels live, not decorative",
        "Keep the full shop → cart → track → history loop demo-ready with no backend",
      ],
    },
    {
      id: "approach",
      label: "Approach",
      title: "R3F scenes at key conversion moments",
      body: [
        "React Three Fiber powers the hero orbit stage, checkout pack sequence, and tracking truck scene. Each WebGL moment mounts on demand so the 2D shop grid stays lightweight.",
        "Category configs drive which 3D models and materials load in the hero cycle. Cart state flows into the pack animation — items visually settle into the box before the order handoff to tracking.",
      ],
      bullets: [
        "Timed category carousel with drag-to-orbit override on the hero canvas",
        "Featured product grid with add-to-cart and persistent cart drawer",
        "Box-seal pack timeline synced to checkout confirmation state",
        "Delivery history and track views with animated route progress",
      ],
    },
    {
      id: "outcome",
      label: "Outcome",
      title: "A portfolio-grade commerce demo",
      body: [
        "The shipped experience shows how creative frontend work can elevate everyday flows — shopping stays familiar, but packing and delivery become memorable 3D moments that sell the craft.",
      ],
    },
  ],
  stack: [
    { name: "Three.js", detail: "WebGL product stages, pack & truck scenes" },
    { name: "React Three Fiber", detail: "Declarative 3D in React views" },
    { name: "@react-three/drei", detail: "Orbit controls, environments, helpers" },
    { name: "React", detail: "Shop grid, cart, track, and history UI" },
    { name: "Framer Motion", detail: "Page transitions and UI micro-interactions" },
    { name: "TypeScript", detail: "Typed products, cart, and order state" },
  ],
};

const CASE_STUDIES: Record<string, CaseStudy> = {
  "ferrari-458": FERRARI_458,
  "ball-puzzle": BALL_PUZZLE,
  "pack-and-ship": PACK_AND_SHIP,
};

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return CASE_STUDIES[slug];
}
