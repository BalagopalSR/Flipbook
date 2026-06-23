import type { Flipbook, FlipbookPage, FlipbookSettings } from "@/types/flipbook";
import { DEFAULT_ANALYTICS, DEFAULT_SETTINGS } from "@/types/flipbook";
import { mergeFlipbookSettings, sanitizeSettingsForClient } from "@/lib/flipbook-settings";
import { COVER_LONG_EDGE, resizeDataUrl } from "@/lib/converters/imageEncoding";

export interface StoredPage extends Omit<FlipbookPage, "imageUrl" | "thumbnailUrl"> {
  imageData: string;
  thumbnailData?: string;
}

export interface StoredFlipbook {
  id: string;
  title: string;
  description: string;
  sourceType: string;
  originalFileName?: string;
  sourceUrl?: string;
  pageCount: number;
  coverImage?: string;
  status: string;
  settings: FlipbookSettings;
  analytics: Flipbook["analytics"];
  hotspots: Flipbook["hotspots"];
  pages: StoredPage[];
  originalFileData?: string;
  createdAt: string;
  updatedAt: string;
}

export type StoredFlipbookSummary = Pick<
  StoredFlipbook,
  | "id"
  | "title"
  | "description"
  | "sourceType"
  | "pageCount"
  | "coverImage"
  | "status"
  | "createdAt"
  | "updatedAt"
>;

export function coverImageFromPages(pages: StoredPage[], fallback?: string | null): string | undefined {
  return pages[0]?.thumbnailData || pages[0]?.imageData || fallback || undefined;
}

/** @deprecated Use coverImageFromPages */
export function coverImageFromPagesData(
  pagesData: string,
  fallback?: string | null
): string | undefined {
  try {
    const pages = JSON.parse(pagesData) as StoredPage[];
    return coverImageFromPages(pages, fallback);
  } catch {
    return fallback || undefined;
  }
}

async function urlToDataUrl(url: string): Promise<string> {
  if (url.startsWith("data:")) return url;
  const res = await fetch(url);
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export async function prepareFlipbookForStorage(flipbook: Flipbook): Promise<StoredFlipbook> {
  const pages: StoredPage[] = await Promise.all(
    flipbook.pages.map(async (page) => {
      const imageData = await urlToDataUrl(page.imageUrl);
      let thumbnailData: string | undefined;
      if (page.thumbnailUrl) {
        thumbnailData = await urlToDataUrl(page.thumbnailUrl);
      }
      return {
        id: page.id,
        pageNumber: page.pageNumber,
        imageData,
        thumbnailData,
        width: page.width,
        height: page.height,
        sourceType: page.sourceType,
        rotation: page.rotation,
        isCover: page.isCover,
      };
    })
  );

  let originalFileData: string | undefined;
  if (flipbook.originalFileUrl) {
    try {
      originalFileData = await urlToDataUrl(flipbook.originalFileUrl);
    } catch {
      // blob may have been revoked
    }
  }

  let coverImage = flipbook.coverImage;
  if (coverImage && !coverImage.startsWith("data:")) {
    try {
      coverImage = await urlToDataUrl(coverImage);
    } catch {
      coverImage = undefined;
    }
  }

  if (!coverImage && pages[0]?.thumbnailData) {
    coverImage = pages[0].thumbnailData;
  } else if (!coverImage && pages[0]?.imageData) {
    coverImage = await resizeDataUrl(pages[0].imageData, COVER_LONG_EDGE);
  }

  return {
    id: flipbook.id,
    title: flipbook.title,
    description: flipbook.description || "",
    sourceType: flipbook.sourceType,
    originalFileName: flipbook.originalFileName,
    sourceUrl: flipbook.sourceUrl,
    pageCount: flipbook.pageCount,
    coverImage: coverImage || pages[0]?.thumbnailData || pages[0]?.imageData,
    status: flipbook.status,
    settings: flipbook.settings,
    analytics: flipbook.analytics,
    hotspots: flipbook.hotspots || [],
    pages,
    originalFileData,
    createdAt: flipbook.createdAt,
    updatedAt: flipbook.updatedAt,
  };
}

/** @deprecated Use prepareFlipbookForStorage */
export const prepareFlipbookForDb = prepareFlipbookForStorage;

export function flipbookFromStored(stored: StoredFlipbook): Flipbook {
  const pages: FlipbookPage[] = stored.pages.map((p) => ({
    id: p.id,
    pageNumber: p.pageNumber,
    imageUrl: p.imageData,
    thumbnailUrl: p.thumbnailData,
    width: p.width,
    height: p.height,
    sourceType: p.sourceType,
    rotation: p.rotation,
    isCover: p.isCover,
  }));

  return {
    id: stored.id,
    title: stored.title,
    description: stored.description,
    sourceType: stored.sourceType as Flipbook["sourceType"],
    originalFileName: stored.originalFileName,
    originalFileUrl: stored.originalFileData,
    sourceUrl: stored.sourceUrl,
    pageCount: stored.pageCount,
    pages,
    coverImage:
      stored.coverImage || pages[0]?.thumbnailUrl || pages[0]?.imageUrl || undefined,
    createdAt: stored.createdAt,
    updatedAt: stored.updatedAt,
    status: stored.status as Flipbook["status"],
    settings: sanitizeSettingsForClient(mergeFlipbookSettings(stored.settings)),
    analytics: stored.analytics,
    hotspots: stored.hotspots || [],
  };
}

export function flipbookSummaryFromStored(summary: StoredFlipbookSummary): Flipbook {
  return {
    id: summary.id,
    title: summary.title,
    description: summary.description,
    sourceType: summary.sourceType as Flipbook["sourceType"],
    pageCount: summary.pageCount,
    pages: [],
    coverImage: summary.coverImage,
    createdAt: summary.createdAt,
    updatedAt: summary.updatedAt,
    status: summary.status as Flipbook["status"],
    settings: { ...DEFAULT_SETTINGS },
    analytics: { ...DEFAULT_ANALYTICS },
    hotspots: [],
  };
}

/** @deprecated Use flipbookSummaryFromStored */
export const flipbookSummaryFromDb = flipbookSummaryFromStored;
