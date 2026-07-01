type WebGLPriority = "hero" | "default";

const MAX_ACTIVE_CONTEXTS = 2;

let supported: boolean | null = null;
let activeCount = 0;
const holders = new Set<string>();
const priorities = new Map<string, WebGLPriority>();
const evictionCallbacks = new Map<string, () => void>();

export function isWebGLAvailable(): boolean {
  if (supported !== null) return supported;
  if (typeof window === "undefined") return false;

  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    supported = Boolean(gl);
    return supported;
  } catch {
    supported = false;
    return false;
  }
}

export function registerWebGLEviction(ownerId: string, callback: () => void): void {
  evictionCallbacks.set(ownerId, callback);
}

export function unregisterWebGLEviction(ownerId: string): void {
  evictionCallbacks.delete(ownerId);
}

function evictLowerPriorityContext(requested: WebGLPriority): boolean {
  if (requested !== "hero") return false;

  for (const id of holders) {
    if (priorities.get(id) !== "default") continue;
    evictionCallbacks.get(id)?.();
    releaseWebGLContext(id);
    return true;
  }

  return false;
}

export function acquireWebGLContext(
  ownerId: string,
  priority: WebGLPriority = "default"
): boolean {
  if (!isWebGLAvailable()) return false;
  if (holders.has(ownerId)) return true;

  if (activeCount >= MAX_ACTIVE_CONTEXTS && !evictLowerPriorityContext(priority)) {
    return false;
  }

  holders.add(ownerId);
  priorities.set(ownerId, priority);
  activeCount++;
  return true;
}

export function releaseWebGLContext(ownerId: string): void {
  if (!holders.has(ownerId)) return;
  holders.delete(ownerId);
  priorities.delete(ownerId);
  evictionCallbacks.delete(ownerId);
  activeCount = Math.max(0, activeCount - 1);
}

export function resetWebGLSupportCache(): void {
  supported = null;
}
