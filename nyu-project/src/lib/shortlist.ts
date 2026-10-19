const STORAGE_KEY = "violet-nyu-shortlist";

export function readShortlist(): string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is string => typeof item === "string");
  } catch {
    return [];
  }
}

export function writeShortlist(ids: string[]): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}
