import { Badge } from "@/components/ui/badge";
import type { Skill } from "@/constants/skills";

export function SkillBadge({ skill }: { skill: Skill }) {
  const Icon = skill.icon;

  return (
    <Badge variant="outline" className="gap-1.5">
      <Icon size={12} style={{ color: skill.color }} aria-hidden />
      {skill.name}
    </Badge>
  );
}
