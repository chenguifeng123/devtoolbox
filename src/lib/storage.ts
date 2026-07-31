const PREFIX = "devtoolbox_";

export function storageGet<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (raw === null) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function storageSet<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // storage full, silently fail
  }
}

let debounceTimers: Record<string, ReturnType<typeof setTimeout>> = {};

export function storageSetDebounced<T>(
  key: string,
  value: T,
  delay = 500
): void {
  if (debounceTimers[key]) clearTimeout(debounceTimers[key]);
  debounceTimers[key] = setTimeout(() => {
    storageSet(key, value);
    delete debounceTimers[key];
  }, delay);
}
