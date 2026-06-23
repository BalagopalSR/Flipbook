import type { Flipbook, FlipbookPage } from "@/types/flipbook";
import { saveFlipbook } from "./flipbookStorage";
import { generateId } from "@/lib/utils/generateId";

interface ExportedPage extends Omit<FlipbookPage, "imageUrl" | "thumbnailUrl"> {
  imageData: string;
  thumbnailData?: string;
}

export interface ExportedFlipbook
  extends Omit<Flipbook, "pages" | "originalFileUrl" | "coverImage"> {
  pages: ExportedPage[];
  coverImageData?: string;
  originalFileData?: string;
  originalFileName?: string;
  exportVersion: 1;
}

async function urlToDataUrl(url: string): Promise<string> {
  const res = await fetch(url);
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function dataUrlToObjectUrl(dataUrl: string): string {
  return dataUrl;
}

export async function exportFlipbookToFile(flipbook: Flipbook): Promise<void> {
  const pages: ExportedPage[] = await Promise.all(
    flipbook.pages.map(async (page) => {
      const imageData = page.imageUrl.startsWith("data:")
        ? page.imageUrl
        : await urlToDataUrl(page.imageUrl);
      let thumbnailData: string | undefined;
      if (page.thumbnailUrl) {
        thumbnailData = page.thumbnailUrl.startsWith("data:")
          ? page.thumbnailUrl
          : await urlToDataUrl(page.thumbnailUrl);
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
      // Original file blob may have been revoked
    }
  }

  const exported: ExportedFlipbook = {
    exportVersion: 1,
    id: flipbook.id,
    title: flipbook.title,
    description: flipbook.description,
    sourceType: flipbook.sourceType,
    originalFileName: flipbook.originalFileName,
    sourceUrl: flipbook.sourceUrl,
    pageCount: flipbook.pageCount,
    pages,
    coverImageData: pages[0]?.thumbnailData || pages[0]?.imageData,
    originalFileData,
    createdAt: flipbook.createdAt,
    updatedAt: flipbook.updatedAt,
    status: flipbook.status,
    settings: flipbook.settings,
    analytics: flipbook.analytics,
    hotspots: flipbook.hotspots,
  };

  const blob = new Blob([JSON.stringify(exported)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${flipbook.title.replace(/[^a-z0-9]/gi, "_")}.flipbook.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function importFlipbookFromFile(file: File): Promise<Flipbook> {
  const text = await file.text();
  const exported: ExportedFlipbook = JSON.parse(text);

  if (!exported.exportVersion || !exported.pages?.length) {
    throw new Error("Invalid flipbook file format.");
  }

  const pages: FlipbookPage[] = exported.pages.map((p) => ({
    id: p.id || generateId(),
    pageNumber: p.pageNumber,
    imageUrl: dataUrlToObjectUrl(p.imageData),
    thumbnailUrl: p.thumbnailData ? dataUrlToObjectUrl(p.thumbnailData) : undefined,
    width: p.width,
    height: p.height,
    sourceType: p.sourceType,
    rotation: p.rotation,
    isCover: p.isCover,
  }));

  const flipbook: Flipbook = {
    id: generateId(),
    title: exported.title,
    description: exported.description,
    sourceType: exported.sourceType,
    originalFileName: exported.originalFileName,
    originalFileUrl: exported.originalFileData
      ? dataUrlToObjectUrl(exported.originalFileData)
      : undefined,
    sourceUrl: exported.sourceUrl,
    pageCount: pages.length,
    pages,
    coverImage: exported.coverImageData
      ? dataUrlToObjectUrl(exported.coverImageData)
      : pages[0]?.thumbnailUrl || pages[0]?.imageUrl,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: "published",
    settings: exported.settings,
    analytics: exported.analytics || {
      views: 0,
      uniqueViewers: 0,
      downloads: 0,
      shares: 0,
      averageReadTime: 0,
      completionRate: 0,
      pageViews: {},
    },
    hotspots: exported.hotspots || [],
  };

  await saveFlipbook(flipbook);
  return flipbook;
}
