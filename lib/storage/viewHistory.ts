const HISTORY_KEY = "flipbook-view-history";
const MAX_HISTORY = 30;

export interface ViewHistoryEntry {
  flipbookId: string;
  title: string;
  coverImage?: string;
  viewedAt: string;
}

export function getViewHistory(): ViewHistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addToViewHistory(entry: Omit<ViewHistoryEntry, "viewedAt">): void {
  if (typeof window === "undefined") return;
  const history = getViewHistory().filter((h) => h.flipbookId !== entry.flipbookId);
  history.unshift({ ...entry, viewedAt: new Date().toISOString() });
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, MAX_HISTORY)));
}

export function removeFromViewHistory(flipbookId: string): void {
  if (typeof window === "undefined") return;
  const history = getViewHistory().filter((h) => h.flipbookId !== flipbookId);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export function pruneViewHistory(validFlipbookIds: string[]): void {
  if (typeof window === "undefined") return;
  const valid = new Set(validFlipbookIds);
  const history = getViewHistory().filter((h) => valid.has(h.flipbookId));
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export function clearViewHistory(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(HISTORY_KEY);
}
