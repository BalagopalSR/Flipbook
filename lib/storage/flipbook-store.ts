import { mkdir, readFile, readdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { del, list, put, type ListBlobResultBlob } from "@vercel/blob";
import type { StoredFlipbook, StoredFlipbookSummary } from "@/lib/flipbook-db";

const BLOB_PREFIX = "flipbooks";
const INDEX_NAME = "_index.json";
const LOCAL_DIR = path.join(process.cwd(), "data", "flipbooks");

function usesBlobStorage(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

function blobPath(id: string): string {
  return `${BLOB_PREFIX}/${id}.json`;
}

function indexPath(): string {
  return `${BLOB_PREFIX}/${INDEX_NAME}`;
}

function localPath(id: string): string {
  return path.join(LOCAL_DIR, `${id}.json`);
}

function localIndexPath(): string {
  return path.join(LOCAL_DIR, INDEX_NAME);
}

async function blobFetch(url: string): Promise<string> {
  const headers: HeadersInit = {};
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(url, { headers, cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to read blob: ${res.status}`);
  return res.text();
}

async function readIndex(): Promise<StoredFlipbookSummary[]> {
  if (usesBlobStorage()) {
    const { blobs } = await list({ prefix: indexPath(), limit: 1 });
    const indexBlob = blobs.find((b: ListBlobResultBlob) => b.pathname === indexPath());
    if (!indexBlob) return [];
    const raw = await blobFetch(indexBlob.url);
    return JSON.parse(raw) as StoredFlipbookSummary[];
  }

  try {
    const raw = await readFile(localIndexPath(), "utf8");
    return JSON.parse(raw) as StoredFlipbookSummary[];
  } catch {
    return [];
  }
}

async function writeIndex(entries: StoredFlipbookSummary[]): Promise<void> {
  const body = JSON.stringify(entries);
  if (usesBlobStorage()) {
    await put(indexPath(), body, {
      access: "private",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
    });
    return;
  }

  await mkdir(LOCAL_DIR, { recursive: true });
  await writeFile(localIndexPath(), body, "utf8");
}

function summaryFromStored(stored: StoredFlipbook): StoredFlipbookSummary {
  return {
    id: stored.id,
    title: stored.title,
    description: stored.description,
    sourceType: stored.sourceType,
    pageCount: stored.pageCount,
    coverImage: stored.coverImage,
    status: stored.status,
    createdAt: stored.createdAt,
    updatedAt: stored.updatedAt,
  };
}

async function readStored(id: string): Promise<StoredFlipbook | null> {
  if (usesBlobStorage()) {
    const pathname = blobPath(id);
    const { blobs } = await list({ prefix: pathname, limit: 10 });
    const match = blobs.find((b: ListBlobResultBlob) => b.pathname === pathname);
    if (!match) return null;
    const raw = await blobFetch(match.url);
    return JSON.parse(raw) as StoredFlipbook;
  }

  try {
    const raw = await readFile(localPath(id), "utf8");
    return JSON.parse(raw) as StoredFlipbook;
  } catch {
    return null;
  }
}

async function writeStored(stored: StoredFlipbook): Promise<void> {
  const body = JSON.stringify(stored);
  if (usesBlobStorage()) {
    await put(blobPath(stored.id), body, {
      access: "private",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
    });
  } else {
    await mkdir(LOCAL_DIR, { recursive: true });
    await writeFile(localPath(stored.id), body, "utf8");
  }

  const index = await readIndex();
  const summary = summaryFromStored(stored);
  const next = [summary, ...index.filter((e) => e.id !== stored.id)];
  next.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
  await writeIndex(next);
}

async function removeStored(id: string): Promise<boolean> {
  const existing = await readStored(id);
  if (!existing) return false;

  if (usesBlobStorage()) {
    const pathname = blobPath(id);
    const { blobs } = await list({ prefix: pathname, limit: 10 });
    const match = blobs.find((b: ListBlobResultBlob) => b.pathname === pathname);
    if (match) await del(match.url);
  } else {
    try {
      await unlink(localPath(id));
    } catch {
      return false;
    }
  }

  const index = await readIndex();
  await writeIndex(index.filter((e) => e.id !== id));
  return true;
}

/** Rebuild index from stored files (local dev helper). */
async function rebuildLocalIndex(): Promise<void> {
  if (usesBlobStorage()) return;
  await mkdir(LOCAL_DIR, { recursive: true });
  const files = await readdir(LOCAL_DIR);
  const summaries: StoredFlipbookSummary[] = [];
  for (const file of files) {
    if (!file.endsWith(".json") || file === INDEX_NAME) continue;
    const raw = await readFile(path.join(LOCAL_DIR, file), "utf8");
    summaries.push(summaryFromStored(JSON.parse(raw) as StoredFlipbook));
  }
  summaries.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
  await writeIndex(summaries);
}

export async function listStoredFlipbooks(): Promise<StoredFlipbookSummary[]> {
  let index = await readIndex();
  if (index.length > 0) return index;

  if (usesBlobStorage()) {
    const { blobs } = await list({ prefix: `${BLOB_PREFIX}/`, limit: 1000 });
    const summaries: StoredFlipbookSummary[] = [];
    for (const blob of blobs) {
      if (!blob.pathname.endsWith(".json") || blob.pathname.endsWith(INDEX_NAME)) continue;
      const raw = await blobFetch(blob.url);
      summaries.push(summaryFromStored(JSON.parse(raw) as StoredFlipbook));
    }
    summaries.sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
    if (summaries.length > 0) await writeIndex(summaries);
    return summaries;
  }

  await rebuildLocalIndex();
  return readIndex();
}

export async function getStoredFlipbook(id: string): Promise<StoredFlipbook | null> {
  return readStored(id);
}

export async function saveStoredFlipbook(stored: StoredFlipbook): Promise<void> {
  await writeStored(stored);
}

export async function deleteStoredFlipbook(id: string): Promise<boolean> {
  return removeStored(id);
}

export function getFlipbookStorageMode(): "blob" | "local" {
  return usesBlobStorage() ? "blob" : "local";
}
