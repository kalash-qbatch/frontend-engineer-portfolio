import { EXPERIENCE } from "@/constants/experience";
import { SERVICES } from "@/constants/services";
import { SKILLS } from "@/constants/skills";
import type { MarqueeStripItem } from "@/components/ui/MarqueeStrip";

function normalizeLabel(value: string) {
  return value.trim().toLowerCase().replace(/\.js$/i, "");
}

function findSkillForLabel(label: string) {
  const normalized = normalizeLabel(label);

  return SKILLS.find((skill) => {
    const skillName = normalizeLabel(skill.name);
    return (
      skillName === normalized ||
      skillName.startsWith(normalized) ||
      normalized.startsWith(skillName) ||
      (normalized === "framer" && skillName.includes("framer")) ||
      (normalized === "three" && skillName.includes("three"))
    );
  });
}

export function getSkillsMarqueeItems(): MarqueeStripItem[] {
  return SKILLS.map((skill) => ({
    id: skill.name,
    label: skill.name,
    icon: skill.icon,
    color: skill.color,
  }));
}

export function getExperienceMarqueeItems(): MarqueeStripItem[] {
  return EXPERIENCE.map((item) => ({
    id: item.id,
    label: `${item.organization} · ${item.period}`,
    icon: item.icon,
    color: item.color,
  }));
}

export function getServicesMarqueeItems(): MarqueeStripItem[] {
  return SERVICES.flatMap((service) => {
    const tagItems = service.tag.split("·").map((part) => {
      const label = part.trim();
      const skill = findSkillForLabel(label);

      return {
        id: `${service.id}-${label}`,
        label,
        icon: skill?.icon ?? service.icon,
        color: skill?.color ?? service.color,
      };
    });

    return [
      {
        id: service.id,
        label: service.title,
        icon: service.icon,
        color: service.color,
      },
      ...tagItems,
    ];
  });
}
