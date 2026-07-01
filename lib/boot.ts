const BOOT_STORAGE_KEY = "portfolio:boot-complete";

export function shouldSkipBootLoader(): boolean {
  if (typeof window === "undefined") return false;

  try {
    return sessionStorage.getItem(BOOT_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

export function markBootComplete(): void {
  if (typeof window === "undefined") return;

  try {
    sessionStorage.setItem(BOOT_STORAGE_KEY, "true");
  } catch {
    // Ignore storage errors (private mode, etc.)
  }
}
