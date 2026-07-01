import {
  IMAGE_FRAMING,
  PORTFOLIO_IMAGES,
  type ImageTone,
  type ImageTreatment,
  type PortfolioImageKey,
} from "@/constants/images";

export type PortraitSide = "left" | "right";

export interface ScrollChapter {
  id: string;
  anchor: string;
  index: string;
  label: string;
  title: string;
  caption: string;
  description: string;
  side: PortraitSide;
  scale?: number;
  rotate?: number;
  imageKey: PortfolioImageKey;
  image: string;
  imageVariant?: "featured" | "ambient";
  imageGradient?: string;
  imageObjectPosition?: string;
  imageTreatment?: ImageTreatment;
  imageTone?: ImageTone;
}

/** One portrait per scroll chapter — hero uses `heroCutout` separately */
export const SCROLL_CHAPTER_IMAGE_KEYS = [
  "executive",
  "office",
  "outdoor",
  "contact",
] as const satisfies readonly PortfolioImageKey[];

function chapterImage(key: PortfolioImageKey) {
  return {
    imageKey: key,
    image: PORTFOLIO_IMAGES[key],
    imageObjectPosition: IMAGE_FRAMING[key],
  };
}

export const SCROLL_CHAPTERS: ScrollChapter[] = [
  {
    id: "about",
    anchor: "about",
    index: "01",
    label: "About",
    title: "Engineering with taste",
    caption: "The craft",
    description:
      "I build interfaces where performance, accessibility, and motion design work together — not against each other.",
    side: "left",
    scale: 1,
    rotate: -2,
    ...chapterImage("executive"),
    imageVariant: "featured",
    imageTreatment: "cover",
    imageTone: "neutral",
    imageGradient: "from-violet-600/20 via-transparent to-blue-600/15",
  },
  {
    id: "skills",
    anchor: "skills",
    index: "02",
    label: "Expertise",
    title: "Tools I reach for daily",
    caption: "The stack",
    description:
      "React, Next.js, Vue, Gatsby, WebGL, and motion libraries — chosen for speed, DX, and polish.",
    side: "right",
    scale: 1.05,
    rotate: 2,
    ...chapterImage("office"),
    imageVariant: "ambient",
    imageTreatment: "cover",
    imageTone: "cool",
    imageGradient: "from-cyan-600/15 via-transparent to-violet-600/10",
  },
  {
    id: "experience",
    anchor: "experience",
    index: "03",
    label: "Experience",
    title: "Where I've built",
    caption: "The journey",
    description:
      "From startups to scale-ups — shipping products used by millions.",
    side: "left",
    scale: 0.98,
    rotate: 1,
    ...chapterImage("outdoor"),
    imageVariant: "ambient",
    imageTreatment: "cover",
    imageTone: "neutral",
    imageGradient: "from-blue-600/15 via-transparent to-emerald-600/10",
  },
  {
    id: "services",
    anchor: "services",
    index: "04",
    label: "Services",
    title: "How I can help",
    caption: "The offering",
    description:
      "Frontend development, motion design, and performance — end to end.",
    side: "right",
    scale: 1.02,
    rotate: -1,
    ...chapterImage("contact"),
    imageVariant: "ambient",
    imageTreatment: "cover",
    imageTone: "warm",
    imageGradient: "from-amber-500/12 via-transparent to-violet-600/10",
  },
];
