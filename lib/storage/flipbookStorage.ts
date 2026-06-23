import type { Flipbook } from "@/types/flipbook";
import { prepareFlipbookForStorage } from "@/lib/flipbook-db";
import { removeFromViewHistory } from "@/lib/storage/viewHistory";

async function apiFetch(url: string, options?: RequestInit) {
  const res = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
  if (res.status === 401) {
    window.location.href = "/";
    throw new Error("Unauthorized");
  }
  return res;
}

export async function saveFlipbook(flipbook: Flipbook): Promise<void> {
  const prepared = await prepareFlipbookForStorage(flipbook);
  const res = await apiFetch(`/api/flipbooks/${flipbook.id}`, {
    method: "PUT",
    body: JSON.stringify(prepared),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to save flipbook");
  }
}

export async function getFlipbook(id: string): Promise<Flipbook | null> {
  const res = await apiFetch(`/api/flipbooks/${id}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to load flipbook");
  return res.json();
}

export async function getAllFlipbooks(): Promise<Flipbook[]> {
  const res = await apiFetch("/api/flipbooks");
  if (!res.ok) throw new Error("Failed to load flipbooks");
  return res.json();
}

export async function deleteFlipbook(id: string): Promise<void> {
  const res = await apiFetch(`/api/flipbooks/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete flipbook");
  removeFromViewHistory(id);
}

export async function duplicateFlipbook(id: string): Promise<Flipbook | null> {
  const res = await apiFetch(`/api/flipbooks/${id}/duplicate`, { method: "POST" });
  if (!res.ok) return null;
  const { id: newId } = await res.json();
  return getFlipbook(newId);
}
