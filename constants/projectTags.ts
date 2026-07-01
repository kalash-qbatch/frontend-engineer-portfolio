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
  SiStripe,
  SiStorybook,
  SiRedis,
} from "react-icons/si";
import { TbAccessible, TbApi, TbBolt, TbCode, TbForms, TbRocket, TbSparkles } from "react-icons/tb";
import type { IconType } from "react-icons";
import { SKILLS } from "@/constants/skills";

export type ProjectTagMeta = {
  name: string;
  icon: IconType;
  color: string;
};

const EXTRA_TAGS: Record<string, { icon: IconType; color: string }> = {
  stripe: { icon: SiStripe, color: "#635BFF" },
  storybook: { icon: SiStorybook, color: "#FF4785" },
  redis: { icon: SiRedis, color: "#DC382D" },
  websockets: { icon: TbBolt, color: "#3B82F6" },
  "react hook form": { icon: TbForms, color: "#EC5990" },
  lenis: { icon: TbRocket, color: "#8B5CF6" },
  r3f: { icon: SiThreedotjs, color: "#8B5CF6" },
  "rest apis": { icon: TbApi, color: "#3B82F6" },
};

export function resolveProjectTags(tags: string[], limit = 4): ProjectTagMeta[] {
  return tags.slice(0, limit).map((tag) => {
    const skill = SKILLS.find((s) => s.name.toLowerCase() === tag.toLowerCase());
    if (skill) {
      return { name: skill.name, icon: skill.icon, color: skill.color };
    }

    const extra = EXTRA_TAGS[tag.toLowerCase()];
    if (extra) {
      return { name: tag, icon: extra.icon, color: extra.color };
    }

    const fallbackIcons: Record<string, IconType> = {
      react: SiReact,
      "next.js": SiNextdotjs,
      typescript: SiTypescript,
      javascript: SiJavascript,
      tailwind: SiTailwindcss,
      "vue.js": SiVuedotjs,
      vue: SiVuedotjs,
      gatsby: SiGatsby,
      "three.js": SiThreedotjs,
      gsap: TbRocket,
      "framer motion": TbSparkles,
      accessibility: TbAccessible,
      git: SiGit,
      "node.js": SiNodedotjs,
    };

    const icon = fallbackIcons[tag.toLowerCase()] ?? TbCode;
    return { name: tag, icon, color: "#a78bfa" };
  });
}
