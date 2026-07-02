export type ProjectVisualColors = {
  primary: string;
  secondary: string;
  accent: string;
  orbitDuration?: string;
  globeSpinDuration?: string;
};

export const PROJECT_VISUALS: Record<string, ProjectVisualColors> = {
  "ferrari-458": { primary: "#dc2626", secondary: "#991b1b", accent: "#fbbf24", orbitDuration: "16s", globeSpinDuration: "28s" },
  "ball-puzzle": { primary: "#7c3aed", secondary: "#0891b2", accent: "#34d399", orbitDuration: "17s", globeSpinDuration: "30s" },
  "pack-and-ship": { primary: "#f59e0b", secondary: "#0d9488", accent: "#fbbf24", orbitDuration: "18s", globeSpinDuration: "32s" },
};

export const DEFAULT_PROJECT_VISUAL: ProjectVisualColors = {
  primary: "#8b5cf6",
  secondary: "#6366f1",
  accent: "#22d3ee",
};

export function getProjectVisual(id: string): ProjectVisualColors {
  return PROJECT_VISUALS[id] ?? DEFAULT_PROJECT_VISUAL;
}
