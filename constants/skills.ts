import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiJavascript,
  SiTailwindcss,
  SiVuedotjs,
  SiGatsby,
  SiThreedotjs,
  SiNodedotjs,
  SiGit,
} from "react-icons/si";
import { TbApi, TbAccessible, TbCode, TbRocket, TbServer, TbSparkles, TbTool } from "react-icons/tb";
import { IconType } from "react-icons";

export type SkillCategory = "frontend" | "animations" | "backend" | "tools";

export interface Skill {
  name: string;
  icon: IconType;
  category: SkillCategory;
  level: number;
  color: string;
}

export const SKILLS: Skill[] = [
  { name: "React", icon: SiReact, category: "frontend", level: 95, color: "#61DAFB" },
  { name: "Next.js", icon: SiNextdotjs, category: "frontend", level: 92, color: "#ffffff" },
  { name: "TypeScript", icon: SiTypescript, category: "frontend", level: 90, color: "#3178C6" },
  { name: "JavaScript", icon: SiJavascript, category: "frontend", level: 95, color: "#F7DF1E" },
  { name: "Tailwind", icon: SiTailwindcss, category: "frontend", level: 93, color: "#06B6D4" },
  { name: "Vue.js", icon: SiVuedotjs, category: "frontend", level: 86, color: "#4FC08D" },
  { name: "Gatsby", icon: SiGatsby, category: "frontend", level: 82, color: "#663399" },
  { name: "Three.js", icon: SiThreedotjs, category: "animations", level: 85, color: "#ffffff" },
  { name: "R3F", icon: SiThreedotjs, category: "animations", level: 82, color: "#8B5CF6" },
  { name: "Framer Motion", icon: TbSparkles, category: "animations", level: 90, color: "#BB4B96" },
  { name: "GSAP", icon: TbRocket, category: "animations", level: 80, color: "#88CE02" },
  { name: "Node.js", icon: SiNodedotjs, category: "backend", level: 78, color: "#339933" },
  { name: "REST APIs", icon: TbApi, category: "backend", level: 85, color: "#3B82F6" },
  { name: "Git", icon: SiGit, category: "tools", level: 90, color: "#F05032" },
  { name: "Performance", icon: TbRocket, category: "tools", level: 88, color: "#22D3EE" },
  { name: "Accessibility", icon: TbAccessible, category: "tools", level: 85, color: "#A78BFA" },
];

export interface SkillCategoryMeta {
  id: SkillCategory;
  label: string;
  color: string;
  description: string;
  icon: IconType;
}

export const SKILL_CATEGORIES: SkillCategoryMeta[] = [
  {
    id: "frontend",
    label: "Frontend",
    color: "#61DAFB",
    description: "React, Next.js, Vue, Gatsby, and type-safe UI systems.",
    icon: TbCode,
  },
  {
    id: "animations",
    label: "Animations",
    color: "#EC4899",
    description: "Motion libraries, WebGL, and scroll narratives.",
    icon: TbSparkles,
  },
  {
    id: "backend",
    label: "Backend",
    color: "#4ADE80",
    description: "APIs, Node.js, and full-stack integration.",
    icon: TbServer,
  },
  {
    id: "tools",
    label: "Tools",
    color: "#22D3EE",
    description: "Git, performance, and accessibility workflows.",
    icon: TbTool,
  },
];

export function getSkillsByCategory(category: SkillCategory): Skill[] {
  return SKILLS.filter((s) => s.category === category);
}

export const SKILLS_BY_CATEGORY: Record<SkillCategory, Skill[]> = {
  frontend: getSkillsByCategory("frontend"),
  animations: getSkillsByCategory("animations"),
  backend: getSkillsByCategory("backend"),
  tools: getSkillsByCategory("tools"),
};

export function getCategoryMeta(category: SkillCategory): SkillCategoryMeta {
  return SKILL_CATEGORIES.find((c) => c.id === category) ?? SKILL_CATEGORIES[0];
}

export function getCategoryColor(category: SkillCategory): string {
  return SKILL_CATEGORIES.find((c) => c.id === category)?.color ?? "#8B5CF6";
}

export function getCategoryLabel(category: SkillCategory): string {
  return SKILL_CATEGORIES.find((c) => c.id === category)?.label ?? category;
}

function parseHex(color: string) {
  const hex = color.replace("#", "");
  const normalized =
    hex.length === 3 ? hex.split("").map((c) => c + c).join("") : hex.padStart(6, "0").slice(0, 6);
  return {
    r: parseInt(normalized.slice(0, 2), 16),
    g: parseInt(normalized.slice(2, 4), 16),
    b: parseInt(normalized.slice(4, 6), 16),
  };
}

/** Ensures icons stay visible on light pin/chip backgrounds */
export function getSkillIconColor(color: string): string {
  const { r, g, b } = parseHex(color);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.68 ? "#18181b" : color;
}
