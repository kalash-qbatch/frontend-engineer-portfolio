import { FaBriefcase, FaGraduationCap } from "react-icons/fa";

export interface TimelineItem {
  id: string;
  type: "work" | "education";
  title: string;
  organization: string;
  period: string;
  description: string;
  icon: typeof FaBriefcase;
}

export const EXPERIENCE: TimelineItem[] = [
  {
    id: "exp-1",
    type: "work",
    title: "Senior Frontend Engineer",
    organization: "Vercel",
    period: "2023 — Present",
    description:
      "Leading frontend architecture for developer tools. Built interactive 3D experiences, optimized bundle sizes by 40%, and mentored junior engineers.",
    icon: FaBriefcase,
  },
  {
    id: "exp-2",
    type: "work",
    title: "Frontend Engineer",
    organization: "Stripe",
    period: "2021 — 2023",
    description:
      "Developed payment dashboard components used by millions. Implemented complex data visualizations and accessibility improvements across the platform.",
    icon: FaBriefcase,
  },
  {
    id: "exp-3",
    type: "work",
    title: "UI Developer",
    organization: "Freelance",
    period: "2019 — 2021",
    description:
      "Delivered premium web experiences for startups and agencies. Specialized in React, animation, and performance optimization.",
    icon: FaBriefcase,
  },
  {
    id: "edu-1",
    type: "education",
    title: "B.S. Computer Science",
    organization: "Stanford University",
    period: "2015 — 2019",
    description:
      "Focus on human-computer interaction and graphics programming. Dean's List, ACM chapter president.",
    icon: FaGraduationCap,
  },
];
