import { FaGraduationCap } from "react-icons/fa";
import { SiStripe, SiVercel } from "react-icons/si";
import { TbBriefcase, TbSchool, TbWorld } from "react-icons/tb";
import type { IconType } from "react-icons";

export interface TimelineItem {
  id: string;
  type: "work" | "education";
  title: string;
  organization: string;
  period: string;
  tag: string;
  description: string;
  highlights: string[];
  icon: IconType;
  typeIcon: IconType;
  color: string;
}

export const EXPERIENCE: TimelineItem[] = [
  {
    id: "exp-1",
    type: "work",
    title: "Senior Frontend Engineer",
    organization: "Vercel",
    period: "2023 — Present",
    tag: "Vercel",
    description:
      "Leading frontend architecture for developer tools. Built interactive 3D experiences, optimized bundle sizes by 40%, and mentored junior engineers.",
    highlights: ["3D dev tools", "40% bundle reduction", "Team mentorship"],
    icon: SiVercel,
    typeIcon: TbBriefcase,
    color: "#8B5CF6",
  },
  {
    id: "exp-2",
    type: "work",
    title: "Frontend Engineer",
    organization: "Stripe",
    period: "2021 — 2023",
    tag: "Stripe",
    description:
      "Developed payment dashboard components used by millions. Implemented complex data visualizations and accessibility improvements across the platform.",
    highlights: ["Payment dashboards", "Data visualization", "A11y improvements"],
    icon: SiStripe,
    typeIcon: TbBriefcase,
    color: "#635BFF",
  },
  {
    id: "exp-3",
    type: "work",
    title: "UI Developer",
    organization: "Freelance",
    period: "2019 — 2021",
    tag: "Freelance",
    description:
      "Delivered premium web experiences for startups and agencies. Specialized in React, Vue, Gatsby, animation, and performance optimization.",
    highlights: ["React · Vue · Gatsby", "Agency delivery", "Performance tuning"],
    icon: TbWorld,
    typeIcon: TbBriefcase,
    color: "#22D3EE",
  },
  {
    id: "edu-1",
    type: "education",
    title: "B.S. Computer Science",
    organization: "Stanford University",
    period: "2015 — 2019",
    tag: "Education",
    description:
      "Focus on human-computer interaction and graphics programming. Dean's List, ACM chapter president.",
    highlights: ["HCI focus", "Graphics programming", "Dean's List"],
    icon: TbSchool,
    typeIcon: FaGraduationCap,
    color: "#F59E0B",
  },
];
