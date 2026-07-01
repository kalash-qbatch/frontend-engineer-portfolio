type HeroBlobReadyListener = () => void;

let heroBlobReady = false;
const listeners = new Set<HeroBlobReadyListener>();

export function isHeroBlobReady(): boolean {
  return heroBlobReady;
}

export function markHeroBlobReady(): void {
  if (heroBlobReady) return;
  heroBlobReady = true;
  listeners.forEach((listener) => listener());
}

export function subscribeHeroBlobReady(listener: HeroBlobReadyListener): () => void {
  if (heroBlobReady) listener();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function resetHeroBlobReady(): void {
  heroBlobReady = false;
  listeners.clear();
}
