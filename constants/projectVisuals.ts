export type ProjectVisualColors = {
  primary: string;
  secondary: string;
  accent: string;
  orbitDuration?: string;
  globeSpinDuration?: string;
};

export const PROJECT_VISUALS: Record<string, ProjectVisualColors> = {
  nexus: { primary: "#2563eb", secondary: "#9333ea", accent: "#06b6d4", orbitDuration: "18s", globeSpinDuration: "32s" },
  aurora: { primary: "#9333ea", secondary: "#db2777", accent: "#f472b6", orbitDuration: "22s", globeSpinDuration: "38s" },
  pulse: { primary: "#0891b2", secondary: "#0d9488", accent: "#10b981", orbitDuration: "20s", globeSpinDuration: "34s" },
  vertex: { primary: "#7c3aed", secondary: "#4f46e5", accent: "#818cf8", orbitDuration: "24s", globeSpinDuration: "40s" },
  flux: { primary: "#ea580c", secondary: "#d97706", accent: "#eab308", orbitDuration: "19s", globeSpinDuration: "30s" },
  orbit: { primary: "#e11d48", secondary: "#dc2626", accent: "#f97316", orbitDuration: "21s", globeSpinDuration: "36s" },
};

export const DEFAULT_PROJECT_VISUAL: ProjectVisualColors = {
  primary: "#8b5cf6",
  secondary: "#6366f1",
  accent: "#22d3ee",
};

export function getProjectVisual(id: string): ProjectVisualColors {
  return PROJECT_VISUALS[id] ?? DEFAULT_PROJECT_VISUAL;
}
