import type { Flipbook, FlipbookPage } from "@/types/flipbook";
import { DEFAULT_ANALYTICS, DEFAULT_SETTINGS } from "@/types/flipbook";
import { mergeFlipbookSettings, sanitizeSettingsForClient } from "@/lib/flipbook-settings";
import { COVER_LONG_EDGE, resizeDataUrl } from "@/lib/converters/imageEncoding";

interface StoredPage extends Omit<FlipbookPage, "imageUrl" | "thumbnailUrl"> {
  imageData: string;
  thumbnailData?: string;
}

export function coverImageFromPagesData(
  pagesData: string,
  fallback?: string | null
): string | undefined {
  try {
    const pages = JSON.parse(pagesData) as StoredPage[];
    return pages[0]?.thumbnailData || pages[0]?.imageData || fallback || undefined;
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

export async function prepareFlipbookForDb(flipbook: Flipbook) {
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

export function flipbookFromDb(record: {
  id: string;
  title: string;
  description: string;
  sourceType: string;
  originalFileName: string | null;
  sourceUrl: string | null;
  pageCount: number;
  coverImage: string | null;
  status: string;
  settings: string;
  analytics: string;
  hotspots: string;
  pagesData: string;
  originalFileData: string | null;
  createdAt: Date;
  updatedAt: Date;
}): Flipbook {
  const pagesRaw = JSON.parse(record.pagesData) as StoredPage[];
  const pages: FlipbookPage[] = pagesRaw.map((p) => ({
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
    id: record.id,
    title: record.title,
    description: record.description,
    sourceType: record.sourceType as Flipbook["sourceType"],
    originalFileName: record.originalFileName || undefined,
    originalFileUrl: record.originalFileData || undefined,
    sourceUrl: record.sourceUrl || undefined,
    pageCount: record.pageCount,
    pages,
    coverImage:
      record.coverImage ||
      pages[0]?.thumbnailUrl ||
      pages[0]?.imageUrl ||
      undefined,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
    status: record.status as Flipbook["status"],
    settings: sanitizeSettingsForClient(mergeFlipbookSettings(JSON.parse(record.settings))),
    analytics: JSON.parse(record.analytics),
    hotspots: JSON.parse(record.hotspots),
  };
}

export function flipbookSummaryFromDb(record: {
  id: string;
  title: string;
  description: string;
  sourceType: string;
  pageCount: number;
  coverImage: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}): Flipbook {
  return {
    id: record.id,
    title: record.title,
    description: record.description,
    sourceType: record.sourceType as Flipbook["sourceType"],
    pageCount: record.pageCount,
    pages: [],
    coverImage: record.coverImage || undefined,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
    status: record.status as Flipbook["status"],
    settings: { ...DEFAULT_SETTINGS },
    analytics: { ...DEFAULT_ANALYTICS },
    hotspots: [],
  };
}
